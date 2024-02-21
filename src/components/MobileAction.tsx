import Link from "next/link";
import React from "react";

type Props = {
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  active: boolean;
  href: string;
};

const MobileAction = ({ href, icon, activeIcon, active }: Props) => {
  return (
    <Link href={href} className="flex w-full items-center justify-center">
      <div className="rounded-full p-2 active:bg-gray-200">
        {active ? activeIcon : icon}
      </div>
    </Link>
  );
};

export default MobileAction;
