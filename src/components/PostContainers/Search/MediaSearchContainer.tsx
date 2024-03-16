import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Post from "~/components/Post/Post";
import { api } from "~/utils/api";

type Props = {
  keyword: string;
};

const MediaSearchContainer = ({ keyword }: Props) => {
  const posts = api.search.fetchSearchMedia.useInfiniteQuery(
    { keyword },
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

export default MediaSearchContainer;
