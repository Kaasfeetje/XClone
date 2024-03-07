import {
  Bookmark,
  HashTag,
  Image,
  Post,
  PostHighlight,
  PostLike,
  PostRepost,
  User,
} from "@prisma/client";
import React, { useEffect, useState } from "react";
import Avatar from "../common/Avatar";

import PostActions from "./PostActions";
import Link from "next/link";
import PostImageContainer from "./PostImageContainer";
import PostOptions from "./PostOptions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export type PostIncludeType = {
  user: User & {
    followers: User[];
  };
  images: Image[];
  likes: PostLike[];
  reposts: PostRepost[];
  mentions: User[];
  hashtags: HashTag[];
  bookmarks: Bookmark[];
  highlight: PostHighlight | null;
  _count: {
    comments: number;
    hashtags: number;
    likes: number;
    mentions: number;
    reposts: number;
  };
};
type Props = {
  post: Post & PostIncludeType;
  replying?: boolean;
};

const Post = ({ post, replying }: Props) => {
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
        <div className="flex flex-col items-center">
          <Link
            href={`/${post.user.username}`}
            className="mr-3 block h-10 w-10 min-w-10"
          >
            <Avatar
              profileImage={post.user.profileImageId}
              image={post.user.image}
            />
          </Link>
          {replying && (
            <div className="mr-3 mt-1 h-full w-[2px] bg-[#CFD9DE]"></div>
          )}
        </div>
        <div className="w-full">
          <div className="flex items-start">
            <Link href={`/${post.user.username}`}>
              <span className="font-semibold text-grayText hover:underline">
                {post.user.displayName}
              </span>
              <span className="mx-1 text-lightGrayText hover:underline">
                @{post.user.username}
              </span>
            </Link>
            <span>·</span>
            <span className="mx-1">{`${dayjs(post.createdAt).fromNow()}`}</span>
            <PostOptions post={post} />
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
            <PostImageContainer images={post.images} />
          </div>
          {replying ? (
            <div className="mt-4 text-lightGrayText">
              Replying to{" "}
              <Link
                className="text-blue-500 hover:underline"
                href={`/${post.user.username}`}
              >
                @{post.user.username}
              </Link>
            </div>
          ) : (
            <PostActions
              postId={post.id}
              liked={post.likes.length > 0}
              likeCount={post._count.likes}
              reposted={post.reposts.length > 0}
              repostCount={post._count.reposts}
              bookmarked={post.bookmarks.length > 0}
              commentCount={post._count.comments}
            />
          )}
        </div>
      </div>
    </Link>
  );
};

export default Post;
