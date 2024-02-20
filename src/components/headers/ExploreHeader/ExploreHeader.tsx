import React, { useState } from "react";
import LeftArrowIcon from "../../icons/LeftArrow";
import SettingsIcon from "../../icons/SettingsIcon";
import SearchForm from "~/components/common/FormComponents/SearchForm";

type Props = {};

const ExploreHeader = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-10 flex h-[53px] w-full items-center justify-between bg-white px-4">
      <button
        onClick={() => setIsOpen(false)}
        className={`relative flex h-[34px] w-14 min-w-14 items-center ${isOpen ? "block" : "hidden"}`}
      >
        <div className="absolute left-0 flex h-[34px] w-[34px] -translate-x-1/4 items-center justify-center rounded-full hover:bg-gray-300">
          <LeftArrowIcon className="h-5 w-5" />
        </div>
      </button>
      <SearchForm isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="relative flex h-[34px] w-14 min-w-14 cursor-pointer items-center">
        <div className="absolute right-0 flex h-[34px] w-[34px] translate-x-1/4 items-center justify-center rounded-full hover:bg-gray-300">
          <SettingsIcon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default ExploreHeader;
