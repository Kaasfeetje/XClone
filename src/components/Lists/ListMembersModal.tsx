import React, { useEffect } from "react";
import Modal from "../common/Modal";
import CloseIcon from "../icons/CloseIcon";
import { api } from "~/utils/api";
import ListMember from "./ListMember";
import { useInView } from "react-intersection-observer";

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  listId: string;
};

const ListMembersModal = ({ isOpen, setIsOpen, listId }: Props) => {
  const fetchListMembers = api.list.fetchListMembers.useInfiniteQuery(
    { listId },
    { enabled: isOpen, getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      if (fetchListMembers.hasNextPage && !fetchListMembers.isLoading) {
        void fetchListMembers.fetchNextPage();
      }
    }
  }, [
    inView,
    fetchListMembers.hasNextPage,
    fetchListMembers.isLoading,
    fetchListMembers.fetchStatus,
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
          <div className="text-xl font-semibold">List members</div>
        </div>
        <div>
          {fetchListMembers.data && fetchListMembers.data.pages.length != 0 ? (
            <>
              {fetchListMembers.data.pages.map((page) =>
                page.listMembers.map((member) => (
                  <ListMember key={member.memberId} member={member} />
                )),
              )}
              {fetchListMembers.hasNextPage && <div ref={ref}>Loading...</div>}
            </>
          ) : (
            <div className="py-4 text-center font-semibold text-blue-500">
              Start adding Members
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ListMembersModal;
