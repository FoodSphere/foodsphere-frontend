"use client";
import React, { useState } from "react";

import { ButtonGroup, ViewType } from "./components/ButtonGroup";
import { ManageDiscountView } from "./components/ManageDiscount";
import { ManageEmployeesView } from "./components/ManageEmployees";
import { MyRestaurantView } from "./components/MyRestaurant";

const RestaurantRender = () => {
  const [currentView, setCurrentView] = useState<ViewType>("my-restaurant");

  const renderContent = () => {
    switch (currentView) {
      case "my-restaurant":
        return <MyRestaurantView />;
      case "manage-employees":
        return <ManageEmployeesView />;
      case "manage-discount":
        return <ManageDiscountView />;
      default:
        return <MyRestaurantView />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-100 p-4 lg:p-8 font-sans">
      <ButtonGroup activeView={currentView} setActiveView={setCurrentView} />
      <main className="flex-1 pl-4 lg:pl-8">{renderContent()}</main>
    </div>
  );
};

export default RestaurantRender;
