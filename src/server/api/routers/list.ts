import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { LISTVISIBILITY } from "@prisma/client";
import { deleteImage, deleteImages } from "../helpers/deleteImage";

export const hasListPermission = (userId: string) => {
  return {
    OR: [
      {
        userId: userId,
      },
      {
        visibility: LISTVISIBILITY.PUBLIC,
      },
      {
        followers: {
          some: {
            followerId: userId,
          },
        },
      },
    ],
  };
};

export const listRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        bio: z.string().nullish(),
        isPrivate: z.boolean().nullish(),
        bannerImageId: z.string().min(1).nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const list = await ctx.db.list.create({
        data: {
          name: input.name,
          bio: input.bio,
          visibility: input.isPrivate
            ? LISTVISIBILITY.PRIVATE
            : LISTVISIBILITY.PUBLIC,
          bannerImageId: input.bannerImageId,
          userId: ctx.session.user.id,
        },
      });
      return list;
    }),
  update: protectedProcedure
    .input(
      z.object({
        listId: z.string().min(1),
        name: z.string().min(1),
        bio: z.string().min(1).nullish(),
        isPrivate: z.boolean().nullish(),
        bannerImageId: z.string().min(1).nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const list = await ctx.db.list.update({
        where: {
          id: input.listId,
        },
        data: {
          name: input.name,
          bio: input.bio,
          visibility: input.isPrivate
            ? LISTVISIBILITY.PRIVATE
            : LISTVISIBILITY.PUBLIC,
          bannerImageId: input.bannerImageId,
        },
      });
      return list;
    }),
  delete: protectedProcedure
    .input(z.object({ listId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.listMember.deleteMany({
        where: {
          listId: input.listId,
        },
      });
      await ctx.db.listFollow.deleteMany({
        where: {
          listId: input.listId,
        },
      });

      const list = await ctx.db.list.delete({
        where: {
          id: input.listId,
        },
        include: {
          bannerImage: true,
        },
      });
      if (list.bannerImage) deleteImage(list.bannerImage);
      return list;
    }),
  fetchUserLists: protectedProcedure
    .input(
      z.object({
        username: z.string().min(1),
        postUsername: z.string().min(1).nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const lists = await ctx.db.list.findMany({
        where: {
          user: { username: input.username },
        },
        include: {
          _count: true,
          user: true,
          listMembers: {
            where: {
              member: {
                username: input.postUsername,
              },
            },
          },
        },
      });
      return lists;
    }),
  fetch: protectedProcedure
    .input(z.object({ listId: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      const list = await ctx.db.list.findUnique({
        where: {
          id: input.listId,
          ...hasListPermission(ctx.session.user.id),
        },
        include: {
          _count: true,
          user: true,
          followers: {
            where: {
              followerId: ctx.session.user.id,
            },
          },
        },
      });
      return list;
    }),
  fetchListMembers: protectedProcedure
    .input(z.object({ listId: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      const listMembers = await ctx.db.listMember.findMany({
        where: {
          listId: input.listId,
        },
        include: {
          member: true,
        },
      });
      return listMembers;
    }),
  deleteListMember: protectedProcedure
    .input(z.object({ memberId: z.string().min(1), listId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const list = await ctx.db.list.findUnique({
        where: {
          id: input.listId,
          userId: ctx.session.user.id,
        },
      });
      if (!list)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action.",
        });

      const deleted = await ctx.db.listMember.delete({
        where: {
          memberId_listId: {
            listId: input.listId,
            memberId: input.memberId,
          },
        },
      });
      return deleted;
    }),
  fetchListFollowers: protectedProcedure
    .input(z.object({ listId: z.string() }))
    .query(async ({ input, ctx }) => {
      const followers = await ctx.db.listFollow.findMany({
        where: {
          listId: input.listId,
        },
        include: {
          follower: true,
        },
      });
      return followers;
    }),
  fetchAutoComplete: protectedProcedure
    .input(z.object({ keyword: z.string() }))
    .query(async ({ input, ctx }) => {
      // TODO: paginate all the list stuff
      const lists = await ctx.db.list.findMany({
        where: {
          name: {
            contains: input.keyword,
          },
          ...hasListPermission(ctx.session.user.id),
        },
        include: {
          user: true,
          _count: true,
        },
      });
      return lists;
    }),
  addRemoveMembers: protectedProcedure
    .input(
      z.object({
        create: z
          .object({
            listId: z.string().min(1),
            userId: z.string().min(1),
          })
          .array(),
        delete: z
          .object({
            listId: z.string().min(1),
            userId: z.string().min(1),
          })
          .array(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const deleted = await ctx.db.listMember.deleteMany({
        where: {
          AND: input.delete.map((del) => ({
            listId: del.listId,
            memberId: del.userId,
          })),
        },
      });
      const created = await ctx.db.listMember.createMany({
        data: input.create.map((create) => ({
          listId: create.listId,
          memberId: create.userId,
        })),
      });
      return { deleted, created };
    }),
  followList: protectedProcedure
    .input(z.object({ listId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const followExists = await ctx.db.listFollow.findUnique({
        where: {
          followerId_listId: {
            followerId: ctx.session.user.id,
            listId: input.listId,
          },
        },
      });
      if (followExists) {
        return await ctx.db.listFollow.delete({
          where: {
            followerId_listId: {
              followerId: ctx.session.user.id,
              listId: input.listId,
            },
          },
        });
      }
      return await ctx.db.listFollow.create({
        data: {
          followerId: ctx.session.user.id,
          listId: input.listId,
        },
      });
    }),
  pinList: protectedProcedure
    .input(z.object({ listId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const list = await ctx.db.list.findUnique({
        where: {
          id: input.listId,
        },
      });

      await ctx.db.list.update({
        where: {
          id: input.listId,
        },
        data: {
          isPinned: !list?.isPinned,
        },
      });
    }),
});
