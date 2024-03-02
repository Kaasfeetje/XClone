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
  fetchUserLists: protectedProcedure
    .input(z.object({ username: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      const lists = await ctx.db.list.findMany({
        where: {
          user: { username: input.username },
        },
        include: {
          _count: true,
          user: true,
        },
      });
      return lists;
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
});
