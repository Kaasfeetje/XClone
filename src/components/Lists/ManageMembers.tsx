import React, { useState } from "react";
import LeftArrowIcon from "../icons/LeftArrow";
import Tabs from "../common/Tabs";
import { api } from "~/utils/api";
import ListMember from "./ListMember";

type Props = {
  listId: string;
  setIsManagingMembers: (value: boolean) => void;
};
const ManageMembersTabs = {
  Members: "Members",
  Suggested: "Suggested",
};

const ManageMembers = ({ listId, setIsManagingMembers }: Props) => {
  const fetchListMembers = api.list.fetchListMembers.useQuery(
    { listId },
    { enabled: listId !== undefined },
  );

  const [currentTab, setCurrentTab] = useState(ManageMembersTabs.Members);
  return (
    <div className="z-10 h-full w-full overflow-y-auto border-2  border-white bg-white md:h-fit md:max-h-[calc(80%-53px)] md:min-h-[650px] md:w-[600px] md:rounded-2xl">
      <div className="flex h-[53px] items-center px-4">
        <div className="w-14">
          <div
            onClick={() => setIsManagingMembers(false)}
            className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full duration-200 hover:bg-gray-200"
          >
            <LeftArrowIcon className="h-5 w-5" />
          </div>
        </div>
        <div className="text-xl font-semibold">Manage members</div>
      </div>
      <Tabs
        onChange={setCurrentTab}
        value={currentTab}
        options={[ManageMembersTabs.Members, ManageMembersTabs.Suggested]}
      />
      {currentTab == ManageMembersTabs.Members && (
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
      )}
      {currentTab == ManageMembersTabs.Suggested && (
        <div className="select-none py-4 text-center font-semibold text-lightGrayText">
          Not implemented
        </div>
      )}
    </div>
  );
};

export default ManageMembers;
