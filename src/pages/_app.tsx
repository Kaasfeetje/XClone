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
  //   document.body.addEventListener("click", (e) => console.log(e));
  //   return () =>
  //     document.body.removeEventListener("click", (e) => console.log(e));
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
