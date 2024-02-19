import React from "react";

type Props = {
  className?: string;
};

const ListsIconFilled = ({ className }: Props) => {
  return (
    <svg className={className ? className : ""} viewBox="0 0 24 24">
      <path d="M18.5 2h-13C4.12 2 3 3.12 3 4.5v15C3 20.88 4.12 22 5.5 22h13c1.38 0 2.5-1.12 2.5-2.5v-15C21 3.12 19.88 2 18.5 2zM16 14H8v-2h8v2zm0-4H8V8h8v2z"></path>
    </svg>
  );
};

export default ListsIconFilled;
