import React from "react";
import DotsIcon from "../icons/DotsIcon";

type Props = {};

const BookmarkHeader = (props: Props) => {
  return (
    <div className="sticky top-0 z-20 flex h-[53px] w-full items-center justify-between bg-white px-4">
      <div className="flex flex-col justify-center">
        <span className="text-xl font-semibold text-grayText">Bookmarks</span>
        <span className="-mt-1 text-13px text-lightGrayText">@username</span>
      </div>
      <div className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full duration-200 hover:bg-gray-200">
        <DotsIcon className="h-5 w-5" />
      </div>
    </div>
  );
};

export default BookmarkHeader;
