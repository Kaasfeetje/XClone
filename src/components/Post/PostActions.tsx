import React, { useEffect, useState } from "react";
import PostAction, { PostActionColorVariants } from "./PostAction";
import CommentIcon from "../icons/CommentIcon";
import RepostIcon from "../icons/RepostIcon";
import LikeIcon from "../icons/LikeIcon";
import StatsIcon from "../icons/StatsIcon";
import { api } from "~/utils/api";
import LikeIconFilled from "../icons/LikeIconFilled";
import { useRouter } from "next/router";
import { Post, User } from "@prisma/client";
import SharePostOption from "./SharePostOption";

type Props = {
  imageView?: boolean;
  post: Post & {
    user: User;
  };
  liked: boolean;
  likeCount: number;
  reposted: boolean;
  repostCount: number;
  bookmarked: boolean;
  commentCount: number;
  detailed?: boolean;
};

const PostActions = ({
  imageView,
  post,
  liked,
  likeCount,
  reposted,
  repostCount,
  bookmarked,
  commentCount,
  detailed,
}: Props) => {
  const router = useRouter();
  const utils = api.useUtils();
  const repostMutation = api.post.repost.useMutation({
    onMutate() {
      if (isReposted) {
        setIsReposted(false);
        setRepostCount(_repostCount - 1);
      } else {
        setIsReposted(true);
        setRepostCount(_repostCount + 1);
      }
    },
    onSuccess() {
      invalidate();
    },
  });
  const likeMutation = api.post.like.useMutation({
    onMutate() {
      if (isLiked) {
        setIsLiked(false);
        setLikeCount(_likeCount - 1);
      } else {
        setIsLiked(true);
        setLikeCount(_likeCount + 1);
      }
    },
    onSuccess() {
      invalidate();
    },
  });
  const bookmarkMutation = api.bookmark.createBookmark.useMutation({
    onMutate() {
      setIsBookmarked(true);
    },
    onSuccess() {
      invalidate();
    },
  });
  const deleteBookmarkMutation = api.bookmark.deleteBookmark.useMutation({
    onMutate() {
      setIsBookmarked(false);
    },
    onSuccess() {
      invalidate();
    },
  });
  const [isLiked, setIsLiked] = useState(liked);
  const [_likeCount, setLikeCount] = useState(likeCount);
  const [isReposted, setIsReposted] = useState(reposted);
  const [_repostCount, setRepostCount] = useState(repostCount);
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);

  const [isOpen, setIsOpen] = useState(false);

  const onRepost = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (repostMutation.isLoading) return;
    repostMutation.mutate({ postId: post.id });
  };

  const onLike = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (likeMutation.isLoading) return;
    likeMutation.mutate({ postId: post.id });
  };

  const onBookmark = (bookmark: {
    listId: string | undefined;
    postId: string;
  }) => {
    bookmarkMutation.mutate(bookmark);
  };

  const onDeleteBookmark = (postId: string) => {
    deleteBookmarkMutation.mutate({ postId });
  };

  const refetchPage:
    | ((
        lastPage: unknown,
        index: number,
        allPages: unknown[],
        key?: string,
      ) => boolean)
    | undefined = (
    lastPage: unknown, // Keep the type as unknown
    index: number,
    allPages: unknown[],
    key: unknown = "posts",
  ) => {
    const typedLastPage = lastPage as {
      posts?: Post[];
      comments?: Post[];
      nextCursor: {
        id: string;
        createdAt: Date;
      };
    };

    const typedKey = key as "posts" | "comments";

    const test = typedLastPage[typedKey]!.filter(
      (_post) => _post.id == post.id,
    );
    return test.length != 0;
  };

  const invalidate = () => {
    utils.post.fetchAll.invalidate({}, { refetchPage }).then();
    utils.post.fetchListPosts.invalidate({}, { refetchPage }).then();
    utils.post.fetchProfileHighlights.invalidate({}, { refetchPage }).then();
    utils.post.fetchProfileLikes.invalidate({}, { refetchPage }).then();
    utils.post.fetchProfilePosts.invalidate({}, { refetchPage }).then();
    utils.post.fetchProfileReplies.invalidate({}, { refetchPage }).then();
    utils.post.fetch.invalidate({ postId: post.id });
    // Add more in the future
    // Maybe find a better way of adding the key value
    utils.post.fetchComments
      .invalidate(
        {},
        {
          refetchPage: (lastPage, index, allPages) =>
            refetchPage(lastPage, index, allPages, "comments"),
        },
      )
      .then();
  };

  useEffect(() => {
    setIsReposted(reposted);
    setRepostCount(repostCount);
  }, [reposted]);

  useEffect(() => {
    setIsLiked(liked);
    setLikeCount(likeCount);
  }, [liked]);

  useEffect(() => {
    setIsBookmarked(bookmarked);
  }, [bookmarked]);

  return (
    <div className="mt-3 flex w-full justify-between">
      <PostAction
        icon={<CommentIcon className="h-5 w-5" />}
        value={commentCount}
        color={PostActionColorVariants.blue}
        imageView={imageView}
        onClick={(e) => {
          e.preventDefault();
          router.push(`/${post.user.username}/status/${post.id}`);
        }}
      />
      <PostAction
        icon={<RepostIcon className="h-5 w-5" />}
        value={_repostCount}
        color={PostActionColorVariants.green}
        imageView={imageView}
        onClick={onRepost}
        active={isReposted}
      />
      <PostAction
        icon={<LikeIcon className="h-5 w-5" />}
        activeIcon={<LikeIconFilled className="h-5 w-5" />}
        value={_likeCount}
        color={PostActionColorVariants.red}
        imageView={imageView}
        onClick={onLike}
        active={isLiked}
      />
      {!detailed && (
        <PostAction
          icon={<StatsIcon className="h-5 w-5" />}
          value={0}
          color={PostActionColorVariants.blue}
          imageView={imageView}
          onClick={(e) => {
            e.preventDefault();
            alert("Not implemented.");
          }}
        />
      )}
      <SharePostOption
        imageView={imageView}
        post={post}
        isBookmarked={isBookmarked}
        onBookmark={onBookmark}
        onDeleteBookmark={onDeleteBookmark}
      />
    </div>
  );
};

export default PostActions;
