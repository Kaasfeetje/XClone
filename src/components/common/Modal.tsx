import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

type Props = {
  children: React.ReactNode;
  centered?: boolean;
  isOpen: boolean;
  onClose: () => void;
};

const Modal = ({ children, centered, isOpen, onClose }: Props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (mounted) {
    return ReactDOM.createPortal(
      <div
        className={`${isOpen ? "pointer-events-auto visible opacity-100" : "pointer-events-none invisible opacity-0"} fixed z-[51] h-screen w-screen  ${centered ? "flex items-center justify-center" : ""}`}
      >
        <div
          onClick={(e) => {
            onClose();
            e.preventDefault();
          }}
          className="fixed left-0 h-full w-full bg-black opacity-50"
        ></div>
        {children}
      </div>,
      document.getElementById("modals")!,
    );
  }
  return <></>;
};

export default Modal;
