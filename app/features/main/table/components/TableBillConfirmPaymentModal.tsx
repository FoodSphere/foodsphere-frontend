"use client";

import { useEffect, useState } from "react";

import { Icons } from "@/app/icons";

export type PaymentMethod = "cash" | "qr";

interface TableBillConfirmPaymentModalProps {
  isOpen: boolean;
  method: PaymentMethod;
  totalAmount: number;
  tableName: string;
  billId?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const TableBillConfirmPaymentModal = ({
  isOpen,
  method,
  totalAmount,
  tableName,
  billId,
  onClose,
  onConfirm,
}: TableBillConfirmPaymentModalProps) => {
  const [cashReceived, setCashReceived] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // คำนวณเงินทอน
  const cashAmount = parseFloat(cashReceived) || 0;
  const change = cashAmount >= totalAmount ? cashAmount - totalAmount : 0;
  // เช็คว่ากรอกเงินสดครบหรือยัง (เฉพาะโหมดเงินสด)
  const isCashValid = method === "cash" ? cashAmount >= totalAmount : true;

  // เคลียร์ฟอร์มเมื่อ Modal ถูกเปิดใหม่
  useEffect(() => {
    if (isOpen) {
      setCashReceived("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!isCashValid) return;

    setIsSubmitting(true);

    // โหมดเงินสด (Cash) - TODO: ยิง API เพื่อบันทึก transaction
    if (method === "cash") {
      console.log("Confirming Cash Payment:", {
        billId,
        tableName,
        totalAmount,
        cashReceived: cashAmount,
        change,
      });
      // await saveTransactionAPI(...);
      onConfirm();
    }

    // โหมด QR (Stripe) - เพื่อนในทีมจะนำตัวแปรไปจัดการต่อ
    if (method === "qr") {
      console.log("Proceeding to Stripe QR Payment with:", {
        billId,
        tableName,
        totalAmount,
      });
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-[480px] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div
          className={`p-8 text-center text-white ${method === "cash" ? "bg-gray-900" : "bg-[#003D6B]"}`}
        >
          <div className="inline-flex p-3 bg-white/20 rounded-full mb-4">
            {method === "cash" ? (
              <Icons name="BahtIcon" className="w-8 h-8 text-white" />
            ) : (
              <Icons name="ThaiQRIcon" className="w-8 h-8 fill-white" />
            )}
          </div>
          <h2 className="text-3xl font-extrabold mb-1">
            {method === "cash" ? "Cash Payment" : "QR PromptPay"}
          </h2>
          <p className="text-white/80 font-medium tracking-wide uppercase text-sm">
            Table {tableName}
          </p>
        </div>

        <div className="p-8 flex flex-col gap-6">
          {/* Amount to Pay */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
              Amount to Pay
            </p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-bold text-primary-orange-main">
                ฿
              </span>
              <span className="text-[40px] font-black text-primary-orange-main leading-none">
                {totalAmount.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {/* Cash Input Section */}
          {method === "cash" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Cash Received
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">
                    ฿
                  </span>
                  <input
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-14 pl-10 pr-4 rounded-xl border border-gray-200 bg-white focus:border-primary-orange-main focus:ring-4 focus:ring-orange-50 transition-all outline-none text-gray-900 font-bold text-xl"
                    autoFocus
                  />
                </div>
              </div>

              {/* Change (เงินทอน) */}
              <div className="flex justify-between items-center px-4 py-3 bg-green-50 border border-green-100 rounded-xl">
                <span className="text-sm font-bold text-green-700 uppercase">
                  Change
                </span>
                <span className="text-xl font-black text-green-700">
                  ฿
                  {change.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}

          {/* QR Code Message */}
          {method === "qr" && (
            <div className="text-center py-2 px-4">
              <p className="text-gray-600 font-medium">
                You will be redirected to the Stripe payment gateway to complete
                this transaction.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 pb-8 flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            disabled={isSubmitting || !isCashValid}
            className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]
              ${
                !isCashValid
                  ? "bg-gray-300 cursor-not-allowed shadow-none"
                  : method === "cash"
                    ? "bg-primary-orange-main hover:bg-orange-600 shadow-orange-500/30"
                    : "bg-[#003D6B] hover:bg-[#002f52] shadow-blue-900/30"
              }`}
          >
            {isSubmitting ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <Icons name="CheckIcon" className="w-6 h-6" />
                Confirm Payment
              </>
            )}
          </button>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full bg-white text-gray-500 font-semibold hover:bg-gray-50 py-3 rounded-xl transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
