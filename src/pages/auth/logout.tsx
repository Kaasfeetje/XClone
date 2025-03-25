import { signOut } from "next-auth/react";
import React, { useEffect } from "react";

type Props = Record<string, string>;

const Logout = (props: Props) => {
  useEffect(() => {
    signOut({ callbackUrl: "/auth/login" }).then();
  }, []);
  return <div>Logout</div>;
};

export default Logout;
