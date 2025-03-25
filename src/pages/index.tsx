import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext } from "react";
import Menu from "~/components/Menu/Menu";
import FollowingContainer from "~/components/PostContainers/FollowingContainer";
import PostContainer from "~/components/PostContainers/PostContainer";
import Layout from "~/components/common/Layout";
import { MainContext, MainPageTabs } from "~/components/context/MainContext";
import MainHeader from "~/components/headers/MainHeader/MainHeader";
import { api } from "~/utils/api";

export default function Home() {
  const deleteAllMutation = api.post.deleteAll.useMutation();

  const router = useRouter();
  const { data: session, status } = useSession();

  const { mainPageSelectedTab } = useContext(MainContext);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    void router.push("/auth/login");
  }

  if (!session?.user.username) {
    //Complete signup
    void router.push("/auth/complete-signup");
  }

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
          <div>
            <MainHeader />
            {/* Obviously remove later (DEV FEATURE) */}
            <button
              onClick={() => deleteAllMutation.mutate()}
              className="bg-red-500 px-4 font-bold text-white "
            >
              DELETE ALL
            </button>
            {mainPageSelectedTab == MainPageTabs.Following && (
              <FollowingContainer />
            )}
            {mainPageSelectedTab == MainPageTabs.ForYou && <PostContainer />}
          </div>
        }
        sidebar={
          <div>
            <div className="h-screen w-full">Recommended</div>
            <div className="sticky top-0 h-screen w-full bg-blue-200">
              TRENDS
            </div>
          </div>
        }
      />
    </>
  );
}
