import { db } from "~/server/db";
import { deleteImages } from "./deleteImage";

export const deletePost = async (postId: string) => {
  // Delete images
  const images = await db.image.findMany({
    where: {
      postId: postId,
    },
  });
  deleteImages(images).then();

  // Delete bookmarks
  // Delete likes
  // Delete reposts
  await Promise.all([
    db.bookmark.deleteMany({
      where: {
        postId: postId,
      },
    }),
    db.postLike.deleteMany({
      where: {
        postId: postId,
      },
    }),
    db.postRepost.deleteMany({
      where: {
        postId: postId,
      },
    }),
  ]);
  // Delete comments to post
  const comments = await db.post.findMany({
    where: {
      commentToId: postId,
    },
  });
  await Promise.all(comments.map((comment) => deletePost(comment.id)));
  await db.post.delete({
    where: {
      id: postId,
    },
  });
};
