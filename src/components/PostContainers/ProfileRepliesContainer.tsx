import React, { useEffect } from "react";
import { api } from "~/utils/api";
import Post from "../Post/Post";
import { useInView } from "react-intersection-observer";

type Props = {
  username: string;
};

const ProfileRepliesContainer = ({ username }: Props) => {
  const replies = api.post.fetchProfileReplies.useInfiniteQuery(
    { username },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      if (replies.hasNextPage && !replies.isLoading) {
        void replies.fetchNextPage();
      }
    }
  }, [inView, replies.hasNextPage, replies.isLoading, replies.fetchStatus]);

  if (!replies.data) {
    return <div></div>;
  }
  return (
    <div>
      {replies.data?.pages.map((page, idx) => (
        <div key={page.replies[0]?.id}>
          {page.replies.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ))}
      {replies.hasNextPage && <div ref={ref}>Loading...</div>}
    </div>
  );
};

export default ProfileRepliesContainer;
