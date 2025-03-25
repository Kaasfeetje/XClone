import React, { useEffect } from "react";
import Modal from "../common/Modal";
import CloseIcon from "../icons/CloseIcon";
import { api } from "~/utils/api";
import ListUser from "./ListUser";
import { useInView } from "react-intersection-observer";

type Props = {
  listId: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const ListFollowersModal = ({ listId, isOpen, setIsOpen }: Props) => {
  const listFollowersQuery = api.list.fetchListFollowers.useInfiniteQuery(
    { listId },
    {
      enabled: listId !== undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      if (listFollowersQuery.hasNextPage && !listFollowersQuery.isLoading) {
        void listFollowersQuery.fetchNextPage();
      }
    }
  }, [
    inView,
    listFollowersQuery.hasNextPage,
    listFollowersQuery.isLoading,
    listFollowersQuery.fetchStatus,
  ]);

  return (
    <Modal centered isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="z-10 h-full w-full overflow-y-auto border-2  border-white bg-white md:h-fit md:max-h-[calc(80%-53px)] md:min-h-[650px] md:w-[600px] md:rounded-2xl">
        <div className="sticky top-0 flex h-[53px] w-full items-center px-4">
          <div className="w-14">
            <div
              onClick={() => setIsOpen(false)}
              className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full hover:bg-gray-200"
            >
              <CloseIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="text-xl font-semibold">List followers</div>
        </div>
        <div>
          {listFollowersQuery.data &&
          listFollowersQuery.data.pages.length == 0 ? (
            <div className="mt-3 select-none text-center font-semibold text-lightGrayText">
              This list does not have any followers
            </div>
          ) : (
            <>
              {listFollowersQuery.data?.pages.map((page) =>
                page.followers.map((follower) => (
                  <ListUser
                    key={follower.followerId}
                    user={follower.follower}
                  />
                )),
              )}
              {listFollowersQuery.hasNextPage && (
                <div ref={ref}>Loading...</div>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ListFollowersModal;
