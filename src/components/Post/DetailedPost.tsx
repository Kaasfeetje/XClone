import { Post, PostLike, PostRepost, User } from "@prisma/client";
import React from "react";
import Avatar from "../common/Avatar";

import PostActions from "./PostActions";
import Link from "next/link";
import { monthsAbbreviations } from "../common/data/months";

type Props = {
  post: Post & {
    user: User;
    likes: PostLike[];
    reposts: PostRepost[];
  };
};

const DetailedPost = ({ post }: Props) => {
  return (
    <div className="flex px-4 py-3">
      <div className="w-full">
        <div className="mb-3 flex">
          <Link
            href={`/${post.user.username}`}
            className="mr-3 h-10 w-10 min-w-10"
          >
            <Avatar
              profileImage={post.user.profileImage}
              image={post.user.image}
            />
          </Link>
          <Link href={`/${post.user.username}`} className="flex flex-col">
            <span className="font-semibold text-grayText hover:underline">
              {post.user.displayName}
            </span>
            <span className="text-lightGrayText hover:underline">
              @{post.user.username}
            </span>
          </Link>
        </div>
        <div className="text-17px">{post.textContent}</div>
        <div className="my-4 flex text-lightGrayText">
          <time dateTime={post.createdAt.toUTCString()}>
            {post.createdAt.getUTCHours()}:{post.createdAt.getUTCMinutes()} ·{" "}
            {post.createdAt.getUTCDate()}{" "}
            {monthsAbbreviations[post.createdAt.getUTCMonth()]}{" "}
            {post.createdAt.getUTCFullYear()}
          </time>
          <span className="mx-1"> · </span>
          <div className="text-sm">
            <span className="font-semibold text-grayText">{0}</span> Views
          </div>
        </div>
        <PostActions
          postId={post.id}
          liked={post.likes.length > 0}
          likeCount={post.likeCount}
          reposted={post.reposts.length > 0}
          repostCount={post.repostCount}
          commentCount={post.commentCount}
          detailed={true}
        />
      </div>
    </div>
  );
};

export default DetailedPost;
