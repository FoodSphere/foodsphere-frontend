"use client";

import { Icons } from "@/app/icons";

export type HistoryAction = "New" | "Edited" | "Deleted";

export interface MenuHistoryItem {
  id: string;
  menuIdDisplay: string; // เช่น "Menu # 000121"
  title: string;
  imgUrl: string | null;
  action: HistoryAction;
  date: string;
  time: string;
}

interface MenuHistoryProps {
  historyItems: MenuHistoryItem[];
}

export const MenuHistory = ({ historyItems }: MenuHistoryProps) => {
  // Helper สำหรับสีของ Status (อิงตาม logic ของ Menu)
  const getStatusColor = (action: HistoryAction) => {
    switch (action) {
      case "New":
        return "text-[#6BCB77]"; // สีเขียว
      case "Edited":
        return "text-[#FFB347]"; // สีส้มอ่อน
      case "Deleted":
        return "text-[#FF6B6B]"; // สีแดง
      default:
        return "text-gray-500";
    }
  };

  return (
    // Main Container - ใช้สไตล์เดียวกับ StockHistory
    <div className="w-full xl:w-[400px] bg-[#E5E5E5] rounded-xl p-4 h-fit flex-shrink-0 shadow-sm">
      <h2 className="text-2xl font-bold text-black mb-4 px-1">Menu History</h2>

      {/* Scrollable List Container */}
      <div className="flex flex-col gap-3 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar pr-1">
        {historyItems.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-sm bg-white rounded-lg shadow-sm">
            No history available
          </div>
        ) : (
          historyItems.map((item) => (
            // Item Card: พื้นขาว พร้อมขีดเส้นใต้สีส้มหนา 3px ตามสไตล์ Stock
            <div
              key={item.id}
              className="bg-white relative overflow-hidden shadow-sm flex items-stretch min-h-[90px]"
              style={{ borderBottom: "3px solid #FF7043" }}
            >
              {/* Image Section (Left Side) */}
              <div className="w-[100px] flex-shrink-0 bg-gray-100 relative">
                {item.imgUrl ? (
                  <img
                    src={item.imgUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <Icons name="AddIcon" className="text-gray-300 w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Content Section (Right Side) */}
              <div className="flex-1 py-2 px-3 flex flex-col justify-between">
                {/* Top Row: Title & Menu ID */}
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-lg text-black leading-tight line-clamp-1 mr-2">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap mt-1">
                    {item.menuIdDisplay.includes("#")
                      ? item.menuIdDisplay
                      : `Menu # ${item.menuIdDisplay}`}
                  </span>
                </div>

                {/* Bottom Row: Status & Timestamp */}
                <div className="flex justify-between items-end mt-2">
                  <div className="flex flex-col leading-tight">
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`font-bold ${getStatusColor(item.action)}`}
                      >
                        {item.action}
                      </span>
                      <span className="text-gray-400 text-[11px]">
                        {item.date} {item.time}
                      </span>
                    </div>
                  </div>

                  {/* สำหรับ Menu History อาจจะไม่มีตัวเลขการเปลี่ยนแปลง 
                      แต่เราใส่ Icon เล็กๆ เพื่อให้ Balance ของ Card ดูเหมือน Stock ได้ครับ */}
                  <Icons
                    name="ArrowRightIcon"
                    className="w-3 h-3 text-gray-300 mb-1"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
