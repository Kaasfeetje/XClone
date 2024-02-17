import { Post, PostLike, PostRepost, User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import Avatar from "../common/Avatar";

import PostActions from "./PostActions";
import Link from "next/link";

type Props = {
  post: Post & {
    user: User;
    likes: PostLike[];
    reposts: PostRepost[];
    mentions: User[];
  };
};

const Post = ({ post }: Props) => {
  const [parts, setParts] = useState<string[]>([]);

  useEffect(() => {
    if (post && post.mentions.length != 0) {
      const newRegex = new RegExp(
        `${post.mentions.map((user) => `@${user.username}`).join("|")}`,
        "g",
      );

      setParts(post.textContent!.split(newRegex));
    }
  }, [post]);

  return (
    <Link href={`/${post.user.username}/status/${post.id}`}>
      <div className="flex px-4 py-3">
        <Link
          href={`/${post.user.username}`}
          className="mr-3 block h-10 w-10 min-w-10"
        >
          <Avatar
            profileImage={post.user.profileImage}
            image={post.user.image}
          />
        </Link>
        <div className="w-full">
          <div>
            <Link href={`/${post.user.username}`}>
              <span className="font-semibold text-grayText hover:underline">
                {post.user.displayName}
              </span>
              <span className="text-lightGrayText hover:underline">
                @{post.user.username}
              </span>
            </Link>
            <span>*</span>
            <span>16m</span>
          </div>
          <div>
            {parts.map((part, index) => (
              <>
                <span>{part}</span>
                {post.mentions[index] && (
                  <Link
                    className="text-blue-500 hover:underline"
                    href={`/${post.mentions[index]?.username}`}
                  >
                    @{post.mentions[index]?.username}
                  </Link>
                )}
              </>
            ))}
          </div>
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
    </Link>
  );
};

export default Post;
