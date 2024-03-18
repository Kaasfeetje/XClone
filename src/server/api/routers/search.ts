import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { POST_PER_REQUEST, postInclude } from "./post";
import { hasListPermission } from "./list";
import { getNextCreatedAtCursor } from "../helpers/getNextCursor";

const AUTOCOMPLETE_RESULT_COUNT = 4;

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
  fetchSearchHistory: protectedProcedure
    .input(
      z.object({
        cursor: z.object({ id: z.string(), createdAt: z.date() }).nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const searchHistory = await ctx.db.search.findMany({
        take: POST_PER_REQUEST + 1,
        cursor: input.cursor ? input.cursor : undefined,
        orderBy: { createdAt: "desc" },
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          hashtag: true,
          searchedUser: true,
        },
      });
      const nextCursor = getNextCreatedAtCursor(
        searchHistory,
        POST_PER_REQUEST,
      );
      return { searchHistory, nextCursor };
    }),
  clearSearchHistory: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.search.deleteMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  fetchAutoComplete: protectedProcedure
    .input(
      z.object({
        keyword: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      if (input.keyword.startsWith("#")) {
        const hashtags = await ctx.db.hashTag.findMany({
          take: AUTOCOMPLETE_RESULT_COUNT,
          orderBy: {
            posts: {
              _count: "desc",
            },
          },
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
          take: AUTOCOMPLETE_RESULT_COUNT,
          orderBy: {
            followers: {
              _count: "desc",
            },
          },
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
        take: AUTOCOMPLETE_RESULT_COUNT / 2,
        orderBy: {
          posts: {
            _count: "desc",
          },
        },
        where: {
          hashtag: {
            startsWith: input.keyword,
          },
        },
      });

      const users = await ctx.db.user.findMany({
        take: AUTOCOMPLETE_RESULT_COUNT / 2,
        orderBy: {
          followers: {
            _count: "desc",
          },
        },
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
    .input(
      z.object({
        keyword: z.string(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const posts = await ctx.db.post.findMany({
        take: POST_PER_REQUEST + 1,
        cursor: input.cursor ? input.cursor : undefined,
        orderBy: [
          {
            likes: {
              _count: "desc",
            },
          },
          { createdAt: "desc" },
        ],
        where: {
          textContent: {
            contains: input.keyword,
          },
        },
        include: postInclude(ctx.session.user.id),
      });
      const nextCursor = getNextCreatedAtCursor(posts, POST_PER_REQUEST);
      return { posts, nextCursor };
    }),
  fetchSearchLatest: protectedProcedure
    .input(
      z.object({
        keyword: z.string(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const posts = await ctx.db.post.findMany({
        take: POST_PER_REQUEST + 1,
        cursor: input.cursor ? input.cursor : undefined,
        orderBy: { createdAt: "desc" },
        where: {
          textContent: {
            contains: input.keyword,
          },
        },
        include: postInclude(ctx.session.user.id),
      });
      const nextCursor = getNextCreatedAtCursor(posts, POST_PER_REQUEST);
      return { posts, nextCursor };
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
    .input(
      z.object({
        keyword: z.string(),
        cursor: z.object({ id: z.string(), createdAt: z.date() }).nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const posts = await ctx.db.post.findMany({
        take: POST_PER_REQUEST + 1,
        cursor: input.cursor ? input.cursor : undefined,
        orderBy: { createdAt: "desc" },
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
      const nextCursor = getNextCreatedAtCursor(posts, POST_PER_REQUEST);
      return { posts, nextCursor };
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
