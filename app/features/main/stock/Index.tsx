"use client";

import { ConfirmTypeEnum } from "@/public/enum/confirmModalEnum";

import { ConfirmModalComponent } from "@/app/components/featureComponents/ConfirmModalComponent";
import { ItemCardComponent } from "@/app/components/featureComponents/ItemCardComponent";

const StockRender = () => {
  return (
    <div className="flex gap-10">
      <div className="text-red-500">Stock Hello World!!!</div>
      <ItemCardComponent
        title="Chicken Breast"
        amount={10}
        unit="pcs."
        onEdit={() => console.log("Edit Item")}
        onClose={() => console.log("Close Item")}
      />
      <ItemCardComponent
        imgUrl="https://www.everydaycheapskate.com/wp-content/uploads/20250407-how-to-cook-boneless-skinless-chicken-breast-on-a-cutting-board-with-thyme-garlic-and-red-peppercorns.png"
        title="Chicken Breast"
        amount={10}
        unit="pcs."
        onEdit={() => console.log("Edit Item")}
        onClose={() => console.log("Close Item")}
      />
      <ItemCardComponent
        imgUrl="https://www.everydaycheapskate.com/wp-content/uploads/20250407-how-to-cook-boneless-skinless-chicken-breast-on-a-cutting-board-with-thyme-garlic-and-red-peppercorns.png"
        title="Chicken Breast"
        amount={10}
        unit="pcs."
        onEdit={() => console.log("Edit Item")}
        onClose={() => console.log("Close Item")}
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
