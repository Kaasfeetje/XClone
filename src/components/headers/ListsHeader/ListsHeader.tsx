import React, { useContext, useState } from "react";
import AddListIcon from "~/components/icons/AddListIcon";
import DotsIcon from "~/components/icons/DotsIcon";
import LeftArrowIcon from "~/components/icons/LeftArrow";
import ListSearchForm from "./ListSearchForm";
import { MainContext } from "~/components/context/MainContext";

type Props = {};

const ListsHeader = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setCreateListModalIsOpen } = useContext(MainContext);

  return (
    <div className="sticky top-0 z-10 flex h-[53px] items-center justify-between bg-white px-4">
      <div className="w-14">
        <div className="-ml-2 flex h-[34px] w-[34px] items-center justify-center rounded-full duration-200 hover:bg-gray-200">
          <LeftArrowIcon className="h-5 w-5" />
        </div>
      </div>
      <ListSearchForm isOpen={isOpen} setIsOpen={setIsOpen} />
      <button
        onClick={() => setCreateListModalIsOpen(true)}
        className="flex h-[34px] min-w-[34px] items-center justify-center rounded-full duration-200 hover:bg-gray-200"
      >
        <AddListIcon className="h-5 w-5 " />
      </button>
      <div className="ml-3 flex h-[34px] min-w-[34px] items-center justify-center rounded-full duration-200 hover:bg-gray-200">
        <DotsIcon className="h-5 w-5 " />
      </div>
    </div>
  );
};

export default ListsHeader;
