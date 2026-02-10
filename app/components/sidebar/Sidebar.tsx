"use client"; // จำเป็นต้องใส่เพราะมี User Interaction

import Link from "next/link";
import { useRouter } from "next/navigation"; // Import router

import { iconNames, Icons } from "@/app/icons";
import { removeCookie } from "@/libs/cookie"; // Import removeCookie

import { SidebarNavList } from "./SidebarNavList";

type NavLink = {
  name: string;
  path: string;
  icon: keyof typeof iconNames;
};

export const Sidebar = () => {
  const router = useRouter(); // เรียกใช้ Hook

  const links: NavLink[] = [
    { name: "Dashboard", path: "/", icon: "DashboardIcon" },
    { name: "Order", path: "/order", icon: "OrderIcon" },
    { name: "Table", path: "/table", icon: "TableIcon" },
    { name: "Stock", path: "/stock", icon: "StockIcon" },
    { name: "Menu", path: "/menu", icon: "MenuIcon" },
    { name: "Restaurant", path: "/restaurant", icon: "RestaurantIcon" },
  ];

  const handleLogout = () => {
    // 1. ลบ Token ออกจาก Cookie
    removeCookie("access_token");

    // 2. (Optional) ถ้ามี API Logout ฝั่ง Backend ให้เรียกตรงนี้ด้วย
    // await apiPost('/auth/logout');

    // 3. Redirect ไปหน้า Login
    router.replace("/login"); // ใช้ replace เพื่อไม่ให้กด Back กลับมาหน้าเดิมได้ง่ายๆ
  };

  return (
    <div className="w-52 min-h-screen bg-primary-gray-main text-[15px] flex flex-col justify-between items-center py-20 fixed">
      <div className="flex flex-col gap-10">
        <div className="text-2xl font-extrabold text-primary-orange-main">
          FOOD SPHERE
        </div>
        <SidebarNavList className="flex flex-col gap-1" links={links} />
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="text-black flex flex-col items-center gap-2 hover:text-primary-orange-main transition duration-150 ease-in-out w-full"
      >
        <Icons className="w-6 text-primary-orange-main" name="LogoutIcon" />
        Logout
      </button>
    </div>
  );
};
