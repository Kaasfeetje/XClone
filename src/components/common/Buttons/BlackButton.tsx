import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
};

const BlackButton = ({
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
      className={` h-9 cursor-pointer rounded-full bg-black px-4 font-bold text-white duration-200 hover:opacity-80 ${className ? className : ""}`}
    >
      {children}
    </button>
  );
};

export default BlackButton;
