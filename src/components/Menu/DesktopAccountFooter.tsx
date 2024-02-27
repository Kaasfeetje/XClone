import React, { useState } from "react";
import DotsIcon from "../icons/DotsIcon";
import Link from "next/link";
import OutsideAlerter from "../hooks/useOutsideAlerter";
import { useSession } from "next-auth/react";
import Avatar from "../common/Avatar";

type Props = {};

const DesktopAccountFooter = (props: Props) => {
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className="absolute bottom-4 flex cursor-pointer items-center justify-between rounded-full py-3 duration-200 hover:bg-gray-200 lg:w-[260px]"
    >
      <div className="flex items-center">
        <div className="h-10 w-10 min-w-10 rounded-full bg-black lg:ml-3">
          <Avatar
            profileImage={session?.user.profileImageId}
            image={session?.user.image}
          />
        </div>
        <div className="mx-3 hidden lg:block">
          <span className="block font-semibold text-grayText">
            {session?.user.displayName}
          </span>
          <span className="-mt-1 block text-lightGrayText">
            @{session?.user.username}
          </span>
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
              className="block cursor-pointer px-4 py-3 font-bold text-grayText"
            >
              Add an existing account
            </Link>
            <Link
              href={"/auth/logout"}
              className="block cursor-pointer px-4 py-3 font-bold text-grayText"
            >
              Log out of @{session?.user.username}
            </Link>
          </div>
        </OutsideAlerter>
      </div>
    </div>
  );
};

export default DesktopAccountFooter;
