import React, { useEffect } from "react";
import { api } from "~/utils/api";
import Post from "../Post/Post";
import { useInView } from "react-intersection-observer";

type Props = {
  username: string;
};

const ProfileHighlightsContainer = ({ username }: Props) => {
  const posts = api.post.fetchProfileHighlights.useInfiniteQuery(
    { username },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      if (posts.hasNextPage && !posts.isLoading) {
        void posts.fetchNextPage();
      }
    }
  }, [inView, posts.hasNextPage, posts.isLoading, posts.fetchStatus]);

  if (!posts.data) {
    return <div></div>;
  }
  return (
    <div>
      {posts.data?.pages.map((page, idx) => (
        <div key={page.highlightedPosts[0]?.id ?? "test"}>
          {page.highlightedPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ))}
      {posts.hasNextPage && <div ref={ref}>Loading...</div>}
    </div>
  );
};

export default ProfileHighlightsContainer;
