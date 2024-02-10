import { useSession } from "next-auth/react";
import Head from "next/head";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import Menu from "~/components/Menu/Menu";
import MobileActions from "~/components/MobileActions";
import MainHeader from "~/components/headers/MainHeader/MainHeader";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    router.push("/auth/login");
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="text-normal w-full lg:flex lg:justify-center">
        <div className="pointer-events-none fixed top-0 z-10 w-full max-w-[1310px]">
          <Menu />
        </div>
        <main className="relative z-0 flex w-full justify-end  lg:ml-[80px] lg:max-w-[1310px]">
          <div className="flex w-full md:w-[920px] md:justify-between  lg:w-[1050px]">
            <div className="w-full md:w-[600px]">
              <MainHeader />
              <div className="h-screen w-full bg-blue-200">main content</div>
              <div className="h-screen w-full">main content</div>
              <div className="h-screen w-full bg-blue-200">main content</div>
              <div className="h-screen w-full">main content</div>
            </div>
            <div className="hidden md:block md:w-[290px] lg:ml-[25px] lg:mr-[75px] lg:w-[350px]">
              <div className="h-screen w-full">Recommended</div>
              <div className="sticky top-0 h-screen w-full bg-blue-200">
                TRENDS
              </div>
            </div>
          </div>
          <MobileActions />
        </main>
      </div>
    </>
  );
}
