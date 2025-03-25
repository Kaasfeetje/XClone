import React, { useEffect } from "react";
import { api } from "~/utils/api";
import Post from "../Post/Post";
import { useInView } from "react-intersection-observer";

type Props = {
  listId: string;
};

const ListPostsContainer = ({ listId }: Props) => {
  const posts = api.post.fetchListPosts.useInfiniteQuery(
    { listId },
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

export default ListPostsContainer;
