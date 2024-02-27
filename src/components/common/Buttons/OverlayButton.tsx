import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
};

const OverlayButton = ({
  className,
  children,
  disabled,
  type,
  onClick,
}: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`relative h-8 cursor-pointer overflow-hidden rounded-full bg-black bg-opacity-75 px-4  font-bold text-white duration-200  hover:bg-opacity-60  ${className ? className : ""}`}
    >
      {children}
    </button>
  );
};

export default OverlayButton;
