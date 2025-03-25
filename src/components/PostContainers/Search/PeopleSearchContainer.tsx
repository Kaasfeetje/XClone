import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import UserResult from "~/components/headers/ExploreHeader/UserResult";
import { api } from "~/utils/api";

type Props = {
  keyword: string;
};

const PeopleSearchContainer = ({ keyword }: Props) => {
  const users = api.search.fetchSearchPeople.useInfiniteQuery(
    { keyword },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      if (users.hasNextPage && !users.isLoading) {
        users.fetchNextPage().then();
      }
    }
  }, [inView, users.hasNextPage, users.isLoading, users.fetchStatus]);
  if (!users.data) {
    return <div></div>;
  }
  return (
    <div>
      {users.data.pages.map((page) =>
        page.users.map((user) => <UserResult key={user.id} user={user} />),
      )}
      {users.hasNextPage && <div ref={ref}>Loading...</div>}
    </div>
  );
};

export default PeopleSearchContainer;
