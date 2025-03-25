import { signOut } from "next-auth/react";
import React, { useEffect } from "react";

type Props = Record<string, string>;

const Logout = (props: Props) => {
  useEffect(() => {
    void signOut({ callbackUrl: "/auth/login" });
  }, []);
  return <div>Logout</div>;
};

export default Logout;
