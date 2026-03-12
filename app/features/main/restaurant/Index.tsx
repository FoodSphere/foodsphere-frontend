"use client";
import { useState } from "react";

import { ButtonGroup, ViewType } from "./components/ButtonGroup";
import { ManageEmployeesView } from "./components/ManageEmployees";
import { ManageRolesView } from "./components/ManageRoles";
import { ManagePromotionView } from "./components/ManagePromotion";
import { MyRestaurantView } from "./components/MyRestaurant";

const RestaurantRender = () => {
  const [currentView, setCurrentView] = useState<ViewType>("my-restaurant");

  const renderContent = () => {
    switch (currentView) {
      case "my-restaurant":
        return <MyRestaurantView />;
      case "manage-employees":
        return <ManageEmployeesView />;
      case "manage-roles":
        return <ManageRolesView />;
      case "manage-discount":
        return <ManagePromotionView />;
      default:
        return <MyRestaurantView />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white p-6 lg:p-10 gap-10">
      {/* Sidebar Section */}
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl font-extrabold text-black tracking-tight">
          Restaurant
        </h1>
        <ButtonGroup activeView={currentView} setActiveView={setCurrentView} />
      </div>

      {/* Main Content Section */}
      <main className="flex-1 flex flex-col justify-center items-center gap-6 pl-10">
        <div className="w-full">{renderContent()}</div>
      </main>
    </div>
  );
};

export default RestaurantRender;
