import { DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { Image } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";
import { s3 } from "~/server/aws/s3";
import { db } from "~/server/db";

export const deleteImages = async (images: Image[]) => {
  if (images.length == 0) return;
  if (images.length == 1) return deleteImage(images[0]!);

  const command = new DeleteObjectsCommand({
    Bucket: env.BUCKET_NAME,
    Delete: {
      Objects: images.map((image) => ({ Key: image.id })),
    },
  });

  try {
    await s3.send(command);
    await db.image.deleteMany({
      where: {
        id: { in: images.map((image) => image.id) },
      },
    });
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error deleting images from filestorage.",
    });
  }
};

export const deleteImage = async (image: Image) => {
  const command = new DeleteObjectCommand({
    Bucket: env.BUCKET_NAME,
    Key: image.id,
  });

  try {
    await s3.send(command);
    await db.image.delete({ where: { id: image.id } });
  } catch (err) {
    console.error(err);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error deleting image from filestorage",
    });
  }
};
