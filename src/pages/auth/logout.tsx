import { signOut } from "next-auth/react";
import React, { useEffect } from "react";

type Props = {};

const Logout = (props: Props) => {
  useEffect(() => {
    signOut({ callbackUrl: "/auth/login" });
  }, []);
  return <div>Logout</div>;
};

export default Logout;
