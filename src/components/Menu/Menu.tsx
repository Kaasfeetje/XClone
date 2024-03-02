import React, { useContext } from "react";
import { MainContext } from "../context/MainContext";
import MobileMenu from "./MobileMenu";
import LogoIcon from "../icons/LogoIcon";
import Link from "next/link";
import MenuItem from "./MenuItem";
import HomeIconFilled from "../icons/HomeIconFilled";
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
import { useSession } from "next-auth/react";
import HomeIcon from "../icons/HomeIcon";
import SearchIconFilled from "../icons/SearchIconFilled";
import BellIconFilled from "../icons/BellIconFilled";
import MailIconFilled from "../icons/MailIconFilled";
import ListsIconFilled from "../icons/ListsIconFilled";
import BookmarkIconFilled from "../icons/BookmarkIconFilled";
import CommunityIconFilled from "../icons/CommunityIconFilled";
import ProfileIconFilled from "../icons/ProfileIconFilled";
import { useRouter } from "next/router";
import PrimaryButton from "../common/Buttons/PrimaryButton";

type Props = {};

const Menu = (props: Props) => {
  const { data: session } = useSession();
  const router = useRouter();

  const {
    mobileMenuIsOpen,
    setMobileMenuIsOpen,
    createPostModalIsOpen,
    setCreatePostModalIsOpen,
  } = useContext(MainContext);

  return (
    <div>
      <div className=" block md:hidden">
        <MobileMenu isOpen={mobileMenuIsOpen} setIsOpen={setMobileMenuIsOpen} />
      </div>
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
                href="/"
                title="Home"
                icon={<HomeIcon className="h-7 w-7" />}
                activeIcon={<HomeIconFilled className="h-7 w-7" />}
                active={router.pathname == "/"}
              />
              <MenuItem
                href="/explore"
                title="Explore"
                icon={<SearchIcon className="h-7 w-7" />}
                activeIcon={<SearchIconFilled className="h-7 w-7" />}
                active={router.pathname == "/explore"}
              />
              <MenuItem
                href="#"
                title="Notifications"
                icon={<BellIcon className="h-7 w-7" />}
                activeIcon={<BellIconFilled className="h-7 w-7" />}
                active={router.pathname == "/notifications"}
              />
              <MenuItem
                href="#"
                title="Messages"
                icon={<MailIcon className="h-7 w-7" />}
                activeIcon={<MailIconFilled className="h-7 w-7" />}
                active={router.pathname == "/messages"}
              />
              <MenuItem
                href={`/${session?.user.username}/lists`}
                title="Lists"
                icon={<ListsIcon className="h-7 w-7" />}
                activeIcon={<ListsIconFilled className="h-7 w-7" />}
                active={router.pathname == "/lists"}
              />
              <MenuItem
                href="/bookmarks"
                title="Bookmarks"
                icon={<BookmarkIcon className="h-7 w-7" />}
                activeIcon={<BookmarkIconFilled className="h-7 w-7" />}
                active={router.pathname == "/bookmarks"}
              />
              <MenuItem
                href="#"
                title="Communities"
                icon={<CommunityIcon className="h-7 w-7" />}
                activeIcon={<CommunityIconFilled className="h-7 w-7" />}
                active={router.pathname == "/communities"}
              />
              <MenuItem
                href="#"
                title="Premium"
                icon={<LogoIcon className="h-7 w-7" />}
                activeIcon={<LogoIcon className="h-7 w-7" />}
                active={router.pathname == "/premium"}
              />
              <MenuItem
                href={`/${session?.user.username}`}
                title="Profile"
                icon={<ProfileIcon className="h-7 w-7" />}
                activeIcon={<ProfileIconFilled className="h-7 w-7" />}
                active={router.pathname == `/[username]`}
              />
              <MenuItem
                href="#"
                title="More"
                icon={<MoreIcon className="h-7 w-7" />}
                activeIcon={<MoreIcon className="h-7 w-7" />}
                active={router.pathname == "/more"}
              />
            </ul>
          </nav>
          <PrimaryButton
            onClick={() => setCreatePostModalIsOpen(true)}
            className="h-[50px] w-full text-17px"
          >
            Post
          </PrimaryButton>
          <Link href="#" className="block lg:hidden">
            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-blue-500 fill-white active:bg-blue-600">
              <CreateTweetIcon className="h-6 w-6" />
            </div>
          </Link>

          <DesktopAccountFooter />
        </div>
      </div>
    </div>
  );
};

export default Menu;
