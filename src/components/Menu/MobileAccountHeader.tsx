import React from "react";
import PlusIcon from "../icons/PlusIcon";
import Link from "next/link";

type Props = {};

const MobileAccountHeader = (props: Props) => {
  return (
    <div className="p-4">
      <div className="flex justify-between">
        <Link href="/[username]">
          <div className="h-10 w-10 rounded-full bg-black"></div>
        </Link>
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-gray-300">
          <PlusIcon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <Link href="/[username]" className="mt-2 block">
        <span className="text-grayText text-17px block font-bold">User</span>
        <span className="text-lightGrayText -mt-1 block">@Username</span>
      </Link>
      <div className="mt-3 text-sm">
        <Link href="/[username]/following" className="mr-5 active:underline">
          <span className="text-grayText font-semibold">100</span>
          <span className="text-lightGrayText"> Following</span>
        </Link>
        <Link href="/[username]/followers" className="active:underline">
          <span className="text-grayText font-semibold">10</span>
          <span className="text-lightGrayText"> Followers</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileAccountHeader;
