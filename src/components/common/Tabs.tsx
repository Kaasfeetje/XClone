import React, { useEffect, useState } from "react";

type Props = {
  options: string[];
  value: string;
  onChange: (option: string) => void;
};

const Tabs = ({ options, value, onChange }: Props) => {
  return (
    <div className="flex h-[53px] w-full justify-evenly overflow-x-auto">
      {options.map((option, index) => (
        <div
          key={option}
          onClick={() => onChange(option)}
          className={`flex w-max  cursor-pointer justify-center px-4 ${index == 0 ? "ml-4 md:ml-0" : ""}`}
        >
          <div
            className={`relative mt-4 flex w-max justify-center  ${option == value ? "font-semibold" : "font-medium"}`}
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
