import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const listRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        bio: z.string().min(1).nullish(),
        isPrivate: z.boolean().nullish(),
        bannerImageId: z.string().min(1).nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const list = await ctx.db.list.create({
        data: {
          name: input.name,
          bio: input.bio,
          visibility: input.isPrivate ? "PRIVATE" : "PUBLIC",
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
          visibility: input.isPrivate ? "PRIVATE" : "PUBLIC",
          bannerImageId: input.bannerImageId,
        },
      });
      return list;
    }),
  delete: protectedProcedure
    .input(z.object({ listId: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const list = await ctx.db.list.delete({
        where: {
          id: input.listId,
        },
      });
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
        },
        include: {
          _count: true,
          user: true,
        },
      });
      return list;
    }),
  fetchAutoComplete: protectedProcedure
    .input(z.object({ keyword: z.string() }))
    .query(async ({ input, ctx }) => {
      const lists = await ctx.db.list.findMany({
        where: {
          name: {
            startsWith: input.keyword,
          },
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
});
