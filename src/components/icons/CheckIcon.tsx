import React from "react";

type Props = {
  className?: string;
};

const CheckIcon = ({ className }: Props) => {
  return (
    <svg className={className ? className : ""} viewBox="0 0 24 24">
      <path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path>
    </svg>
  );
};

export default CheckIcon;
