import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import MainContextProvider from "~/components/context/MainContext";
import { useEffect } from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // useEffect(() => {
  //   if (document) {
  //     const clickThing = (e: MouseEvent) => {
  //       console.log(e);
  //     };
  //     document.body.addEventListener("click", clickThing);
  //     return () => document.removeEventListener("click", clickThing);
  //   }
  // }, []);

  return (
    <MainContextProvider>
      <SessionProvider session={session}>
        <>
          <div id="modals"></div>
          <Component {...pageProps} />
        </>
      </SessionProvider>
    </MainContextProvider>
  );
};

export default api.withTRPC(MyApp);
