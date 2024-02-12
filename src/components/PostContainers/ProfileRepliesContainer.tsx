import React from "react";
import { api } from "~/utils/api";
import Post from "../Post/Post";

type Props = {
  username: string;
};

const ProfileRepliesContainer = ({ username }: Props) => {
  const replies = api.post.fetchProfileReplies.useQuery({ username });
  if (!replies.data) {
    return <div></div>;
  }
  return (
    <div>
      {replies.data.map((post) => (
        <Post post={post} />
      ))}
    </div>
  );
};

export default ProfileRepliesContainer;
