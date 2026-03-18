"use client";
import { useEffect, useState } from "react";

import { ButtonGroup, ViewType, NavItem } from "./components/ButtonGroup";
import { ManageEmployeesView } from "./components/ManageEmployees";
import { ManagePromotionView } from "./components/ManagePromotion";
import { ManageRolesView } from "./components/ManageRoles";
import { MyRestaurantView } from "./components/MyRestaurant";
import jwt from "jsonwebtoken";
import { getCookie } from "@/libs/cookie";
import { EUserType } from "@/types/enum";
import { Lock, Store, TicketPercent, Users } from "lucide-react";

interface JwtPayload {
  role: string[];
  restaurant_id: string;
  branch_id: number;
  user_type: string;
  permissions: number[];
}

const RestaurantRender = () => {
  const [currentView, setCurrentView] = useState<ViewType>("my-restaurant");
  const [decodedToken, setDecodedToken] = useState<JwtPayload | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const token = getCookie("access_token");
    if (token) {
      const decoded = jwt.decode(token) as JwtPayload;
      if (decoded.user_type === EUserType.MASTER) {
        setCurrentView("my-restaurant");
      } else {
        setCurrentView("manage-promotion");
      }
      setDecodedToken(decoded);
    }
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  const renderContent = () => {
    if (decodedToken?.user_type === EUserType.MASTER) {
      switch (currentView) {
        case "my-restaurant":
          return <MyRestaurantView />;
        case "manage-employees":
          return <ManageEmployeesView />;
        case "manage-roles":
          return <ManageRolesView />;
        case "manage-promotion":
          return <ManagePromotionView />;
        default:
          return <MyRestaurantView />;
      }
    } else {
      switch (currentView) {
        case "manage-promotion":
          return <ManagePromotionView />;
        default:
          return <ManagePromotionView />;
      }
    }
  };

  const getNavLists = () => {
    if (decodedToken?.user_type === EUserType.MASTER) {
      const navItems: NavItem[] = [
        {
          id: "my-restaurant",
          label: "My Restaurant",
          icon: <Store className="w-5 h-5" />,
        },
        {
          id: "manage-employees",
          label: "Manage Employees",
          icon: <Users className="w-5 h-5" />,
        },
        {
          id: "manage-roles",
          label: "Manage Roles",
          icon: <Lock className="w-5 h-5" />,
        },
        {
          id: "manage-promotion",
          label: "Manage Promotion",
          icon: <TicketPercent className="w-5 h-5" />,
        },
      ];
      return navItems;
    } else {
      const navItems: NavItem[] = [
        {
          id: "manage-promotion",
          label: "Manage Promotion",
          icon: <TicketPercent className="w-5 h-5" />,
        },
      ];
      return navItems;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white p-6 lg:p-10 gap-10">
      {/* Sidebar Section */}
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl font-extrabold text-black tracking-tight">
          Restaurant
        </h1>
        <ButtonGroup
          activeView={currentView}
          setActiveView={setCurrentView}
          navItems={getNavLists()}
        />
      </div>

      {/* Main Content Section */}
      <main className="flex-1 flex flex-col justify-center items-center gap-6 pl-10">
        <div className="w-full">{renderContent()}</div>
      </main>
    </div>
  );
};

export default RestaurantRender;
