import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Menu from "~/components/Menu/Menu";
import LatestSearchContainer from "~/components/PostContainers/Search/LatestSearchContainer";
import ListSearchContainer from "~/components/PostContainers/Search/ListSearchContainer";
import MediaSearchContainer from "~/components/PostContainers/Search/MediaSearchContainer";
import PeopleSearchContainer from "~/components/PostContainers/Search/PeopleSearchContainer";
import TopSearchContainer from "~/components/PostContainers/Search/TopSearchContainer";
import Layout from "~/components/common/Layout";
import Tabs from "~/components/common/Tabs";
import ExploreHeader from "~/components/headers/ExploreHeader/ExploreHeader";

type Props = Record<string, string>;

const SearchTabOptions = {
  Top: "Top",
  Latest: "Latest",
  People: "People",
  Media: "Media",
  Lists: "Lists",
};

const ExploreResultPage = (props: Props) => {
  const router = useRouter();
  const { keyword } = router.query;
  const [currentTab, setCurrentTab] = useState(SearchTabOptions.Top);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout
        menu={<Menu />}
        main={
          <div className="h-full">
            <ExploreHeader />
            <Tabs
              value={currentTab}
              onChange={setCurrentTab}
              options={[
                SearchTabOptions.Top,
                SearchTabOptions.Latest,
                SearchTabOptions.People,
                SearchTabOptions.Media,
                SearchTabOptions.Lists,
              ]}
            />
            {currentTab == SearchTabOptions.Top && (
              <TopSearchContainer
                keyword={keyword ? (keyword as string) : ""}
              />
            )}
            {currentTab == SearchTabOptions.Latest && (
              <LatestSearchContainer
                keyword={keyword ? (keyword as string) : ""}
              />
            )}
            {currentTab == SearchTabOptions.People && (
              <PeopleSearchContainer
                keyword={keyword ? (keyword as string) : ""}
              />
            )}
            {currentTab == SearchTabOptions.Media && (
              <MediaSearchContainer
                keyword={keyword ? (keyword as string) : ""}
              />
            )}
            {currentTab == SearchTabOptions.Lists && (
              <ListSearchContainer
                keyword={keyword ? (keyword as string) : ""}
              />
            )}
          </div>
        }
        sidebar={
          <div>
            <div className="h-screen w-full">Recommended</div>
            <div className="sticky top-0 h-screen w-full bg-blue-200">
              Sidebar
            </div>
          </div>
        }
      />
    </>
  );
};

export default ExploreResultPage;
0;
