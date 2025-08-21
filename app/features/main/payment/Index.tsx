"use client";

import { ConfirmModalComponent } from "@/app/components/featureComponents/ConfirmModalComponent";
import { ConfirmTypeEnum } from "@/public/enum/confirmModalEnum";

const PaymentRender = () => {
  return (
    <div>
      <div className="text-red-500">Payment Hello World!!!</div>
      {/* <ConfirmModalComponent
        confirmType={ConfirmTypeEnum.CardPayment}
        onConfirm={() => console.log("Confirm")}
        onCancel={() => console.log("Cancel")}
        // qrUrl={
        //   "https://media-cdn.tripadvisor.com/media/photo-s/17/92/17/25/thai-qr-payment.jpg"
        // }
        total={856}
      /> */}
    </div>
  );
};

export default PaymentRender;
