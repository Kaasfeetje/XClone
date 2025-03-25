import React, { useEffect } from "react";
import { api } from "~/utils/api";
import Post from "../Post/Post";
import { useInView } from "react-intersection-observer";

type Props = {
  username: string;
};

const ProfileLikesContainer = ({ username }: Props) => {
  const posts = api.post.fetchProfileLikes.useInfiniteQuery(
    { username },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      if (posts.hasNextPage && !posts.isLoading) {
        posts.fetchNextPage().then();
      }
    }
  }, [inView, posts.hasNextPage, posts.isLoading, posts.fetchStatus]);

  if (!posts.data) {
    return <div></div>;
  }
  return (
    <div>
      {posts.data?.pages.map((page, idx) => (
        <div key={page.likedPosts[0]?.id}>
          {page.likedPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ))}
      {posts.hasNextPage && <div ref={ref}>Loading...</div>}
    </div>
  );
};

export default ProfileLikesContainer;
