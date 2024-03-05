import React from "react";
import Modal from "../common/Modal";
import CloseIcon from "../icons/CloseIcon";
import { api } from "~/utils/api";
import ListMember from "./ListMember";

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  listId: string;
};

const ListMembersModal = ({ isOpen, setIsOpen, listId }: Props) => {
  const fetchListMembers = api.list.fetchListMembers.useQuery({ listId });
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
          {fetchListMembers.data && fetchListMembers.data.length != 0 ? (
            fetchListMembers.data.map((member) => (
              <ListMember member={member} />
            ))
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
