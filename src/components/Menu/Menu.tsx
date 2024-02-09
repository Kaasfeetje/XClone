import React, { useContext } from "react";
import { MainContext } from "../context/MainContext";
import MobileMenu from "./MobileMenu";

type Props = {};

const Menu = (props: Props) => {
  const { mobileMenuIsOpen, setMobileMenuIsOpen } = useContext(MainContext);

  return (
    <div>
      <div className="hidden md:block">
        <div
          className={`relative -left-3/4 h-screen w-3/4 bg-red-400 md:left-[25px] md:w-[60px] lg:left-[25px] lg:w-[275px]`}
        >
          SIDEBAR
        </div>
      </div>
      <div className="block md:hidden">
        <MobileMenu isOpen={mobileMenuIsOpen} setIsOpen={setMobileMenuIsOpen} />
      </div>
    </div>
  );
};

export default Menu;
