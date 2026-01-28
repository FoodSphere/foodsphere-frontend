import { Icons } from "@/app/icons";

export interface StockHistoryItem {
  id: string;
  itemCode: string;
  imgUrl: string | null;
  title: string;
  action: "Added" | "Consumed" | "Edited";
  date: string;
  time: string;
  amountChange: number;
  unit: string;
}

interface StockHistoryProps {
  historyItems: StockHistoryItem[];
}

export const StockHistory = ({ historyItems }: StockHistoryProps) => {
  // Helper สำหรับสีของ Action Text
  const getActionColor = (action: string) => {
    switch (action) {
      case "Added":
        return "text-[#4CAF50]"; // สีเขียวสด
      case "Consumed":
        return "text-[#FF5252]"; // สีแดงอมชมพู
      case "Edited":
        return "text-[#FFB74D]"; // สีส้มเหลือง
      default:
        return "text-gray-500";
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "Added":
        return "Added";
      case "Consumed":
        return "Consumed";
      case "Edited":
        return "Edited";
      default:
        return action;
    }
  };

  return (
    // Main Container
    <div className="w-full xl:w-[400px] bg-[#E5E5E5] rounded-xl p-4 h-fit flex-shrink-0 shadow-sm">
      <h2 className="text-2xl font-bold text-black mb-4 px-1">Stock History</h2>

      {/* Scrollable List Container */}
      <div className="flex flex-col gap-3 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar pr-1">
        {historyItems.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-sm">
            No history avaliable
          </div>
        ) : (
          historyItems.map((item) => (
            // Item Card: พื้นขาว พร้อมขีดเส้นใต้สีส้ม
            <div
              key={item.id}
              className="bg-white relative overflow-hidden shadow-sm flex items-stretch min-h-[90px]"
              style={{ borderBottom: "3px solid #FF7043" }} // เส้นสีส้มด้านล่าง
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
                
                {/* Top Row: Title & Ingredient ID */}
                <div className="flex justify-between items-start">
                  <span className="font-normal text-lg text-black leading-tight line-clamp-1 mr-2">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap mt-1">
                    Ingredient # {item.itemCode}
                  </span>
                </div>

                {/* Bottom Row: Action/Date & Amount */}
                <div className="flex justify-between items-end mt-2">
                  <div className="flex flex-col leading-tight">
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`font-medium ${getActionColor(item.action)}`}
                      >
                        {getActionLabel(item.action)}
                      </span>
                      <span className="text-gray-400 text-[11px]">
                        {item.date} {item.time}
                      </span>
                    </div>
                  </div>

                  <span className="text-base font-bold text-gray-800 whitespace-nowrap mb-[-2px]">
                    {item.amountChange > 0 ? "+" : ""} {item.amountChange}{" "}
                    <span className="text-xs font-normal text-gray-500 ml-0.5">
                      {item.unit}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};