import React, { useState } from "react";
import { createContext } from "react";

export enum ProfilePageTabs {
  Posts = "Posts",
  Replies = "Replies",
  Highlights = "Highlights",
  Media = "Media",
  Likes = "Likes",
}

export enum MainPageTabs {
  ForYou = "For you",
  Following = "Following",
}

export const MainContext = createContext({
  mobileMenuIsOpen: false,
  setMobileMenuIsOpen: (value: boolean) => {},
  profilePageSelectedTab: ProfilePageTabs.Posts,
  setProfilePageSelectedTab: (value: ProfilePageTabs) => {},
  mainPageSelectedTab: MainPageTabs.ForYou,
  setMainPageSelectedTab: (value: MainPageTabs) => {},
});

type Props = {
  children: React.ReactNode;
};

const MainContextProvider = ({ children }: Props) => {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const [profilePageSelectedTab, setProfilePageSelectedTab] =
    useState<ProfilePageTabs>(ProfilePageTabs.Posts);
  const [mainPageSelectedTab, setMainPageSelectedTab] = useState<MainPageTabs>(
    MainPageTabs.ForYou,
  );
  return (
    <MainContext.Provider
      value={{
        mobileMenuIsOpen,
        setMobileMenuIsOpen,
        profilePageSelectedTab,
        setProfilePageSelectedTab,
        mainPageSelectedTab,
        setMainPageSelectedTab,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export default MainContextProvider;
