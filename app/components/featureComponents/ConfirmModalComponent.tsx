import { Icons } from "@/app/icons";
import { ConfirmTypeEnum } from "@/public/enum/confirmModalEnum";
import { MenuStatusEnum } from "@/public/enum/menuStatusEnum";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface ConfirmModalComponentProps {
  confirmType: ConfirmTypeEnum;
  itemName?: string | null;
  onConfirm?: () => void;
  onCancel?: () => void;
  guests?: number | null;
  onMinus?: () => void;
  onPlus?: () => void;
  total?: number | null;
  qrUrl?: string | null;
  oldStatus?: MenuStatusEnum | null;
  newStatus?: MenuStatusEnum | null;
}

export const ConfirmModalComponent = ({
  confirmType,
  itemName = null,
  onConfirm,
  onCancel,
  guests = null,
  onMinus,
  onPlus,
  total = null,
  qrUrl = null,
  oldStatus = null,
  newStatus = null,
}: ConfirmModalComponentProps) => {
  const [pay, setPay] = useState("");
  const [change, setChange] = useState("");
  const [canConfirm, setCanConfirm] = useState(
    [
      ConfirmTypeEnum.AddMenu,
      ConfirmTypeEnum.EditMenu,
      ConfirmTypeEnum.CloseMenu,
      ConfirmTypeEnum.DeleteMenu,
      ConfirmTypeEnum.AddStock,
      ConfirmTypeEnum.EditStock,
      ConfirmTypeEnum.CloseStock,
      ConfirmTypeEnum.DeleteStock,
      ConfirmTypeEnum.QRPayment,
      ConfirmTypeEnum.UpdateOrder,
      ConfirmTypeEnum.CancelOrder,
    ].includes(confirmType)
      ? true
      : false
  );

  const [fullName, setFullName] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiration, setCardExpiration] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");

  const handlePayBlur = () => {
    if (pay && total) {
      const num = parseFloat(pay);
      if (!isNaN(num)) {
        setPay(num.toFixed(2));

        const diff = num - total;

        if (diff >= 0) {
          setChange(diff.toFixed(2));
          setCanConfirm(true);
        } else {
          console.log("Pay must be greater than total! Please try again.");
          setChange("");
          setCanConfirm(false);
        }
      }
    }
  };

  const handleCardPaymentFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", {
      fullName,
      cardNumber,
      cardExpiration,
      cvv,
    });
  };

  const handleCardPaymentNumberBlur = () => {
    if (cardNumber) {
      const cleanValue = cardNumber.replace(/\D/g, "");
      let formattedValue = "";

      for (let i = 0; i < cleanValue.length; i++) {
        if (i > 0 && i % 4 === 0) {
          formattedValue += "-";
        }
        formattedValue += cleanValue[i];
      }

      setCardNumber(formattedValue);
    }
  };

  useEffect(() => {
    const validFullName = fullName.trim() !== "";
    const validCardNumber = cardNumber.replace(/-/g, "").length === 16;
    const validCvv = cvv.length === 3;

    setCanConfirm(
      [ConfirmTypeEnum.CardPayment].includes(confirmType)
        ? validFullName && validCardNumber && validCvv
        : true
    );
  }, [fullName, cardNumber, cvv]);

  return (
    <div className="min-w-full min-h-full fixed top-0 left-0 flex flex-col justify-center items-center bg-[rgba(0,0,0,0.8)]">
      <div
        className={`bg-white rounded-t-2xl text-center ${
          [ConfirmTypeEnum.QRPayment, ConfirmTypeEnum.CardPayment].includes(
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
          {[ConfirmTypeEnum.CardPayment].includes(confirmType) && (
            <p>Credit/Debit card payment confirmation</p>
          )}
          {[ConfirmTypeEnum.PaymentSuccess].includes(confirmType) && (
            <p>Payment Successfully!</p>
          )}
        </div>
      </div>
      <hr className="border-t border-gray-300"></hr>
      <div
        className={`bg-white rounded-b-2xl text-center ${
          [ConfirmTypeEnum.QRPayment, ConfirmTypeEnum.CardPayment].includes(
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
                to restaurant's{" "}
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
                in restaurant's{" "}
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
                in restaurant's{" "}
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
                to restaurant's{" "}
                {[ConfirmTypeEnum.DeleteMenu].includes(confirmType)
                  ? "menu"
                  : "stock"}{" "}
                list
              </p>
            )}
          {[ConfirmTypeEnum.OpenBill].includes(confirmType) &&
            guests &&
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
          {[ConfirmTypeEnum.CardPayment].includes(confirmType) && total && (
            <form
              onSubmit={handleCardPaymentFormSubmit}
              className="space-y-6 mx-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <span className="flex items-center">
                      Full name<span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={fullName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFullName(e.target.value)
                    }
                    placeholder="Bonnie Green"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <span className="flex items-center">
                      Card number<span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    onBlur={handleCardPaymentNumberBlur}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    required
                    maxLength={16}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="cardExpiration"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <span className="flex items-center">
                      Card expirations<span className="text-red-500">*</span>
                    </span>
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="month"
                      id="cardExpiration"
                      name="cardExpiration"
                      value={cardExpiration}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setCardExpiration(e.target.value)
                      }
                      placeholder="MM"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <span className="flex items-center">
                      CVV<span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="password"
                    id="cvv"
                    name="cvv"
                    value={cvv}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setCvv(e.target.value)
                    }
                    placeholder="•••"
                    required
                    maxLength={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  />
                </div>
              </div>
              <div className="flex justify-around items-baseline mb-5">
                <p className="text-2xl font-semibold">Total</p>
                <p className="text-lg">
                  <span className="text-primary-orange-main font-semibold">
                    {total.toFixed(2)}
                  </span>{" "}
                  B.
                </p>
              </div>
            </form>
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
              disabled={!canConfirm}
              onClick={onConfirm}
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
