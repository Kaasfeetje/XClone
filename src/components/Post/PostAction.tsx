import React from "react";

type Props = {
  icon: React.ReactNode;
  value?: number;
  onClick: () => void;
};

const PostAction = ({ icon, value, onClick }: Props) => {
  return (
    <button onClick={onClick} className="fill-lightGrayText flex">
      <div>{icon}</div>
      {value != undefined && (
        <span className="text-13px block px-1">{value}</span>
      )}
    </button>
  );
};

export default PostAction;
