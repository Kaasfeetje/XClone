import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
};

const MinimalistButton = ({
  className,
  children,
  disabled,
  type,
  onClick,
}: Props) => {
  return (
    <button
      className={`h-9 rounded-full border border-gray-300 bg-white px-4 font-semibold text-grayText duration-200 ${className ? className : ""} hover:bg-gray-200`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default MinimalistButton;
