import { HashTag, Post, PostLike, PostRepost, User } from "@prisma/client";
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
    hashtags: HashTag[];
  };
};

const Post = ({ post }: Props) => {
  const [parts, setParts] = useState<string[]>([]);
  const [between, setBetween] = useState<{ text: string; href: string }[]>([]);

  useEffect(() => {
    if (post && (post.mentions.length != 0 || post.hashtags.length != 0)) {
      const mentions = post.mentions
        .map((user) => `@${user.username}`)
        .join("|");

      const hashtags = post.hashtags
        .map((hashtag) => `#${hashtag.hashtag}`)
        .join("|");

      // Creates combined regex for mentions and hashtags
      const combined =
        hashtags != "" && mentions != ""
          ? `${mentions}|${hashtags}`
          : hashtags == ""
            ? mentions
            : hashtags;

      const newRegex = new RegExp(`${combined}`, "g");

      let results = [];
      var match;
      while ((match = newRegex.exec(post.textContent!)) != null) {
        const word = match[0].replace(/@|#/g, "");
        results.push({
          text: match[0],
          href: match[0].startsWith("#") ? `/hashtag/${word}` : `/${word}`,
        });
      }
      setBetween(results);
      setParts(post.textContent!.split(newRegex));
    } else if (post) {
      setParts([post.textContent!]);
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
                {between[index] && (
                  <Link
                    className="text-blue-500 hover:underline"
                    href={between[index]!.href}
                  >
                    {between[index]!.text}
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
