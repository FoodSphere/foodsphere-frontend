import { useEffect, useState } from "react";

import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Icons } from "@/app/icons";
import { getMenuById } from "@/services/menu/menuApi";
import { IBillResponse } from "@/types/billType";

interface EnrichedOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: "Completed" | "Pending";
  imgUrl: string | null;
}

interface TableBillDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  billData?: IBillResponse | null; // เพิ่ม Prop สำหรับรับข้อมูล Bill จริง
  onCheckBill?: () => void;
  onAddOrder?: () => void;
  onEditOrder?: () => void;
}

export const TableBillDrawer = ({
  isOpen,
  onClose,
  tableName,
  billData,
  onCheckBill,
  onAddOrder,
  onEditOrder,
}: TableBillDrawerProps) => {
  // State สำหรับเก็บข้อมูลที่พร้อมแสดงผล
  const [displayOrders, setDisplayOrders] = useState<EnrichedOrderItem[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    // ฟังก์ชันสำหรับแปลงข้อมูล billData เป็นข้อมูลพร้อมแสดงผล
    const loadOrderDetails = async () => {
      if (!billData || !billData.orders || billData.orders.length === 0) {
        setDisplayOrders([]);
        return;
      }

      setIsLoadingOrders(true);

      try {
        // 1. ดึง items ทั้งหมดที่อยู่ใน orders ของบิลนี้ออกมากองรวมกัน
        const allItems = billData.orders.flatMap((order) => {
          return order.items.map((item) => ({
            ...item,
            // เพิ่มบรรทัดนี้: สร้าง Key ใหม่โดยเอา Order ID มาต่อกับ Item ID
            unique_key: `${order.id}-${item.id}`,
            orderStatus: order.status === 0 ? "Pending" : "Completed",
          }));
        });

        // 2. วนลูปยิง API ไปขอชื่อเมนูและรูปภาพของแต่ละ item
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
            id: item.unique_key, // <--- เปลี่ยนมาใช้ unique_key ที่เราสร้างไว้แทน
            name: menuName,
            price: item.price_snapshot,
            quantity: item.quantity,
            status: item.orderStatus as "Pending" | "Completed",
            imgUrl: imgUrl,
          };
        });

        // รอจนกว่าจะดึงข้อมูลเมนูครบทุกอัน
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

  // คำนวณราคารวมทั้งหมดจาก quantity * price_snapshot
  const total = displayOrders.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
            {/* QR Section (Mockup) */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl font-medium text-black">
                QR{" "}
                <span className="text-primary-orange-main">
                  Table {tableName}
                </span>{" "}
                for Ordering
              </p>
              <div className="bg-transparent p-2">
                <div className="w-[200px] h-[200px] bg-black p-2 rounded-lg">
                  <div className="w-full h-full bg-white flex flex-wrap content-center justify-center gap-1 p-2">
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 ${Math.random() > 0.4 ? "bg-black" : "bg-white"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <button className="bg-primary-orange-main hover:bg-[#ff451f] text-white px-10 py-3 rounded-xl font-bold text-lg shadow-md flex items-center gap-3 transition-colors">
                Print <Icons name="PrintIcon" className="w-6 h-6" />
              </button>
            </div>

            {/* Summary Section (อัปเดตเอา Vat กับ Discount ออก) */}
            <div className="mt-auto">
              <h3 className="text-2xl font-bold mb-4 text-black">Summary</h3>
              <div className="space-y-2 text-lg bg-white p-4 rounded-xl shadow-sm">
                {/* แสดงจำนวนลูกค้าด้วยถ้ามี */}
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

              <button
                onClick={onCheckBill}
                disabled={displayOrders.length === 0}
                className="w-full bg-primary-orange-main hover:bg-[#ff451f] disabled:bg-gray-400 text-white py-4 rounded-xl font-bold text-xl shadow-md mt-6 flex items-center justify-center gap-3 transition-colors"
              >
                Check Bill <Icons name="OrderIcon" className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Right Column - Order List */}
          <div className="flex-1 bg-white rounded-3xl p-6 flex flex-col shadow-sm h-full overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-black">Order</h2>
              {isLoadingOrders && (
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#FF5C39] border-t-transparent rounded-full animate-spin"></div>
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
                        className="flex gap-4 items-start border-b border-gray-100 pb-4 last:border-0"
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
                            <h4 className="font-bold text-lg text-black truncate pr-2">
                              {order.name}
                            </h4>
                            <span
                              className={`text-white text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide shrink-0 ${
                                order.status === "Completed"
                                  ? "bg-[#4ADE80]"
                                  : "bg-orange-400"
                              }`}
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

            <div className="mt-4 space-y-3 pt-4 border-t border-gray-100 shrink-0">
              <button
                onClick={onAddOrder}
                className="w-full bg-primary-orange-main hover:bg-[#ff451f] text-white py-3 rounded-xl font-bold text-lg shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                Add Order <Icons name="PlusIcon" className="w-6 h-6" />
              </button>
              <button
                onClick={onEditOrder}
                disabled={displayOrders.length === 0}
                className="w-full bg-white border border-primary-orange-main hover:bg-orange-50 disabled:bg-gray-300 text-primary-orange-main py-3 rounded-xl font-bold text-lg shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                Edit Order <Icons name="EditIcon" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
