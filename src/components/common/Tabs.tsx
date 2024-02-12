import React, { useEffect, useState } from "react";

type Props = {
  options: string[];
  value: string;
  onChange: (option: string) => void;
};

const Tabs = ({ options, value, onChange }: Props) => {
  return (
    <div className="flex h-[53px] w-full justify-evenly">
      {options.map((option) => (
        <div
          key={option}
          onClick={() => onChange(option)}
          className="flex w-full cursor-pointer justify-center"
        >
          <div
            className={`relative mt-4 ${option == value ? "font-semibold" : "font-medium"}`}
          >
            {option}
            <div
              className={`absolute bottom-1 h-1 w-full rounded-full ${option == value ? "bg-blue-400" : "bg-white"}`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
