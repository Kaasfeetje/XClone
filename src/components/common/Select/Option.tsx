import React from "react";
import { OptionType } from "./Select";
import CheckIcon from "~/components/icons/CheckIcon";

type Props = {
  option?: OptionType;
  selected?: boolean;
  checked?: boolean;
  onClick: (option: OptionType) => void;
};

const Option = ({ option, selected, checked, onClick }: Props) => {
  if (!option) {
    return undefined;
  }

  if (selected) {
    return (
      <div
        className="flex h-[22px] w-fit items-center rounded-full px-3 hover:bg-blue-100"
        onClick={() => onClick(option)}
      >
        <div className="mr-2 fill-blue-500">{option.icon}</div>
        <div className="text-sm font-bold text-blue-500">{option.value}</div>
      </div>
    );
  }
  return (
    <div
      className="flex items-center px-4 py-3"
      onClick={() => onClick(option)}
    >
      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 fill-white">
        {React.cloneElement(option.icon, { className: "h-5 w-5" })}
      </div>
      <div className="font-bold">{option.title}</div>
      {checked && <CheckIcon className="ml-auto h-5 w-5 fill-blue-500" />}
    </div>
  );
};

export default Option;
