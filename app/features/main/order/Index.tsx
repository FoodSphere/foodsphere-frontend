"use client";

// import { ConfirmModalComponent } from "@/app/components/featureComponents/ConfirmModalComponent";
// import { ConfirmTypeEnum } from "@/public/enum/confirmModalEnum";
// import { MenuStatusEnum } from "@/public/enum/menuStatusEnum";

import { OrderCardDisplay } from "./components/OrderCardDisplay";

const OrderRender = () => {
  return (
    <div className="w-screen flex flex-col justify-center px-10">
      <div className="text-4xl text-black font-bold">Order</div>
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
