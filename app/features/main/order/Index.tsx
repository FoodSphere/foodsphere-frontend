"use client";

// import { ConfirmModalComponent } from "@/app/components/featureComponents/ConfirmModalComponent";
// import { ConfirmTypeEnum } from "@/public/enum/confirmModalEnum";
// import { MenuStatusEnum } from "@/public/enum/menuStatusEnum";

import { OrderCardDisplay } from "./components/OrderCardDisplay";

const OrderRender = () => {
  return (

    <div className="w-full flex flex-col justify-center items-center">
      <div className="text-red-500">Order Hello World!!!</div>
      <OrderCardDisplay />
        {/* <ConfirmModalComponent
        confirmType={ConfirmTypeEnum.CancelOrder}
        itemName="Tomato"
        onConfirm={() => console.log("Confirm")}
        onCancel={() => console.log("Cancel")}
      /> */}
    </div>
  );
};

export default OrderRender;
