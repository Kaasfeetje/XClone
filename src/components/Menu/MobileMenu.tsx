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

type Props = {
  isOpen?: boolean;
  setIsOpen: (value: boolean) => void;
};

const MobileMenu = ({ isOpen, setIsOpen }: Props) => {
  const { data: session } = useSession();
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
              />
              <MenuItem
                href="#"
                title="Premium"
                icon={<LogoIcon className="h-6 w-6" />}
              />
              <MenuItem
                href="#"
                title="Lists"
                icon={<ListsIcon className="h-6 w-6" />}
              />
              <MenuItem
                href="#"
                title="Bookmarks"
                icon={<BookmarkIcon className="h-6 w-6" />}
              />
              <MenuItem
                href="#"
                title="Communities"
                icon={<CommunityIcon className="h-6 w-6" />}
              />
              <MenuItem
                href="#"
                title="Monetisation"
                icon={<MoneyIcon className="h-6 w-6" />}
              />
              <MenuItem
                href="#"
                title="Ads"
                icon={<ExternalLinkIcon className="h-6 w-6" />}
              />
              <MenuItem
                href="#"
                title="Settings and privacy"
                icon={<SettingsIcon className="h-6 w-6" />}
              />
              <MenuItem
                href="/auth/logout"
                title="Log out"
                icon={<LogOutIcon className="h-6 w-6" />}
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
