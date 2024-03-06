import React from "react";
import Post from "~/components/Post/Post";
import UserResult from "~/components/headers/ExploreHeader/UserResult";
import { api } from "~/utils/api";

type Props = {
  keyword: string;
};

const PeopleSearchContainer = ({ keyword }: Props) => {
  const users = api.search.fetchSearchPeople.useQuery({ keyword });
  if (!users.data) {
    return <div></div>;
  }
  return (
    <div>
      {users.data.map((user) => (
        <UserResult user={user} />
      ))}
    </div>
  );
};

export default PeopleSearchContainer;
