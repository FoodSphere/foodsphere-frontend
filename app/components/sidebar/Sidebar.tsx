import Link from "next/link";

import { iconNames, Icons } from "@/app/icons";

import { SidebarNavList } from "./SidebarNavList";

type NavLink = {
  name: string;
  path: string;
  icon: keyof typeof iconNames;
};

export const Sidebar = () => {
  const links: NavLink[] = [
    { name: "Dashboard", path: "/", icon: "DashboardIcon" },
    { name: "Order", path: "/order", icon: "OrderIcon" },
    { name: "Table", path: "/table", icon: "TableIcon" },
    { name: "Stock", path: "/stock", icon: "StockIcon" },
    { name: "Menu", path: "/menu", icon: "MenuIcon" },
    { name: "Restaurant", path: "/restaurant", icon: "RestaurantIcon" },
  ];

  return (
    <div className="w-52 min-h-screen bg-primary-gray-main text-[15px] flex flex-col justify-between items-center py-20">
      <div className="flex flex-col gap-10">
        {/* product logo */}
        <div className="text-2xl font-extrabold text-primary-orange-main">
          FOOD SPHERE
        </div>
        {/* feature links */}
        <SidebarNavList className="flex flex-col gap-1" links={links} />
      </div>

      {/* logout */}
      <Link
        href="/"
        className="text-black flex flex-col items-center gap-2 hover:text-primary-orange-main transition duration-150 ease-in-out"
      >
        <Icons className="w-6 text-primary-orange-main" name="LogoutIcon" />
        Logout
      </Link>
    </div>
  );
};
