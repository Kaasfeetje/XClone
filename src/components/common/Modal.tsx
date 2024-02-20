import React from "react";
import ReactDOM from "react-dom";

type Props = {
  children: React.ReactNode;
  centered?: boolean;
  isOpen: boolean;
  onClose: () => void;
};

const Modal = ({ children, centered, isOpen, onClose }: Props) => {
  return ReactDOM.createPortal(
    <div
      className={`${isOpen ? "pointer-events-auto visible opacity-100" : "pointer-events-none invisible opacity-0"} fixed z-10 h-screen w-screen  ${centered ? "flex items-center justify-center" : ""}`}
    >
      <div
        onClick={onClose}
        className="fixed left-0 h-full w-full bg-black opacity-50"
      ></div>
      {children}
    </div>,
    document.getElementById("modals")!,
  );
};

export default Modal;
