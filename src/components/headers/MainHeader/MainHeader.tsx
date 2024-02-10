import React, { useContext } from "react";
import SettingsButton from "./SettingsButton";
import LogoIcon from "../../icons/LogoIcon";
import Tabs from "~/components/common/Tabs";
import TweetForm from "./TweetForm";
import { MainContext } from "~/components/context/MainContext";
import Avatar from "~/components/common/Avatar";
import { useSession } from "next-auth/react";

type Props = {};

const MainHeader = (props: Props) => {
  const { data: session } = useSession();

  const { mobileMenuIsOpen, setMobileMenuIsOpen } = useContext(MainContext);

  return (
    <div className="mx-4">
      <div className="mx-4 flex h-[53px] items-center justify-between md:hidden">
        <div
          className="h-8 w-8 rounded-full bg-black"
          onClick={() => setMobileMenuIsOpen(!mobileMenuIsOpen)}
        >
          <Avatar
            profileImage={session?.user.profileImage}
            image={session?.user.image}
          />
        </div>
        <LogoIcon className="h-7" />
        <SettingsButton size="h-5 w-5" />
      </div>
      <div className="flex">
        <Tabs options={["For You", "Following"]}></Tabs>
        <SettingsButton
          className="hidden md:flex md:h-[52px] md:w-[52px] md:items-center md:justify-center"
          size="h-5 w-5"
        />
      </div>
      <TweetForm />
    </div>
  );
};

export default MainHeader;
