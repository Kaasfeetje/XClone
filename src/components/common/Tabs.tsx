import React, { useEffect, useState } from "react";

type Props = {
  options: string[];
};

const Tabs = ({ options }: Props) => {
  const [active, setActive] = useState("");
  //TODO: move this state stuff to global state

  useEffect(() => {
    if (options && options[0]) {
      setActive(options[0]);
    }
  }, [options]);

  return (
    <div className="flex w-full justify-evenly">
      {options.map((option) => (
        <div
          key={option}
          onClick={() => setActive(option)}
          className="flex w-full cursor-pointer justify-center"
        >
          <div
            className={`mt-4 ${option == active ? "font-semibold" : "font-medium"}`}
          >
            {option}
            <div
              className={`mt-4 h-1 w-full rounded-full ${option == active ? "bg-blue-400" : "bg-white"}`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
