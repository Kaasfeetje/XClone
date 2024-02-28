import React from "react";

type Props = {
  className?: string;
};

const ReportIcon = ({ className }: Props) => {
  return (
    <svg
      className={className ? className : ""}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M3 2h18.61l-3.5 7 3.5 7H5v6H3V2zm2 12h13.38l-2.5-5 2.5-5H5v10z" />
    </svg>
  );
};

export default ReportIcon;
