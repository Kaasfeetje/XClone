import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  completeSignup: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(3).max(32),
        username: z.string().min(3).max(16),
        //Not required until we implement images
        profileImage: z.string().nullish(),
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
          profileImage: input.profileImage,
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
      });
      return profile;
    }),
});
