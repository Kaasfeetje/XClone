import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { api } from "~/utils/api";
import Post from "../Post/Post";

type Props = {};

const FollowingContainer = (props: Props) => {
  const posts = api.post.fetchFollowing.useInfiniteQuery(
    {},
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

  return (
    <div>
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

export default FollowingContainer;
