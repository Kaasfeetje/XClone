import React from "react";
import OutsideAlerter from "../hooks/useOutsideAlerter";
import MobileAccountHeader from "./MobileAccountHeader";

type Props = {
  isOpen?: boolean;
  setIsOpen: (value: boolean) => void;
};

const MobileMenu = ({ isOpen, setIsOpen }: Props) => {
  return (
    <div className="w-full">
      <OutsideAlerter onOutsideClick={() => setIsOpen(false)}>
        <div
          className={`pointer-events-auto relative z-50 ${isOpen ? "left-0" : "-left-3/4"} h-screen max-h-screen w-3/4 bg-white duration-300`}
        >
          <MobileAccountHeader />
        </div>
      </OutsideAlerter>
      <div
        className={`absolute  top-0 h-full w-full bg-black opacity-40 ${isOpen ? "left-0" : "-left-full"}`}
      ></div>
    </div>
  );
};

export default MobileMenu;
