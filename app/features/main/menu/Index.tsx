"use client";

import { useState } from "react";

import { FilterBarComponent } from "@/app/components/featureComponents/FilterBarComponent";
import { HistoryComponent } from "@/app/components/featureComponents/HistoryComponent";
// import { ConfirmModalComponent } from "@/app/components/featureComponents/ConfirmModalComponent";
// import { ConfirmTypeEnum } from "@/public/enum/confirmModalEnum";
import { ItemCardComponent } from "@/app/components/featureComponents/ItemCardComponent";
import { MenuModal } from "@/app/components/featureComponents/MenuModal";

interface MenuItem {
  id: string;
  imgUrl: string | null;
  title: string;
  amount: number;
  unit: string;
  ingredients: Array<{ title: string; amount: number }>;
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    imgUrl: null,
    title: "Tonkutsu",
    amount: 80,
    unit: "Bahts",
    ingredients: [
      { title: "Ingredient 1", amount: 100 },
      { title: "Ingredient 2", amount: 200 },
    ],
  },
  {
    id: "2",
    imgUrl:
      "https://www.japanesecooking101.com/wp-content/uploads/2012/03/IMG_3833.jpeg",
    title: "Tonkutsu",
    amount: 80,
    unit: "Bahts",
    ingredients: [
      { title: "Ingredient 1", amount: 100 },
      { title: "Ingredient 2", amount: 200 },
    ],
  },
  {
    id: "3",
    imgUrl:
      "https://www.japanesecooking101.com/wp-content/uploads/2012/03/IMG_3833.jpeg",
    title: "Tonkutsu",
    amount: 80,
    unit: "Bahts",
    ingredients: [
      { title: "Ingredient 1", amount: 100 },
      { title: "Ingredient 2", amount: 200 },
    ],
  },
  {
    id: "4",
    imgUrl:
      "https://www.japanesecooking101.com/wp-content/uploads/2012/03/IMG_3833.jpeg",
    title: "Tonkutsu",
    amount: 80,
    unit: "Bahts",
    ingredients: [
      { title: "Ingredient 1", amount: 100 },
      { title: "Ingredient 2", amount: 200 },
    ],
  },
  {
    id: "5",
    imgUrl: null,
    title: "Tonkutsu",
    amount: 80,
    unit: "Bahts",
    ingredients: [
      { title: "Ingredient 1", amount: 100 },
      { title: "Ingredient 2", amount: 200 },
    ],
  },
];

const MenuRender = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const handleEditClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleSave = (updatedItem: any) => {
    console.log("Saved:", updatedItem);
    // In a real application, you would update the state here
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6">
      <div className="w-full flex justify-between items-center px-4">
        <FilterBarComponent />
        <button 
          onClick={handleAddClick}
          className="bg-primary-orange-main text-white px-4 py-2 rounded-lg"
        >
          Add Menu
        </button>
      </div>

      <div className="flex">
        {/* Menus Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <ItemCardComponent
              key={item.id}
              imgUrl={item.imgUrl}
              title={item.title}
              amount={item.amount}
              unit={item.unit}
              onEdit={() => handleEditClick(item)}
              onClose={() => console.log("Close Item")}
              useIngredients={true}
              Ingredients={item.ingredients}
            />
          ))}
        </div>

        <HistoryComponent />
      </div>

      <MenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        menuItem={selectedItem}
        onSave={handleSave}
      />

      {/* <ConfirmModalComponent 
        confirmType={ConfirmTypeEnum.AddMenu}
        itemName="Sukiyaki"
        onConfirm={() => console.log("Confirm")}
        onCancel={() => console.log("Cancel")}
      /> */}
    </div>
  );
};

export default MenuRender;
