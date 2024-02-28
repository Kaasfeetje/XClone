import { COMMENTPERMISSIONS } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { deletePost } from "../helpers/deletePost";

export const postInclude = (userId: string) => ({
  user: true,
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
  fetchAll: protectedProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      where: {
        commentToId: null,
      },
      include: postInclude(ctx.session.user.id),
    });
    return posts;
  }),
  fetchProfilePosts: protectedProcedure
    .input(z.object({ username: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      const posts = await ctx.db.post.findMany({
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
      return posts;
    }),
  fetchProfileReplies: protectedProcedure
    .input(z.object({ username: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      const replies = await ctx.db.post.findMany({
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
      return replies;
    }),
  fetchProfileHighlights: protectedProcedure
    .input(z.object({ username: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      const highlightedPosts = await ctx.db.post.findMany({
        where: {
          highlight: {
            user: {
              username: input.username,
            },
          },
        },
        include: postInclude(ctx.session.user.id),
      });
      return highlightedPosts;
    }),
  fetchProfileLikes: protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input, ctx }) => {
      const likedPosts = await ctx.db.post.findMany({
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
      return likedPosts;
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
    .input(z.object({ postId: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      const comments = await ctx.db.post.findMany({
        where: {
          commentToId: input.postId,
        },
        include: postInclude(ctx.session.user.id),
      });
      return comments;
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
