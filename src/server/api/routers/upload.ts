import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env";
import { v4 } from "uuid";

export const uploadRouter = createTRPCRouter({
  getUploadPresignedUrl: protectedProcedure
    .input(z.object({ type: z.string() }).array())
    .mutation(async ({ input, ctx }) => {
      const urls = await Promise.all(
        input.map(async (img) => {
          const id = `${v4()}.${img.type}`;
          const image = await ctx.db.image.create({
            data: {
              id: id,
              type: img.type,
              userId: ctx.session.user.id,
            },
          });

          const putObjectCommand = new PutObjectCommand({
            Bucket: env.BUCKET_NAME,
            Key: id,
          });

          const presignedUrl = await getSignedUrl(ctx.s3, putObjectCommand);
          return { presignedUrl, image };
        }),
      );
      return urls;
    }),
  deleteUnusedPresignedUrls: protectedProcedure
    .input(z.object({ id: z.string().min(1) }).array())
    .mutation(async ({ input, ctx }) => {
      await ctx.db.image.deleteMany({
        where: {
          id: { in: input.map((value) => value.id) },
        },
      });
    }),
});
