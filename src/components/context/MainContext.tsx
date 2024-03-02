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
  createPostModalIsOpen: false,
  setCreatePostModalIsOpen: (value: boolean) => {},
  createListModalIsOpen: false,
  setCreateListModalIsOpen: (value: boolean) => {},
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
  const [createPostModalIsOpen, setCreatePostModalIsOpen] = useState(false);
  const [createListModalIsOpen, setCreateListModalIsOpen] = useState(false);
  return (
    <MainContext.Provider
      value={{
        mobileMenuIsOpen,
        setMobileMenuIsOpen,
        profilePageSelectedTab,
        setProfilePageSelectedTab,
        mainPageSelectedTab,
        setMainPageSelectedTab,
        createPostModalIsOpen,
        setCreatePostModalIsOpen,
        createListModalIsOpen,
        setCreateListModalIsOpen,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export default MainContextProvider;
