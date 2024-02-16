import React from "react";

type Props = {
  icon: React.ReactNode;
  textContent: string;
};

const ProfileDataPoint = ({ icon, textContent }: Props) => {
  return (
    <div className="mr-3 flex  fill-lightGrayText ">
      {icon}
      <span className="ml-1">{textContent}</span>
    </div>
  );
};

export default ProfileDataPoint;
