import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const searchRouter = createTRPCRouter({
  search: protectedProcedure
    .input(
      z.object({
        keyword: z.string().min(1).nullish(),
        hashtag: z.string().min(1).nullish(),
        searchedUserId: z.string().min(1).nullish(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!(input.searchedUserId || input.hashtag || input.keyword)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Must define at least one field",
        });
      }

      const search = await ctx.db.search.create({
        data: {
          userId: ctx.session.user.id,
          hashtagId: input.hashtag,
          searchedUserId: input.searchedUserId,
          text: input.keyword,
        },
      });
      return search;
    }),
  fetchSearchHistory: protectedProcedure.query(async ({ ctx }) => {
    const searchHistory = await ctx.db.search.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        hashtag: true,
        searchedUser: true,
      },
    });
    return searchHistory;
  }),
  clearSearchHistory: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.search.deleteMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  fetchAutoComplete: protectedProcedure
    .input(z.object({ keyword: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      if (input.keyword.startsWith("#")) {
        const hashtags = await ctx.db.hashTag.findMany({
          where: {
            hashtag: {
              startsWith: input.keyword.replace("#", ""),
            },
          },
        });
        return { hashtags };
      }

      if (input.keyword.startsWith("@")) {
        const users = await ctx.db.user.findMany({
          where: {
            OR: [
              {
                username: {
                  startsWith: input.keyword.replace("@", ""),
                },
              },
              {
                displayName: {
                  startsWith: input.keyword.replace("@", ""),
                },
              },
            ],
          },
        });
        return { users };
      }

      const hashtags = await ctx.db.hashTag.findMany({
        where: {
          hashtag: {
            startsWith: input.keyword,
          },
        },
      });

      const users = await ctx.db.user.findMany({
        where: {
          OR: [
            {
              username: {
                startsWith: input.keyword,
              },
            },
            {
              displayName: {
                startsWith: input.keyword,
              },
            },
          ],
        },
      });

      return { hashtags, users };
    }),
});
