import { useEffect, useState } from "react";

import { Icons } from "@/app/icons";
import { getMenuById } from "@/services/menu/menuApi";
import { getOrdersByBillId } from "@/services/order/orderApi";
import { getTableById } from "@/services/table/tableApi";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imgUrl: string | null;
}

interface TableBillPaymentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
  billId?: string;
  onCashPayment: (totalAmount: number, tableName: string) => void;
  onQRPayment: (totalAmount: number, tableName: string) => void;
}

export const TableBillPaymentDrawer = ({
  isOpen,
  onClose,
  tableId,
  billId,
  onCashPayment,
  onQRPayment,
}: TableBillPaymentDrawerProps) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tableName, setTableName] = useState<string>("Loading...");

  // 1. ดึงข้อมูลชื่อโต๊ะ
  useEffect(() => {
    const fetchTableName = async () => {
      if (!isOpen || !tableId) return;
      try {
        const tableRes = await getTableById(tableId);
        if (tableRes && tableRes.data) {
          setTableName(tableRes.data.name);
        } else {
          setTableName(`ID: ${tableId}`); // Fallback
        }
      } catch (error) {
        console.error("Error fetching table name:", error);
        setTableName(`ID: ${tableId}`);
      }
    };
    fetchTableName();
  }, [isOpen, tableId]);

  // 2. ดึงข้อมูลออเดอร์
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!isOpen || !billId) {
        setOrderItems([]);
        return;
      }

      setIsLoading(true);
      try {
        const ordersRes = await getOrdersByBillId(billId, "?status=2&status=3");

        if (ordersRes && ordersRes.data && Array.isArray(ordersRes.data)) {
          const allItems = ordersRes.data.flatMap((order: any) => order.items);

          const enrichedItemsPromises = allItems.map(async (item: any) => {
            let menuName = "Unknown Menu";
            let imgUrl = null;

            try {
              const menuRes = await getMenuById(item.menu_id);
              if (menuRes && menuRes.data) {
                menuName = menuRes.data.name;
                imgUrl = menuRes.data.image_url;
              }
            } catch (error) {
              console.error(`Failed to fetch menu ID ${item.menu_id}`, error);
            }

            return {
              id: `${item.order_id}-${item.id}`,
              name: menuName,
              price: item.price_snapshot,
              quantity: item.quantity,
              imgUrl: imgUrl,
            };
          });

          const resolvedItems = await Promise.all(enrichedItemsPromises);
          setOrderItems(resolvedItems);
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [isOpen, billId]);

  if (!isOpen) return null;

  const total = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalItemsCount = orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-end bg-black/60 transition-opacity">
      <div className="bg-[#F8F9FA] rounded-l-[40px] w-full max-w-[1000px] h-full overflow-hidden shadow-2xl flex flex-col md:flex-row relative transform transition-transform animate-in slide-in-from-right duration-300">
        {/* --- Left Column: Order Summary --- */}
        <div className="w-full md:w-[60%] bg-white p-8 md:p-10 flex flex-col h-full z-10 shadow-[8px_0_30px_rgba(0,0,0,0.03)] relative">
          {/* Back Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors w-fit mb-8 group"
          >
            <div className="bg-gray-100 p-2 rounded-full group-hover:bg-gray-200 transition-colors">
              <Icons name="ArrowLeftIcon" className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm">Back to Table</span>
          </button>

          {/* Header Section */}
          <div className="mb-6">
            <div className="inline-block bg-primary-orange-main text-white px-4 py-2 rounded-2xl text-2xl font-bold uppercase tracking-widest mb-4">
              Table {tableName}
            </div>

            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Order Summary
              </h2>
              <span className="text-sm font-bold text-primary-orange-main bg-orange-50 px-3 py-1 rounded-lg">
                {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"}
              </span>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-gray-200 to-transparent mb-6"></div>

          {/* Scrollable Order List (Native CSS Scrollbar) */}
          <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-4 pb-10 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <div className="w-8 h-8 border-4 border-primary-orange-main border-t-transparent rounded-full animate-spin"></div>
                <p className="font-medium tracking-wide">Loading items...</p>
              </div>
            ) : orderItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                <div className="p-4 bg-gray-50 rounded-full">
                  <Icons name="OrderIcon" className="w-10 h-10 opacity-40" />
                </div>
                <p className="font-medium text-lg">No orders to pay.</p>
              </div>
            ) : (
              orderItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex h-[100px] group"
                >
                  <div className="w-[100px] bg-gray-50 shrink-0 relative">
                    {item.imgUrl ? (
                      <img
                        src={item.imgUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                        <Icons
                          name="EditIcon"
                          className="w-6 h-6 mb-1 opacity-50"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2">
                        {item.name}
                      </h3>
                      <div className="bg-gray-100 text-gray-700 font-bold px-2.5 py-0.5 rounded-md text-sm shrink-0">
                        x{item.quantity}
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                        Price
                      </p>
                      <p className="text-primary-orange-main font-black text-lg">
                        ฿{(item.price * item.quantity).toLocaleString("th-TH")}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- Right Column: Receipt Summary --- */}
        <div className="w-full md:w-[40%] p-8 md:p-10 flex flex-col h-full justify-between bg-[#F8F9FA]">
          <div className="mt-8 md:mt-24">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 tracking-tight">
              Payment Details
            </h2>

            {/* Total Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-10 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-50 rounded-full opacity-50"></div>
              <div className="absolute right-12 -top-2 w-10 h-10 bg-orange-100 rounded-full opacity-30"></div>

              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 relative z-10">
                Amount to Pay
              </p>
              <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-2xl font-bold text-primary-orange-main">
                  ฿
                </span>
                <span className="text-[40px] font-black text-primary-orange-main leading-none tracking-tighter">
                  {total.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => onCashPayment(total, tableName)}
                disabled={isLoading || orderItems.length === 0}
                className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed text-white h-16 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-between px-6 group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-colors">
                    <Icons name="BahtIcon" className="w-5 h-5 text-white" />
                  </div>
                  <span>Pay with Cash</span>
                </div>
                <Icons
                  name="ArrowRightIcon"
                  className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                />
              </button>

              <button
                onClick={() => onQRPayment(total, tableName)}
                disabled={isLoading || orderItems.length === 0}
                className="w-full bg-[#003D6B] hover:bg-[#002f52] disabled:bg-gray-300 disabled:cursor-not-allowed text-white h-16 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-between px-6 group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-1.5 rounded-xl group-hover:bg-white/30 transition-colors">
                    <Icons name="ThaiQRIcon" className="w-7 h-7 fill-white" />
                  </div>
                  <span>Thai QR PromptPay</span>
                </div>
                <Icons
                  name="ArrowRightIcon"
                  className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                />
              </button>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-8">
            <button
              onClick={onClose}
              className="w-full text-center text-gray-400 font-semibold hover:text-gray-800 transition-colors py-4 rounded-xl hover:bg-gray-200/50"
            >
              Cancel Payment Process
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
