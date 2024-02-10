import React from "react";
import MobileActions from "../MobileActions";

type Props = {
  menu: React.ReactNode;
  main: React.ReactNode;
  sidebar: React.ReactNode;
};

const Layout = ({ menu, main, sidebar }: Props) => {
  return (
    <div className="text-normal w-full lg:flex lg:justify-center">
      <div className="pointer-events-none fixed top-0 z-10 w-full max-w-[1310px]">
        {menu}
      </div>
      <main className="relative z-0 flex w-full justify-end  lg:ml-[80px] lg:max-w-[1310px]">
        <div className="flex w-full md:w-[920px] md:justify-between  lg:w-[1050px]">
          <div className="w-full md:w-[600px]">{main}</div>
          <div className="hidden md:block md:w-[290px] lg:ml-[25px] lg:mr-[75px] lg:w-[350px]">
            {sidebar}
          </div>
        </div>
        <MobileActions />
      </main>
    </div>
  );
};

export default Layout;
