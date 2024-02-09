import Link from "next/link";
import React from "react";

type Props = {
  href: string;
  title: string;
  icon: React.ReactNode;
};

const MenuItem = ({ href, title, icon }: Props) => {
  return (
    <Link href={href}>
      <li className="flex items-center justify-start p-4">
        <div className="mr-6">{icon}</div>
        <span className="h-6 text-xl font-semibold">{title}</span>
      </li>
    </Link>
  );
};

export default MenuItem;
