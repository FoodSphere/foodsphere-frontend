"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { iconNames, Icons } from "@/app/icons";

interface SidebarNavListProps {
  className?: string;
  links: Array<{
    name: string;
    path: string;
    icon: keyof typeof iconNames;
  }>;
}

export const SidebarNavList = ({ className, links }: SidebarNavListProps) => {
  const pathName = usePathname();
  return (
    <nav className={className}>
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.path}
          className={clsx(
            "flex flex-col items-center gap-1 text-black font-medium py-2 px-4 hover:text-primary-orange-main transition duration-150 ease-in-out",
            {
              "bg-primary-orange-main rounded-xl text-white hover:text-white":
                link.path === pathName,
            }
          )}
        >
          {link.icon && (
            <div className="w-10 h-10 bg-white rounded-full flex justify-center items-center">
              <Icons
                className="w-5 text-primary-orange-main"
                name={link.icon}
              />
            </div>
          )}
          {link.name}
        </Link>
      ))}
    </nav>
  );
};
