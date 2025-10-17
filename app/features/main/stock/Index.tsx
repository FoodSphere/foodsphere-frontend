"use client";

import { ItemCardComponent } from "@/app/components/featureComponents/ItemCardComponent";
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
  return (
    <div className="flex gap-10">
      <div className="text-red-500">Stock Hello World!!!</div>
      {/* Menus Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {stockItems.map((item) => (
          <ItemCardComponent
            key={item.id}
            imgUrl={item.imgUrl}
            title={item.title}
            amount={item.amount}
            unit={item.unit}
            onEdit={() => console.log("Edit Item")}
            onClose={() => console.log("Close Item")}
          />
        ))}
      </div>
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
