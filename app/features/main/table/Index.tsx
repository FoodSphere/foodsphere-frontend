"use client";

import { ConfirmModalComponent } from "@/app/components/featureComponents/ConfirmModalComponent";
import { ItemTypeEnum } from "@/public/enum/itemTypeEnum";

const TableRender = () => {
  return (
    <div>
      <div className="text-red-500">Table Hello World!!!</div>
      {/* <ConfirmModalComponent
        title="Are you sure to add table?"
        onConfirm={() => console.log("Confirm")}
        onCancel={() => console.log("Cancel")}
      /> */}
    </div>
  );
};

export default TableRender;
