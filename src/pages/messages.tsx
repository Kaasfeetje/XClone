import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Menu from "~/components/Menu/Menu";
import Layout from "~/components/common/Layout";

export default function MessagesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    router.push("/auth/login").then();
  }

  if (!session?.user.username) {
    router.push("/auth/complete-signup").then();
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
        main={<div>Messages Page</div>}
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
