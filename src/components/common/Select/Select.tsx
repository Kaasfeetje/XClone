import React, { useEffect, useState } from "react";
import Option from "./Option";
import OutsideAlerter from "~/components/hooks/useOutsideAlerter";

export type OptionType = {
  icon: React.ReactElement;
  title: string;
  value: string;
};
type Props = {
  dropdownTitle?: string;
  dropdownDescription?: string;
  options: OptionType[];
  selected: OptionType | undefined;
  setSelected: (value: OptionType) => void;
};

const Select = ({
  dropdownTitle,
  dropdownDescription,
  options,
  selected,
  setSelected,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div>
        {
          <Option
            option={selected}
            selected={true}
            onClick={() => setIsOpen(!isOpen)}
          />
        }
      </div>
      {isOpen && (
        <OutsideAlerter onOutsideClick={() => setIsOpen(false)}>
          <div className="absolute -left-6 top-8 w-[320px] rounded-2xl border border-gray-300 bg-white">
            <div className="px-3 pt-4">
              <span className="font-bold">{dropdownTitle}</span>
              <p>{dropdownDescription}</p>
            </div>

            <ul>
              {options.map((option) => (
                <Option
                  option={option}
                  onClick={(option) => {
                    setSelected(option);
                    setIsOpen(false);
                  }}
                />
              ))}
            </ul>
          </div>
        </OutsideAlerter>
      )}
    </div>
  );
};

export default Select;
