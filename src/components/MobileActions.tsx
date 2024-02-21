import React, { useContext, useEffect, useState } from "react";
import HomeIcon from "./icons/HomeIcon";
import SearchIcon from "./icons/SearchIcon";
import BellIcon from "./icons/BellIcon";
import MailIcon from "./icons/MailIcon";
import Link from "next/link";
import CreateTweetIcon from "./icons/CreateTweetIcon";
import { MainContext } from "./context/MainContext";
import { useRouter } from "next/router";
import MobileAction from "./MobileAction";
import HomeIconFilled from "./icons/HomeIconFilled";
import SearchIconFilled from "./icons/SearchIconFilled";
import BellIconFilled from "./icons/BellIconFilled";
import MailIconFilled from "./icons/MailIconFilled";
import CommentIcon from "./icons/CommentIcon";

type Props = {};

const MobileActions = (props: Props) => {
  const router = useRouter();
  const { setCreatePostModalIsOpen } = useContext(MainContext);
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

  return (
    <div
      className={`pointer-events-auto fixed bottom-0 z-50 h-[53px] w-full bg-white md:hidden ${isAtTop ? "opacity-100" : "opacity-20"}`}
    >
      <div className="my-auto flex h-full items-center justify-between">
        <MobileAction
          href="/"
          icon={<HomeIcon className="w-7" />}
          activeIcon={<HomeIconFilled className="w-7" />}
          active={router.pathname == "/"}
        />
        <MobileAction
          href="/explore"
          icon={<SearchIcon className="w-7" />}
          activeIcon={<SearchIconFilled className="w-7" />}
          active={router.pathname == "/explore"}
        />
        <MobileAction
          href="/notifications"
          icon={<BellIcon className="w-7" />}
          activeIcon={<BellIconFilled className="w-7" />}
          active={router.pathname == "/notifications"}
        />
        <MobileAction
          href="/messages"
          icon={<MailIcon className="w-7" />}
          activeIcon={<MailIconFilled className="w-7" />}
          active={router.pathname == "/messages"}
        />
      </div>
      <div
        onClick={(e) => {
          setCreatePostModalIsOpen(true);
          e.preventDefault();
        }}
        className="fixed bottom-18 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 fill-white active:bg-blue-600"
      >
        {router.pathname == "/[username]/status/[id]" ? (
          <CommentIcon className="h-6 w-6" />
        ) : (
          <CreateTweetIcon className="h-6 w-6" />
        )}
      </div>
    </div>
  );
};

export default MobileActions;
