import React, { useEffect } from "react";
import { api } from "~/utils/api";
import Post, { PostIncludeType } from "../Post/Post";
import { Post as PostType } from "@prisma/client";
import PinIconFilled from "../icons/PinIconFilled";
import { useInView } from "react-intersection-observer";

type Props = {
  pinnedPost?: PostType & PostIncludeType;
  username: string;
};

const ProfilePostsContainer = ({ pinnedPost, username }: Props) => {
  const posts = api.post.fetchProfilePosts.useInfiniteQuery(
    { username },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      if (posts.hasNextPage && !posts.isLoading) {
        posts.fetchNextPage();
      }
    }
  }, [inView, posts.hasNextPage, posts.isLoading, posts.fetchStatus]);

  if (!posts.data) {
    return <div></div>;
  }
  return (
    <div>
      {pinnedPost && (
        <div>
          <div className="-mb-3 flex items-center fill-lightGrayText px-4 text-13px font-semibold text-lightGrayText">
            <div className="mr-2 flex w-10 justify-end">
              <PinIconFilled className="h-4 w-4" />
            </div>
            <div>Pinned</div>
          </div>
          <Post post={pinnedPost} />
        </div>
      )}
      {posts.data?.pages.map((page, idx) => (
        <div key={page.posts[0]?.id}>
          {page.posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ))}
      {posts.hasNextPage && <div ref={ref}>Loading...</div>}
    </div>
  );
};

export default ProfilePostsContainer;
