import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { postInclude } from "./post";
import { deleteImages } from "../helpers/deleteImage";
import { Image } from "@prisma/client";

export const userRouter = createTRPCRouter({
  completeSignup: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(3).max(32),
        username: z.string().min(3).max(16),
        //Not required until we implement images
        profileImageId: z.string().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const updatedUser = await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          displayName: input.displayName,
          username: input.username.toLowerCase(),
          profileImageId: input.profileImageId,
        },
      });
      return updatedUser;
    }),
  fetchProfile: protectedProcedure
    .input(z.object({ username: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      //TODO: Update this to include other profile data
      const profile = await ctx.db.user.findUnique({
        where: {
          username: input.username,
        },
        include: {
          followers: {
            where: {
              followed: {
                username: input.username,
              },
              followerId: ctx.session.user.id,
            },
          },
          pinnedPost: {
            include: postInclude(ctx.session.user.id),
          },
          _count: {
            select: {
              followers: true,
              following: true,
              posts: true,
            },
          },
        },
      });
      return profile;
    }),
  editProfile: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(1).nullish(),
        profileImageId: z.string().min(1).nullish(),
        bannerImageId: z.string().min(1).nullish(),
        bio: z.string().min(1).nullish(),
        location: z.string().min(1).nullish(),
        website: z.string().url().nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: delete old profile/banner image
      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          bannerImage: true,
          profileImage: true,
        },
      });
      if (!user)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something has seriously gone wrong.",
        });
      const imagesToDelete: Image[] = [];
      if (input.profileImageId && user.profileImage) {
        imagesToDelete.push(user.profileImage);
      }
      if (input.bannerImageId && user.bannerImage) {
        imagesToDelete.push(user.bannerImage);
      }
      deleteImages(imagesToDelete).then();

      const updatedUser = await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          displayName: input.displayName,
          profileImageId: input.profileImageId,
          bannerImageId: input.bannerImageId,
          bio: input.bio,
          location: input.location,
          website: input.website,
        },
      });

      return updatedUser;
    }),
  fetchAutoCompleteUsers: protectedProcedure
    .input(z.object({ keyword: z.string() }))
    .query(async ({ input, ctx }) => {
      const users = await ctx.db.user.findMany({
        where: {
          username: {
            startsWith: input.keyword,
          },
        },
      });
      return users;
    }),
  follow: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const followExists = await ctx.db.follow.findUnique({
        where: {
          followerId_followedId: {
            followedId: input.id,
            followerId: ctx.session.user.id,
          },
        },
      });

      if (followExists) {
        await ctx.db.follow.delete({
          where: {
            followerId_followedId: {
              followedId: input.id,
              followerId: ctx.session.user.id,
            },
          },
        });
        return false;
      }

      await ctx.db.follow.create({
        data: {
          followedId: input.id,
          followerId: ctx.session.user.id,
        },
      });
      return true;
    }),
  pinPost: protectedProcedure
    .input(z.object({ postId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
      });

      // You can only pin your own tweets
      if (post?.userId != ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action.",
        });
      }

      await ctx.db.post.update({
        where: {
          id: post.id,
        },
        data: {
          pinnedUserId: ctx.session.user.id,
        },
      });
    }),
  unPinPost: protectedProcedure
    .input(z.object({ postId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id: input.postId,
        },
      });

      // You can only unpin your own tweets
      if (post?.userId != ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action.",
        });
      }
      // You can only unpin posts that are pinned
      if (post.pinnedUserId != ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action.",
        });
      }

      await ctx.db.post.update({
        where: {
          id: input.postId,
        },
        data: {
          pinnedUser: {
            disconnect: true,
          },
        },
      });
    }),
});
