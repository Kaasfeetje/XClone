import {
  Bookmark,
  HashTag,
  Post,
  PostLike,
  PostRepost,
  User,
} from "@prisma/client";
import React, { useEffect, useState } from "react";
import Avatar from "../common/Avatar";

import PostActions from "./PostActions";
import Link from "next/link";
import { monthsAbbreviations } from "../common/data/months";

type Props = {
  post: Post & {
    user: User;
    likes: PostLike[];
    reposts: PostRepost[];
    bookmarks: Bookmark[];
    mentions: User[];
    hashtags: HashTag[];
    _count: {
      comments: number;
      hashtags: number;
      likes: number;
      mentions: number;
      reposts: number;
    };
  };
};

const DetailedPost = ({ post }: Props) => {
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
            <span className="mx-1 text-lightGrayText hover:underline">
              @{post.user.username}
            </span>
          </Link>
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
          likeCount={post._count.likes}
          reposted={post.reposts.length > 0}
          repostCount={post._count.reposts}
          bookmarked={post.bookmarks.length > 0}
          commentCount={post._count.comments}
          detailed={true}
        />
      </div>
    </div>
  );
};

export default DetailedPost;
