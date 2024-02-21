import React, { useEffect, useRef } from "react";
import OutsideAlerter from "../hooks/useOutsideAlerter";
import MobileAccountHeader from "./MobileAccountHeader";
import MenuItem from "./MenuItem";
import ProfileIcon from "../icons/ProfileIcon";
import LogoIcon from "../icons/LogoIcon";
import ListsIcon from "../icons/ListsIcon";
import BookmarkIcon from "../icons/BookmarkIcon";
import CommunityIcon from "../icons/CommunityIcon";
import MoneyIcon from "../icons/MoneyIcon";
import ExternalLinkIcon from "../icons/ExternalLinkIcon";
import SettingsIcon from "../icons/SettingsIcon";
import LogOutIcon from "../icons/LogOutIcon";
import { signOut, useSession } from "next-auth/react";
import ProfileIconFilled from "../icons/ProfileIconFilled";
import ListsIconFilled from "../icons/ListsIconFilled";
import BookmarkIconFilled from "../icons/BookmarkIconFilled";
import CommunityIconFilled from "../icons/CommunityIconFilled";
import { useRouter } from "next/router";

type Props = {
  isOpen?: boolean;
  setIsOpen: (value: boolean) => void;
};

const MobileMenu = ({ isOpen, setIsOpen }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const ref = useRef(null);

  useEffect(() => {
    if (isOpen == true) {
      ref.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="w-full">
      <OutsideAlerter onOutsideClick={() => setIsOpen(false)}>
        <div
          ref={ref}
          className={`pointer-events-auto relative z-50 ${isOpen ? "left-0" : "-left-3/4"} h-screen max-h-screen w-3/4 overflow-scroll bg-white pb-11 duration-300`}
        >
          <MobileAccountHeader />
          <nav>
            <ul>
              <MenuItem
                href={`/${session?.user.username}`}
                title="Profile"
                icon={<ProfileIcon className="h-6 w-6" />}
                activeIcon={<ProfileIconFilled className="h-6 w-6" />}
                active={router.pathname == "/[username]"}
                onClick={()=>setIsOpen(false)}
              />
              <MenuItem
                href="#"
                title="Premium"
                icon={<LogoIcon className="h-6 w-6" />}
                activeIcon={<LogoIcon className="h-6 w-6" />}
                active={router.pathname == "/premium"}
                onClick={()=>setIsOpen(false)}
              />
              <MenuItem
                href="#"
                title="Lists"
                icon={<ListsIcon className="h-6 w-6" />}
                activeIcon={<ListsIconFilled className="h-6 w-6" />}
                active={router.pathname == "/lists"}
                onClick={()=>setIsOpen(false)}
              />
              <MenuItem
                href="/bookmarks"
                title="Bookmarks"
                icon={<BookmarkIcon className="h-6 w-6" />}
                activeIcon={<BookmarkIconFilled className="h-6 w-6" />}
                active={router.pathname == "/bookmarks"}
                onClick={()=>setIsOpen(false)}
              />
              <MenuItem
                href="#"
                title="Communities"
                icon={<CommunityIcon className="h-6 w-6" />}
                activeIcon={<CommunityIconFilled className="h-6 w-6" />}
                active={router.pathname == "/communities"}
                onClick={()=>setIsOpen(false)}
              />
              <MenuItem
                href="#"
                title="Monetisation"
                icon={<MoneyIcon className="h-6 w-6" />}
                activeIcon={<MoneyIcon className="h-6 w-6" />}
                active={router.pathname == "/money"}
                onClick={()=>setIsOpen(false)}
              />
              <MenuItem
                href="#"
                title="Ads"
                icon={<ExternalLinkIcon className="h-6 w-6" />}
                activeIcon={<ExternalLinkIcon className="h-6 w-6" />}
                active={router.pathname == "/ads"}
                onClick={()=>setIsOpen(false)}
              />
              <MenuItem
                href="#"
                title="Settings and privacy"
                icon={<SettingsIcon className="h-6 w-6" />}
                activeIcon={<SettingsIcon className="h-6 w-6" />}
                active={router.pathname == "/settings"}
                onClick={()=>setIsOpen(false)}
              />
              <MenuItem
                href="/auth/logout"
                title="Log out"
                icon={<LogOutIcon className="h-6 w-6" />}
                activeIcon={<LogOutIcon className="h-6 w-6" />}
                active={router.pathname == "/auth/logout"}
                onClick={()=>setIsOpen(false)}
              />
            </ul>
          </nav>
        </div>
      </OutsideAlerter>
      <div
        className={`pointer-events-auto absolute top-0 z-10 h-full w-full bg-black opacity-40 ${isOpen ? "left-0" : "-left-full"}`}
      ></div>
    </div>
  );
};

export default MobileMenu;
