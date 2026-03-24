"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

import { iconNames, Icons } from "@/app/icons";
import { getCookie, removeCookie } from "@/libs/cookie";
import { EUserType, PAGE_CORE_PERMISSIONS } from "@/types/enum";

import { SidebarNavList } from "./SidebarNavList";

type NavLink = {
  name: string;
  path: string;
  icon: keyof typeof iconNames;
};

interface JwtPayload {
  permissions?: number[];
  role?: string[];
  user_type?: string;
  [key: string]: any;
}

const ALL_LINKS: NavLink[] = [
  { name: "Dashboard", path: "/", icon: "DashboardIcon" },
  { name: "Order", path: "/order", icon: "OrderIcon" },
  { name: "Table", path: "/table", icon: "TableIcon" },
  { name: "Stock", path: "/stock", icon: "StockIcon" },
  { name: "Menu", path: "/menu", icon: "MenuIcon" },
  { name: "Restaurant", path: "/restaurant", icon: "RestaurantIcon" },
];

export const Sidebar = () => {
  const router = useRouter();
  const [allowedLinks, setAllowedLinks] = useState<NavLink[]>([]);

  useEffect(() => {
    const token = getCookie("access_token");

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const userPermissions = decoded.permissions || [];
        const userRoles = decoded.role || [];
        const userType = decoded.user_type; // ดึง user_type ออกมา

        // ---  Logic "Bypass" สำหรับ Master ---
        // ถ้าเป็น MASTER ให้แสดงทุกเมนูทันที ไม่ต้องไปเช็ค Array Permissions
        if (
          userType === EUserType.MASTER ||
          userRoles.includes("Admin") ||
          userRoles.includes("SuperAdmin")
        ) {
          setAllowedLinks(ALL_LINKS);
          return; // จบการทำงาน
        }

        // --- กรองเมนูตาม Permission สำหรับ Worker ---
        const filteredLinks = ALL_LINKS.filter((link) => {
          const requiredPermissions = PAGE_CORE_PERMISSIONS[link.path];

          // ถ้าไม่มีกำหนดใน Mapping บล็อกไว้ก่อน (Secure by default)
          if (!requiredPermissions) {
            return false;
          }

          // เช็คว่ามีสิทธิ์ตรงกันไหม
          return requiredPermissions.some((perm) =>
            userPermissions.includes(perm)
          );
        });

        setAllowedLinks(filteredLinks);
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  }, []);

  const handleLogout = () => {
    removeCookie("access_token");
    removeCookie("restaurant_id");
    router.replace("/login");
  };

  return (
    <div className="w-52 min-h-screen bg-primary-gray-main text-[15px] flex flex-col justify-between items-center py-20 fixed">
      <div className="flex flex-col gap-10">
        <div className="text-2xl font-extrabold text-primary-orange-main">
          FOOD SPHERE
        </div>
        <SidebarNavList className="flex flex-col gap-1" links={allowedLinks} />
      </div>

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
