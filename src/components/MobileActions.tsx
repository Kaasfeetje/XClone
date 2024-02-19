import React, { useEffect, useState } from "react";
import HomeIcon from "./icons/HomeIconFilled";
import SearchIcon from "./icons/SearchIcon";
import BellIcon from "./icons/BellIcon";
import MailIcon from "./icons/MailIcon";
import Link from "next/link";
import CreateTweetIcon from "./icons/CreateTweetIcon";

type Props = {};

const MobileActions = (props: Props) => {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const onScroll = (e: Event) => {
      if (window.scrollY > 0 && isAtTop == true) {
        setIsAtTop(false);
      } else if (window.scrollY < 1 && isAtTop == false) {
        setIsAtTop(true);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAtTop]);

  //TODO: Make active state icons
  return (
    <div
      className={`fixed bottom-0 h-[53px] w-full bg-white md:hidden ${isAtTop ? "opacity-100" : "opacity-20"}`}
    >
      <div className="my-auto flex h-full items-center justify-between">
        <Link href="/" className="flex w-full items-center justify-center">
          <div className="rounded-full p-2 active:bg-gray-200">
            <HomeIcon className="w-7" />
          </div>
        </Link>
        <Link href="#" className="flex w-full items-center justify-center">
          <div className="rounded-full p-2 active:bg-gray-200">
            <SearchIcon className="w-7" />
          </div>
        </Link>
        <Link href="#" className="flex w-full items-center justify-center">
          <div className="rounded-full p-2 active:bg-gray-200">
            <BellIcon className="w-7" />
          </div>
        </Link>
        <Link href="#" className="flex w-full items-center justify-center">
          <div className="rounded-full p-2 active:bg-gray-200">
            <MailIcon className="w-7" />
          </div>
        </Link>
      </div>
      <Link href="#">
        <div className="fixed bottom-18 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 fill-white active:bg-blue-600">
          <CreateTweetIcon className="h-6 w-6" />
        </div>
      </Link>
    </div>
  );
};

export default MobileActions;
