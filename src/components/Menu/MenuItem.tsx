import Link from "next/link";
import React from "react";

type Props = {
  href: string;
  title: string;
  icon: React.ReactNode;
  active?: boolean;
};

const MenuItem = ({ href, title, icon, active }: Props) => {
  return (
    <Link href={href}>
      <li className="flex items-center justify-start p-4">
        <div className="mr-6 md:mx-auto lg:ml-0 lg:mr-6">{icon}</div>
        <span
          className={`h-6 text-xl font-semibold md:hidden lg:block ${active ? "lg:font-semibold" : "lg:font-medium"}`}
        >
          {title}
        </span>
      </li>
    </Link>
  );
};

export default MenuItem;
