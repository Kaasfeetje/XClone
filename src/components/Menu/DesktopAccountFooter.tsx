import React, { useState } from "react";
import DotsIcon from "../icons/DotsIcon";
import Link from "next/link";
import OutsideAlerter from "../hooks/useOutsideAlerter";

type Props = {};

const DesktopAccountFooter = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className="absolute bottom-4 flex cursor-pointer items-center justify-between rounded-full py-3 active:bg-gray-300 lg:w-[260px]"
    >
      <div className="flex items-center">
        <div className="h-10 w-10 min-w-10 rounded-full bg-black lg:ml-3"></div>
        <div className="mx-3 hidden lg:block">
          <span className="text-grayText block font-semibold">User</span>
          <span className="text-lightGrayText -mt-1 block">@username</span>
        </div>
      </div>
      <div className="ml-auto mr-6 hidden lg:block">
        <DotsIcon className="h-5 w-5" />
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute -left-6 bottom-full w-[300px] rounded-xl border border-gray-300 bg-white py-3 lg:-left-8 ${isOpen ? "pointer-events-auto visible opacity-100" : "pointer-events-none invisible opacity-0"}`}
      >
        <OutsideAlerter onOutsideClick={() => setIsOpen(false)}>
          <div>
            <Link
              href="#"
              className="text-grayText block cursor-pointer px-4 py-3 font-bold"
            >
              Add an existing account
            </Link>
            <Link
              href="#"
              className="text-grayText block cursor-pointer px-4 py-3 font-bold"
            >
              Log out of @username
            </Link>
          </div>
        </OutsideAlerter>
      </div>
    </div>
  );
};

export default DesktopAccountFooter;
