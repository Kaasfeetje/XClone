import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "submit" | "reset" | "button";
  onClick?: () => void;
};

const PrimaryButton = ({
  className,
  children,
  disabled,
  type,
  onClick,
}: Props) => {
  console.log(disabled);
  return (
    <button
      className={`mt-3 block h-9 rounded-full px-4 font-bold text-white duration-200 ${!disabled ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-300"} ${className ? className : ""} `}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
