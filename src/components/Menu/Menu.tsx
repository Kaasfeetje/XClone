import React, { useContext } from "react";
import { MainContext } from "../context/MainContext";
import MobileMenu from "./MobileMenu";
import LogoIcon from "../icons/LogoIcon";
import Link from "next/link";
import MenuItem from "./MenuItem";
import HomeIcon from "../icons/HomeIcon";
import SearchIcon from "../icons/SearchIcon";
import BellIcon from "../icons/BellIcon";
import MailIcon from "../icons/MailIcon";
import ListsIcon from "../icons/ListsIcon";
import BookmarkIcon from "../icons/BookmarkIcon";
import CommunityIcon from "../icons/CommunityIcon";
import ProfileIcon from "../icons/ProfileIcon";
import MoreIcon from "../icons/MoreIcon";
import DesktopAccountFooter from "./DesktopAccountFooter";
import CreateTweetIcon from "../icons/CreateTweetIcon";

type Props = {};

const Menu = (props: Props) => {
  const { mobileMenuIsOpen, setMobileMenuIsOpen } = useContext(MainContext);

  return (
    <div>
      <div className="hidden md:block">
        <div
          className={`pointer-events-auto relative -left-3/4 flex h-screen w-3/4 flex-col items-center bg-white p-2 md:left-[20px] md:w-[60px] lg:left-[25px] lg:block lg:w-[275px]`}
        >
          <div>
            <Link
              href="/"
              className="mx-1 flex h-[50px] w-[50px] items-center justify-center rounded-full active:bg-gray-300"
            >
              <LogoIcon className="h-8" />
            </Link>
          </div>
          <nav>
            <ul>
              <MenuItem
                href="#"
                title="Home"
                icon={<HomeIcon className="h-7 w-7" />}
                active={true}
              />
              <MenuItem
                href="#"
                title="Explore"
                icon={<SearchIcon className="h-7 w-7" />}
              />
              <MenuItem
                href="#"
                title="Notifications"
                icon={<BellIcon className="h-7 w-7" />}
              />
              <MenuItem
                href="#"
                title="Messages"
                icon={<MailIcon className="h-7 w-7" />}
              />
              <MenuItem
                href="#"
                title="Lists"
                icon={<ListsIcon className="h-7 w-7" />}
              />
              <MenuItem
                href="#"
                title="Bookmarks"
                icon={<BookmarkIcon className="h-7 w-7" />}
              />
              <MenuItem
                href="#"
                title="Communities"
                icon={<CommunityIcon className="h-7 w-7" />}
              />
              <MenuItem
                href="#"
                title="Premium"
                icon={<LogoIcon className="h-7 w-7" />}
              />
              <MenuItem
                href="#"
                title="Profile"
                icon={<ProfileIcon className="h-7 w-7" />}
              />
              <MenuItem
                href="#"
                title="More"
                icon={<MoreIcon className="h-7 w-7" />}
              />
            </ul>
          </nav>
          <button className="text-17px mt-4 hidden h-[50px] w-full rounded-full bg-blue-500 text-center font-bold text-white lg:block">
            Post
          </button>
          <Link href="#" className="block lg:hidden">
            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-blue-500 fill-white active:bg-blue-600">
              <CreateTweetIcon className="h-6 w-6" />
            </div>
          </Link>

          <DesktopAccountFooter />
        </div>
      </div>
      <div className="block md:hidden">
        <MobileMenu isOpen={mobileMenuIsOpen} setIsOpen={setMobileMenuIsOpen} />
      </div>
    </div>
  );
};

export default Menu;
