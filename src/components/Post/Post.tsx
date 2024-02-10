import { Post, PostLike, PostRepost, User } from "@prisma/client";
import React from "react";
import Avatar from "../common/Avatar";

import PostActions from "./PostActions";
import Link from "next/link";

type Props = {
  post: Post & {
    user: User;
    likes: PostLike[];
    reposts: PostRepost[];
  };
};

const Post = ({ post }: Props) => {
  return (
    <div className="flex px-4 py-3">
      <Link
        href={`/${post.user.username}`}
        className="mr-3 block h-10 w-10 min-w-10"
      >
        <Avatar profileImage={post.user.profileImage} image={post.user.image} />
      </Link>
      <div className="w-full">
        <div>
          <Link href={`/${post.user.username}`}>
            <span className="text-grayText font-semibold hover:underline">
              {post.user.displayName}
            </span>
            <span className="text-lightGrayText hover:underline">
              @{post.user.username}
            </span>
          </Link>
          <span>*</span>
          <span>16m</span>
        </div>
        <div>{post.textContent}</div>
        <PostActions
          postId={post.id}
          liked={post.likes.length > 0}
          likeCount={post.likeCount}
          reposted={post.reposts.length > 0}
          repostCount={post.repostCount}
          commentCount={post.commentCount}
        />
      </div>
    </div>
  );
};

export default Post;
