import { COMMENTPERMISSIONS } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { deletePost } from "../helpers/deletePost";
import { getNextCreatedAtCursor } from "../helpers/getNextCursor";

export const postInclude = (userId: string) => ({
  user: {
    include: {
      followers: {
        where: {
          followerId: userId,
        },
      },
    },
  },
  images: true,
  likes: {
    where: {
      userId: userId,
    },
  },
  reposts: {
    where: {
      userId: userId,
    },
  },
  bookmarks: {
    where: {
      userId: userId,
    },
  },
  mentions: true,
  hashtags: true,
  highlight: true,
  _count: true,
});

const commentPermissionQuery = (userId: string) => ({
  OR: [
    {
      commentPermission: COMMENTPERMISSIONS.EVERYONE,
    },
    {
      commentPermission: COMMENTPERMISSIONS.FOLLOW,
      user: {
        OR: [
          {
            following: {
              some: {
                followedId: userId,
              },
            },
          },
          {
            id: userId,
          },
        ],
      },
    },
    {
      commentPermission: COMMENTPERMISSIONS.VERIFIED,
    },
    {
      commentPermission: COMMENTPERMISSIONS.MENTIONED,
      OR: [
        {
          mentions: {
            some: {
              id: userId,
            },
          },
        },
        {
          userId: userId,
        },
      ],
    },
  ],
});



export const POST_PER_REQUEST = 2;

