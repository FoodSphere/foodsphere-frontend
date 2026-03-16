import { useEffect, useState } from "react";

import { QrCode } from "@/app/components/featureComponents/QrCode";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Icons } from "@/app/icons";
import { getMenuById } from "@/services/menu/menuApi";
import { IBillResponse } from "@/types/billType";
import { EBillStatus } from "@/types/enum";

interface EnrichedOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: string;
  imgUrl: string | null;
}

interface TableBillDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  billData?: IBillResponse | null;
  qrUrl?: string;
  onCheckBill?: () => void;
  onCompleteBill?: () => void;
  onAddOrder?: () => void;
  onEditOrder?: () => void;
}

// 1. ฟังก์ชันช่วยแปลงตัวเลข Status เป็นข้อความ
const mapOrderStatus = (statusNum: number): string => {
  switch (statusNum) {
    case 1:
      return "Pending";
    case 2:
      return "Cooking";
    case 3:
      return "Completed";
    case 4:
      return "Canceled";
    default:
      return "Pending";
  }
};

// 2. ฟังก์ชันช่วยเลือกสีของ Badge ตามสถานะ
const getStatusColor = (status: string): string => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "Cooking":
      return "bg-blue-100 text-blue-700";
    case "Completed":
      return "bg-green-100 text-green-700";
    case "Canceled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const TableBillDrawer = ({
  isOpen,
  onClose,
  tableName,
  billData,
  qrUrl,
  onCheckBill,
  onCompleteBill,
  onAddOrder,
  onEditOrder,
}: TableBillDrawerProps) => {
  const [displayOrders, setDisplayOrders] = useState<EnrichedOrderItem[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  console.log(billData);

  useEffect(() => {
    const loadOrderDetails = async () => {
      if (!billData || !billData.orders || billData.orders.length === 0) {
        setDisplayOrders([]);
        return;
      }

      setIsLoadingOrders(true);

      try {
        const allItems = billData.orders.flatMap((order) => {
          return order.items.map((item) => ({
            ...item,
            unique_key: `${order.id}-${item.id}`,
            orderStatus: mapOrderStatus(order.status),
          }));
        });

        const enrichedItemsPromises = allItems.map(async (item) => {
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
            id: item.unique_key,
            name: menuName,
            price: item.price_snapshot,
            quantity: item.quantity,
            status: item.orderStatus,
            imgUrl: imgUrl,
          };
        });

        const resolvedItems = await Promise.all(enrichedItemsPromises);
        setDisplayOrders(resolvedItems);
      } catch (error) {
        console.error("Error loading order details:", error);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    if (isOpen) {
      loadOrderDetails();
    }
  }, [isOpen, billData]);

  if (!isOpen) return null;

  // คำนวณราคารวม (ไม่เอา Status "Canceled" มาคิดเงิน)
  const total = displayOrders.reduce((acc, item) => {
    if (item.status === "Canceled") return acc;
    return acc + item.price * item.quantity;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-[rgba(0,0,0,0.5)]">
      <div className="bg-[#E5E5E5] rounded-l-3xl w-[900px] h-full overflow-hidden shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-8 pt-8 pb-4 shrink-0">
          <div className="bg-primary-orange-main text-white px-8 py-3 rounded-xl text-2xl font-bold shadow-md">
            Table {tableName}
          </div>
          <button
            onClick={onClose}
            className="bg-primary-orange-main text-white p-3 rounded-full shadow-md hover:bg-[#ff451f] transition-colors"
          >
            <Icons name="ArrowRightIcon" className="w-6 h-6" />
          </button>
        </div>

        <div className="border-b border-gray-300 mx-8 mb-6 shrink-0"></div>

        <div className="flex gap-8 flex-1 overflow-hidden px-8 pb-8">
          {/* Left Column */}
          <div className="w-[320px] flex flex-col gap-6 shrink-0">
            {/* QR Section */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl font-medium text-black">
                QR{" "}
                <span className="text-primary-orange-main">
                  Table {tableName}
                </span>{" "}
                for Ordering
              </p>

              {/* เปลี่ยนจาก div จุดดำๆ มาใช้ QrCode Component */}
              <div className="bg-transparent p-2 min-h-[200px] flex items-center justify-center">
                {qrUrl ? (
                  <QrCode data={qrUrl} width={200} />
                ) : (
                  <div className="w-[200px] h-[200px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    No QR Code Data
                  </div>
                )}
              </div>

              <button className="bg-primary-orange-main hover:bg-[#ff451f] text-white px-10 py-3 rounded-xl font-bold text-lg shadow-md flex items-center gap-3 transition-colors">
                Print <Icons name="PrintIcon" className="w-6 h-6" />
              </button>
            </div>

            {/* Summary Section */}
            <div className="mt-auto">
              <h3 className="text-2xl font-bold mb-4 text-black">Summary</h3>
              <div className="space-y-2 text-lg bg-white p-4 rounded-xl shadow-sm">
                <div className="flex justify-between text-gray-500 font-medium text-sm mb-2 border-b border-gray-100 pb-2">
                  <span>Guests (Pax)</span>
                  <span>{billData?.pax || "-"} Persons</span>
                </div>

                <div className="flex justify-between text-2xl font-bold">
                  <span className="text-black">Total</span>
                  <span className="text-primary-orange-main">
                    {total.toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    Baht
                  </span>
                </div>
              </div>

              {billData?.status === EBillStatus.OPEN && (
                <button
                  onClick={onCheckBill}
                  disabled={displayOrders.length === 0}
                  className="w-full bg-primary-orange-main hover:bg-[#ff451f] disabled:bg-gray-400 text-white py-4 rounded-xl font-bold text-xl shadow-md mt-6 flex items-center justify-center gap-3 transition-colors"
                >
                  Check Bill <Icons name="OrderIcon" className="w-6 h-6" />
                </button>
              )}
              {billData?.status === EBillStatus.PAID && (
                <button
                  onClick={onCompleteBill}
                  disabled={displayOrders.length === 0}
                  className="w-full bg-primary-green-main hover:bg-[#22c55e] disabled:bg-gray-400 text-white py-4 rounded-xl font-bold text-xl shadow-md mt-6 flex items-center justify-center gap-3 transition-colors"
                >
                  Complete Bill <Icons name="OrderIcon" className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Order List */}
          <div className="flex-1 bg-white rounded-3xl p-6 flex flex-col shadow-sm h-full overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-black">Order</h2>
              {isLoadingOrders && (
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-orange-main border-t-transparent rounded-full animate-spin"></div>
                  Loading menus...
                </span>
              )}
            </div>

            <div className="flex-1 overflow-hidden relative">
              <ScrollArea className="h-full pr-4">
                {displayOrders.length === 0 && !isLoadingOrders ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4 mt-20">
                    <Icons name="OrderIcon" className="w-16 h-16 opacity-30" />
                    <p className="text-lg">No orders yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4 pb-4">
                    {displayOrders.map((order) => (
                      <div
                        key={order.id}
                        className={`flex gap-4 items-start border-b border-gray-100 pb-4 last:border-0 ${
                          order.status === "Canceled"
                            ? "opacity-50 grayscale"
                            : ""
                        }`}
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          {order.imgUrl ? (
                            <img
                              src={order.imgUrl}
                              alt={order.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gray-50">
                              No Img
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4
                              className={`font-bold text-lg text-black truncate pr-2 ${
                                order.status === "Canceled"
                                  ? "line-through"
                                  : ""
                              }`}
                            >
                              {order.name}
                            </h4>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide shrink-0 ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-end mt-2">
                            <span className="text-gray-500 font-medium">
                              {order.price.toLocaleString("th-TH")} Baht
                            </span>
                            <span className="text-black font-bold bg-gray-100 px-3 py-1 rounded-lg">
                              x {order.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {billData?.status === EBillStatus.OPEN && (
              <div className="mt-4 space-y-3 pt-4 border-t border-gray-100 shrink-0">
                <button
                  onClick={onAddOrder}
                  className="w-full bg-primary-orange-main hover:bg-[#ff451f] text-white py-3 rounded-xl font-bold text-lg shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Order <Icons name="PlusIcon" className="w-6 h-6" />
                </button>
                <button
                  disabled={displayOrders.length === 0}
                  onClick={onEditOrder}
                  className="w-full bg-white border border-primary-orange-main hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed text-primary-orange-main py-3 rounded-xl font-bold text-lg shadow-md flex items-center justify-center gap-2 transition-colors"
                >
                  Edit Order <Icons name="EditIcon" className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
