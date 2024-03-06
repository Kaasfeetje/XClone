import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { postInclude } from "./post";
import { hasListPermission } from "./list";

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
  fetchSearchTop: protectedProcedure
    .input(z.object({ keyword: z.string() }))
    .query(async ({ input, ctx }) => {
      const posts = await ctx.db.post.findMany({
        where: {
          textContent: {
            contains: input.keyword,
          },
        },
        include: postInclude(ctx.session.user.id),
      });
      return posts;
    }),
  fetchSearchLatest: protectedProcedure
    .input(z.object({ keyword: z.string() }))
    .query(async ({ input, ctx }) => {
      const posts = await ctx.db.post.findMany({
        where: {
          textContent: {
            contains: input.keyword,
          },
        },
        include: postInclude(ctx.session.user.id),
        orderBy: {
          createdAt: "desc",
        },
      });
      return posts;
    }),
  fetchSearchPeople: protectedProcedure
    .input(z.object({ keyword: z.string() }))
    .query(async ({ input, ctx }) => {
      const users = await ctx.db.user.findMany({
        where: {
          OR: [
            {
              username: {
                contains: input.keyword,
              },
            },
            {
              displayName: {
                contains: input.keyword,
              },
            },
          ],
        },
      });
      return users;
    }),
  fetchSearchMedia: protectedProcedure
    .input(z.object({ keyword: z.string() }))
    .query(async ({ input, ctx }) => {
      const posts = await ctx.db.post.findMany({
        where: {
          textContent: {
            contains: input.keyword,
          },
          images: {
            some: {},
          },
        },
        include: postInclude(ctx.session.user.id),
      });
      return posts;
    }),
  fetchSearchList: protectedProcedure
    .input(z.object({ keyword: z.string() }))
    .query(async ({ input, ctx }) => {
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
});
