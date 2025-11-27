"use client";
import { useState } from "react";
import { ItemCardComponent } from "@/app/components/featureComponents/ItemCardComponent";
import { StockModal } from "@/app/components/featureComponents/StockModal";
// import { ConfirmModalComponent } from "@/app/components/featureComponents/ConfirmModalComponent";
// import { ConfirmTypeEnum } from "@/public/enum/confirmModalEnum";

interface StockItem {
  id: string;
  imgUrl: string | null;
  title: string;
  amount: number;
  unit: string;
}

const stockItems: StockItem[] = [
  {
    id: "1",
    imgUrl: null,
    title: "Chicken Breast",
    amount: 10,
    unit: "pcs.",
  },
  {
    id: "2",
    imgUrl:
      "https://www.everydaycheapskate.com/wp-content/uploads/20250407-how-to-cook-boneless-skinless-chicken-breast-on-a-cutting-board-with-thyme-garlic-and-red-peppercorns.png",
    title: "Chicken Breast",
    amount: 10,
    unit: "pcs.",
  },
  {
    id: "3",
    imgUrl:
      "https://www.everydaycheapskate.com/wp-content/uploads/20250407-how-to-cook-boneless-skinless-chicken-breast-on-a-cutting-board-with-thyme-garlic-and-red-peppercorns.png",
    title: "Chicken Breast",
    amount: 10,
    unit: "pcs.",
  },
];

const StockRender = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

  const handleEditClick = (item: StockItem) => {
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
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <div className="text-red-500">Stock Hello World!!!</div>
        <button 
          onClick={handleAddClick}
          className="bg-primary-orange-main text-white px-4 py-2 rounded-lg"
        >
          Add Stock
        </button>
      </div>
      {/* Menus Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {stockItems.map((item) => (
          <ItemCardComponent
            key={item.id}
            imgUrl={item.imgUrl}
            title={item.title}
            amount={item.amount}
            unit={item.unit}
            onEdit={() => handleEditClick(item)}
            onClose={() => console.log("Close Item")}
          />
        ))}
      </div>
      <StockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stockItem={selectedItem}
        onSave={handleSave}
      />
      {/* <ConfirmModalComponent
        confirmType={ConfirmTypeEnum.DeleteStock}
        itemName="Tomato"
        onConfirm={() => console.log("Confirm")}
        onCancel={() => console.log("Cancel")}
      /> */}
    </div>
  );
};

export default StockRender;