export const postRouter = createTRPCRouter({
  //THIS IS FOR DEV ONLY OBVIOUSLY HAS TO BE REMOVED LATER
  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.post.updateMany({
      data: {
        commentToId: null,
      },
    });
    await ctx.db.post.deleteMany({});
  }),
  create: protectedProcedure
    .input(
      z.object({
        textContent: z.string().nullish(),
        commentPermission: z.nativeEnum(COMMENTPERMISSIONS),
        commentToId: z.string().nullish(),
        images: z.string().array().max(4).nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (input.commentToId) {
        const post = await ctx.db.post.findUnique({
          where: {
            id: input.commentToId,
            ...commentPermissionQuery(ctx.session.user.id),
          },
        });

        if (!post)
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to perform this action.",
          });
      }

      //Add mentions
      const mentionRegex = /@\w{1,50}/g;
      let usernamesMentioned = [];
      var match;
      while ((match = mentionRegex.exec(input.textContent!)) != null) {
        usernamesMentioned.push(match[0].replace("@", ""));
      }
      const mentions = await ctx.db.user.findMany({
        where: {
          username: {
            in: usernamesMentioned,
          },
        },
      });

      //Add hashtags
      const hashtagRegex = /#\w{1,50}/g;
      const hashtags = [];
      while ((match = hashtagRegex.exec(input.textContent!)) != null) {
        hashtags.push(match[0].replace("#", ""));
      }

      //create post
      const post = await ctx.db.post.create({
        data: {
          textContent: input.textContent,
          userId: ctx.session.user.id,
          commentToId: input.commentToId,
          commentPermission: input.commentPermission,
          mentions: {
            connect: mentions.map((m) => ({ id: m.id })),
          },
          hashtags: {
            connectOrCreate: hashtags.map((hashtag) => ({
              where: {
                hashtag,
              },
              create: { hashtag },
            })),
          },
          images: {
            connect: input.images?.map((image) => ({ id: image })),
          },
        },
      });

      return post;
    }),
  delete: protectedProcedure
    .input(z.object({ postId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.postId },
      });

      if (!post) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Post not found.",
        });
      }

      if (post.userId != ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action.",
        });
      }

      await deletePost(post.id);
    }),
  fetchAll: protectedProcedure
    .input(
      z.object({
        cursor: z.object({ id: z.string(), createdAt: z.date() }).nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const posts = await ctx.db.post.findMany({
        take: POST_PER_REQUEST + 1,
        cursor: input.cursor ? input.cursor : undefined,
        orderBy: { createdAt: "desc" },
        where: {
          commentToId: null,
        },
        include: postInclude(ctx.session.user.id),
      });
      const nextCursor = getNextCreatedAtCursor(posts, POST_PER_REQUEST);
      return { posts, nextCursor };
    }),
  fetchFollowing: protectedProcedure
    .input(
      z.object({
        cursor: z.object({ id: z.string(), createdAt: z.date() }).nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const posts = await ctx.db.post.findMany({
        take: POST_PER_REQUEST + 1,
        cursor: input.cursor ? input.cursor : undefined,
        orderBy: { createdAt: "desc" },
        where: {
          commentToId: null,
          OR: [
            {
              user: {
                followers: {
                  some: {
                    followerId: ctx.session.user.id,
                  },
                },
              },
            },
            {
              userId: ctx.session.user.id,
            },
          ],
        },
        include: postInclude(ctx.session.user.id),
      });
      const nextCursor = getNextCreatedAtCursor(posts, POST_PER_REQUEST);
      return { posts, nextCursor };
    }),
  fetchProfilePosts: protectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const posts = await ctx.db.post.findMany({
        take: POST_PER_REQUEST + 1,
        cursor: input.cursor ? input.cursor : undefined,
        orderBy: { createdAt: "desc" },
        where: {
          AND: [
            {
              user: {
                username: input.username,
              },
              commentToId: null,
            },
          ],
        },
        include: postInclude(ctx.session.user.id),
      });

      const nextCursor = getNextCreatedAtCursor(posts, POST_PER_REQUEST);

      return { posts, nextCursor };
    }),
  fetchProfileReplies: protectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const replies = await ctx.db.post.findMany({
        take: POST_PER_REQUEST + 1,
        cursor: input.cursor ? input.cursor : undefined,
        orderBy: { createdAt: "desc" },
        where: {
          AND: [
            {
              user: {
                username: input.username,
              },
              NOT: {
                commentToId: null,
              },
            },
          ],
        },
        include: postInclude(ctx.session.user.id),
      });
      const nextCursor = getNextCreatedAtCursor(replies, POST_PER_REQUEST);

      return { replies, nextCursor };
    }),
  fetchProfileHighlights: protectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const highlightedPosts = await ctx.db.post.findMany({
        take: POST_PER_REQUEST + 1,
        cursor: input.cursor ? input.cursor : undefined,
        orderBy: { createdAt: "desc" },
        where: {
          highlight: {
            user: {
              username: input.username,
            },
          },
        },
        include: postInclude(ctx.session.user.id),
      });
      const nextCursor = getNextCreatedAtCursor(
        highlightedPosts,
        POST_PER_REQUEST,
      );
      return { highlightedPosts, nextCursor };
    }),
  fetchProfileLikes: protectedProcedure
    .input(
      z.object({
        username: z.string(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const likedPosts = await ctx.db.post.findMany({
        take: POST_PER_REQUEST + 1,
        cursor: input.cursor ? input.cursor : undefined,
        orderBy: { createdAt: "desc" },
        where: {
          likes: {
            some: {
              user: {
                username: input.username,
              },
            },
          },
        },
        include: postInclude(ctx.session.user.id),
      });
      const nextCursor = getNextCreatedAtCursor(likedPosts, POST_PER_REQUEST);
      return { likedPosts, nextCursor };
    }),
  fetch: protectedProcedure
    .input(z.object({ postId: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
        include: postInclude(ctx.session.user.id),
      });
      return post;
    }),
  fetchComments: protectedProcedure
    .input(
      z.object({
        postId: z.string().min(1),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const comments = await ctx.db.post.findMany({
        take: POST_PER_REQUEST + 1,
        cursor: input.cursor ? input.cursor : undefined,
        orderBy: { createdAt: "desc" },
        where: {
          commentToId: input.postId,
        },
        include: postInclude(ctx.session.user.id),
      });
      const nextCursor = getNextCreatedAtCursor(comments, POST_PER_REQUEST);
      return { comments, nextCursor };
    }),
  fetchListPosts: protectedProcedure
    .input(
      z.object({
        listId: z.string().min(1),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const list = await ctx.db.list.findUnique({
        where: {
          id: input.listId,
        },
        include: {
          listMembers: {
            select: {
              memberId: true,
            },
          },
        },
      });

      const posts = await ctx.db.post.findMany({
        take: POST_PER_REQUEST + 1,
        cursor: input.cursor ? input.cursor : undefined,
        orderBy: { createdAt: "desc" },
        where: {
          userId: {
            in: list?.listMembers.map((user) => user.memberId),
          },
        },
        include: postInclude(ctx.session.user.id),
      });
      const nextCursor = getNextCreatedAtCursor(posts, POST_PER_REQUEST);

      return { posts, nextCursor };
    }),
  like: protectedProcedure
    .input(z.object({ postId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
      });

      if (!post)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Post does not exist.",
        });

      const postLike = await ctx.db.postLike.findUnique({
        where: {
          postId_userId: {
            postId: input.postId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (postLike) {
        return await ctx.db.postLike.delete({
          where: {
            postId_userId: {
              postId: input.postId,
              userId: ctx.session.user.id,
            },
          },
        });
      }
      return await ctx.db.postLike.create({
        data: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
    }),
  repost: protectedProcedure
    .input(z.object({ postId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
      });

      if (!post)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Post does not exist.",
        });

      const postRepost = await ctx.db.postRepost.findUnique({
        where: {
          postId_userId: {
            postId: input.postId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (postRepost) {
        return await ctx.db.postRepost.delete({
          where: {
            postId_userId: {
              postId: input.postId,
              userId: ctx.session.user.id,
            },
          },
        });
      }
      return await ctx.db.postRepost.create({
        data: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
    }),
  highlight: protectedProcedure
    .input(z.object({ postId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
      });

      if (!post)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Post does not exist.",
        });

      if (post.userId != ctx.session.user.id)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action.",
        });

      const highlightExists = await ctx.db.postHighlight.findUnique({
        where: {
          postId_userId: {
            postId: input.postId,
            userId: ctx.session.user.id,
          },
        },
      });

      if (highlightExists) {
        return await ctx.db.postHighlight.delete({
          where: {
            postId_userId: {
              postId: input.postId,
              userId: ctx.session.user.id,
            },
          },
        });
      }

      return await ctx.db.postHighlight.create({
        data: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
    }),
});
