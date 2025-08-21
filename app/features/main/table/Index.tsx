"use client";

import { ConfirmModalComponent } from "@/app/components/featureComponents/ConfirmModalComponent";
import { ConfirmTypeEnum } from "@/public/enum/confirmModalEnum";

const TableRender = () => {
  return (
    <div>
      <div className="text-red-500">Table Hello World!!!</div>
      {/* <ConfirmModalComponent
        confirmType={ConfirmTypeEnum.OpenBill}
        itemName={"Table 1"}
        onConfirm={() => console.log("Confirm")}
        onCancel={() => console.log("Cancel")}
        guests={4}
        onMinus={() => console.log("Minus")}
        onPlus={() => console.log("Plus")}
      /> */}
    </div>
  );
};

export default TableRender;
