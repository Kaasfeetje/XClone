import React from "react";
import SettingsIcon from "../../icons/SettingsIcon";

type Props = {
  className?: string;
  size?: string;
};

const SettingsButton = ({ className, size }: Props) => {
  return (
    <div className={className}>
      <SettingsIcon className={size} />
    </div>
  );
};

export default SettingsButton;
