import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { Icons } from "@/app/icons";
import { ConfirmTypeEnum } from "@/public/enum/confirmModalEnum";
import { MenuStatusEnum } from "@/public/enum/menuStatusEnum";

interface ConfirmModalComponentProps {
  id?: string | null | undefined,
  confirmType: ConfirmTypeEnum;
  itemName?: string | null;
  onConfirm?: (id: string | null | undefined) => void;
  onCancel?: () => void;
  guests?: number;
  onMinus?: () => void;
  onPlus?: () => void;
  total?: number;
  qrUrl?: string | null;
  oldStatus?: MenuStatusEnum | null;
  newStatus?: MenuStatusEnum | null;
}

export const ConfirmModalComponent = ({
  id,
  confirmType,
  itemName = null,
  onConfirm,
  onCancel,
  guests = 0,
  onMinus,
  onPlus,
  total = 0,
  qrUrl = null,
  oldStatus = null,
  newStatus = null,
}: ConfirmModalComponentProps) => {
  const [pay, setPay] = useState("");
  const [change, setChange] = useState("");

  function isPayGreaterThanTotal(pay: string, total: number) {
    if (pay && total) {
      const num = parseFloat(pay);
      if (!isNaN(num)) {
        console.log(num >= total)
        return num >= total;
      }
    }
    return false;
  }

  const handlePayBlur = () => {
    if (pay && total) {
      const isPayGreater = isPayGreaterThanTotal(pay, total);

      if (isPayGreater) {
        const diff = parseFloat(pay) - total;
        setChange(diff.toFixed(2));
      } else {
        console.log("Pay must be greater than total! Please try again.");
        setChange("");
      }
    }
  };

  return (
    <div className="min-w-full min-h-full fixed top-0 left-0 flex flex-col justify-center items-center bg-[rgba(0,0,0,0.8)] z-[9999]">
      <div
        className={`bg-white rounded-t-2xl text-center ${
          [ConfirmTypeEnum.QRPayment].includes(
            confirmType
          )
            ? "w-[600px]"
            : "w-[450px]"
        }`}
      >
        <div className="text-black font-bold text-2xl m-5">
          {[
            ConfirmTypeEnum.AddMenu,
            ConfirmTypeEnum.EditMenu,
            ConfirmTypeEnum.CloseMenu,
            ConfirmTypeEnum.DeleteMenu,
            ConfirmTypeEnum.AddStock,
            ConfirmTypeEnum.EditStock,
            ConfirmTypeEnum.CloseStock,
            ConfirmTypeEnum.DeleteStock,
            ConfirmTypeEnum.UpdateOrder,
            ConfirmTypeEnum.CancelOrder,
          ].includes(confirmType) && <p>Confirmation</p>}
          {[ConfirmTypeEnum.AddTable].includes(confirmType) && (
            <p>Are you sure to add table?</p>
          )}
          {[ConfirmTypeEnum.DeleteTable].includes(confirmType) && (
            <p>Are you sure to delete table?</p>
          )}
          {[ConfirmTypeEnum.OpenBill].includes(confirmType) && itemName && (
            <div className="flex justify-center items-center gap-x-3">
              <p>Open Bill</p>
              <div className="text-white bg-primary-orange-main py-2 px-6 rounded-md">
                {itemName}
              </div>
            </div>
          )}
          {[ConfirmTypeEnum.CashPayment].includes(confirmType) && (
            <p>Cash payment confirmation</p>
          )}
          {[ConfirmTypeEnum.QRPayment].includes(confirmType) && (
            <p>QR payment confirmation</p>
          )}
          {[ConfirmTypeEnum.PaymentSuccess].includes(confirmType) && (
            <p>Payment Successfully!</p>
          )}
        </div>
      </div>
      <hr className="border-t border-gray-300"></hr>
      <div
        className={`bg-white rounded-b-2xl text-center ${
          [ConfirmTypeEnum.QRPayment].includes(
            confirmType
          )
            ? "w-[600px]"
            : "w-[450px]"
        }`}
      >
        <div className="text-black flex justify-center mt-8 mb-6">
          {[ConfirmTypeEnum.AddMenu, ConfirmTypeEnum.AddStock].includes(
            confirmType
          ) &&
            itemName && (
              <p>
                Add{" "}
                <span className="text-primary-orange-main underline">
                  {itemName}
                </span>{" "}
                to restaurant{" "}
                {[ConfirmTypeEnum.AddMenu].includes(confirmType)
                  ? "menu list"
                  : "stock list"}{" "}
                list
              </p>
            )}
          {[ConfirmTypeEnum.EditMenu, ConfirmTypeEnum.EditStock].includes(
            confirmType
          ) &&
            itemName && (
              <p>
                Edit{" "}
                <span className="text-primary-orange-main underline">
                  {itemName}
                </span>{" "}
                in restaurant{" "}
                {[ConfirmTypeEnum.EditMenu].includes(confirmType)
                  ? "menu"
                  : "stock"}{" "}
                list
              </p>
            )}
          {[ConfirmTypeEnum.CloseMenu, ConfirmTypeEnum.CloseStock].includes(
            confirmType
          ) &&
            itemName && (
              <p>
                Close{" "}
                <span className="text-primary-orange-main underline">
                  {itemName}
                </span>{" "}
                in restaurant{" "}
                {[ConfirmTypeEnum.CloseMenu].includes(confirmType)
                  ? "menu"
                  : "stock"}{" "}
                list
              </p>
            )}
          {[ConfirmTypeEnum.DeleteMenu, ConfirmTypeEnum.DeleteStock].includes(
            confirmType
          ) &&
            itemName && (
              <p>
                Delete{" "}
                <span className="text-primary-orange-main underline">
                  {itemName}
                </span>{" "}
                to restaurant{" "}
                {[ConfirmTypeEnum.DeleteMenu].includes(confirmType)
                  ? "menu"
                  : "stock"}{" "}
                list
              </p>
            )}
          {[ConfirmTypeEnum.OpenBill].includes(confirmType) &&
            onMinus &&
            onPlus && (
              <div>
                <p>Guests</p>
                <div className="flex justify-center items-center gap-8">
                  <button
                    onClick={onMinus}
                    className="cursor-pointer flex justify-center items-center bg-primary-orange-main border-2 border-primary-orange-main font-semibold h-10 w-10 rounded-full shadow transition"
                  >
                    <Icons name="MinusIcon" className="text-white w-[20px]" />
                  </button>
                  <div className="bg-primary-gray-main text-5xl rounded-2xl py-4 px-5">
                    {guests}
                  </div>
                  <button
                    onClick={onPlus}
                    className="cursor-pointer flex justify-center items-center bg-primary-orange-main border-2 border-primary-orange-main font-semibold h-10 w-10 rounded-full shadow transition"
                  >
                    <Icons name="PlusIcon" className="text-white w-[20px]" />
                  </button>
                </div>
              </div>
            )}
          {[ConfirmTypeEnum.CashPayment].includes(confirmType) && total && (
            <div className="space-y-6 w-full max-w-xs">
              <div className="flex items-center justify-between">
                <span className="text-lg">Pay</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={pay}
                    onChange={(e) => setPay(e.target.value)}
                    onBlur={handlePayBlur}
                    className="w-35 text-right border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-orange-main"
                    placeholder="0.00"
                    step="0.01"
                  />
                  <span className="text-gray-600">B.</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg">Total</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-medium">856.00</span>
                  <span className="text-gray-600">B.</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Change</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary-orange-main">
                    {change ? change : "-"}
                  </span>
                  <span className="text-gray-600 font-bold">B.</span>
                </div>
              </div>
            </div>
          )}
          {[ConfirmTypeEnum.QRPayment].includes(confirmType) &&
            qrUrl &&
            total && (
              <div className="w-fit border border-gray-400 rounded-xl">
                <img
                  src={qrUrl}
                  alt="QR code for payment"
                  className="rounded-xl"
                />
                <div className="flex justify-around items-baseline mb-5">
                  <p className="text-2xl font-semibold">Total</p>
                  <p className="text-lg">
                    <span className="text-primary-orange-main font-semibold">
                      {total.toFixed(2)}
                    </span>{" "}
                    B.
                  </p>
                </div>
              </div>
            )}
          {[ConfirmTypeEnum.UpdateOrder].includes(confirmType) &&
            oldStatus &&
            newStatus &&
            itemName && (
              <div>
                <p className="mb-3">
                  Update status order{" "}
                  <span className="text-primary-orange-main underline">
                    {itemName}
                  </span>
                </p>
                <p>
                  {" "}
                  From{" "}
                  <span className="text-primary-orange-main underline">
                    {oldStatus}
                  </span>{" "}
                  to{" "}
                  <span className="text-primary-orange-main underline">
                    {newStatus}
                  </span>
                </p>
              </div>
            )}
          {[ConfirmTypeEnum.CancelOrder].includes(confirmType) && itemName && (
            <p>
              Cancel order{" "}
              <span className="text-primary-orange-main underline">
                {itemName}
              </span>
            </p>
          )}
        </div>
        <div className="flex gap-8 justify-center mb-8">
          {onConfirm && (
            <button
              disabled={(confirmType === ConfirmTypeEnum.OpenBill && guests === 0) || (confirmType === ConfirmTypeEnum.CashPayment && !isPayGreaterThanTotal(pay, total))}
              onClick={() => onConfirm(id)}
              className="cursor-pointer flex items-center gap-2 bg-primary-orange-main hover:bg-orange-600 disabled:opacity-40 text-white font-semibold px-4 py-3 rounded-lg shadow transition border-2 border-orange-500"
            >
              <Icons name="CheckIcon" className="text-white w-[20px]" />
              Confirm
            </button>
          )}
          {onCancel &&
            ![ConfirmTypeEnum.PaymentSuccess].includes(confirmType) && (
              <button
                onClick={onCancel}
                className="cursor-pointer flex items-center gap-2 bg-white text-primary-orange-main border-2 border-primary-orange-main hover:bg-orange-50 font-semibold px-4 py-3 rounded-lg shadow transition"
              >
                <Icons
                  name="CloseIcon"
                  className="text-primary-orange-main w-[20px]"
                />
                Cancel
              </button>
            )}
        </div>
      </div>
    </div>
  );
};
