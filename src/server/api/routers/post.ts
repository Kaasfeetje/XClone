import { COMMENTPERMISSIONS } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const postInclude = (userId: string) => ({
  user: true,
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
  mentions: true,
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
      }),
    )
    .mutation(async ({ input, ctx }) => {
      //Add mentions
      const regex = /@\w{1,50}/g;
      let usernamesMentioned = [];
      var match;
      while ((match = regex.exec(input.textContent!)) != null) {
        usernamesMentioned.push(match[0].replace("@", ""));
      }
      const mentions = await ctx.db.user.findMany({
        where: {
          username: {
            in: usernamesMentioned,
          },
        },
      });

      console.log(mentions, usernamesMentioned);

      //create post
      const post = await ctx.db.post.create({
        data: {
          textContent: input.textContent,
          userId: ctx.session.user.id,
          commentToId: input.commentToId,
          mentions: {
            connect: mentions.map((m) => ({ id: m.id })),
          },
        },
      });

      //Update commentcount
      if (input.commentToId) {
        await ctx.db.post.update({
          where: {
            id: input.commentToId,
          },
          data: {
            commentCount: {
              increment: 1,
            },
          },
        });
      }

      return post;
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
        const [_, deletedItem] = await ctx.db.$transaction(
          [
            ctx.db.post.update({
              where: {
                id: input.postId,
              },
              data: {
                likeCount: post.likeCount - 1,
              },
            }),
            ctx.db.postLike.delete({
              where: {
                postId_userId: {
                  postId: input.postId,
                  userId: ctx.session.user.id,
                },
              },
            }),
          ],
          { isolationLevel: "Serializable" },
        );
        return deletedItem;
      }
      const [_, createdItem] = await ctx.db.$transaction(
        [
          ctx.db.post.update({
            where: {
              id: input.postId,
            },
            data: {
              likeCount: post.likeCount + 1,
            },
          }),
          ctx.db.postLike.create({
            data: {
              postId: input.postId,
              userId: ctx.session.user.id,
            },
          }),
        ],
        { isolationLevel: "Serializable" },
      );

      return createdItem;
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
        const [_, deletedItem] = await ctx.db.$transaction(
          [
            ctx.db.post.update({
              where: {
                id: input.postId,
              },
              data: {
                repostCount: post.repostCount - 1,
              },
            }),
            ctx.db.postRepost.delete({
              where: {
                postId_userId: {
                  postId: input.postId,
                  userId: ctx.session.user.id,
                },
              },
            }),
          ],
          { isolationLevel: "Serializable" },
        );

        return deletedItem;
      }
      const [_, createdItem] = await ctx.db.$transaction(
        [
          ctx.db.post.update({
            where: {
              id: input.postId,
            },
            data: {
              repostCount: post.repostCount + 1,
            },
          }),
          ctx.db.postRepost.create({
            data: {
              postId: input.postId,
              userId: ctx.session.user.id,
            },
          }),
        ],
        { isolationLevel: "Serializable" },
      );

      return createdItem;
    }),
});
