import { Icons } from "@/app/icons";

interface StockCardProps {
  id: string;
  imgUrl: string | null;
  title: string;
  amount: number;
  unit: string;
  isAvailable?: boolean;
  onEdit: () => void;
  onToggleStatus: () => void;
}

export const StockCard = ({
  imgUrl,
  title,
  amount,
  unit,
  isAvailable = true,
  onEdit,
  onToggleStatus,
}: StockCardProps) => {
  return (
    <div
      className={`flex flex-col bg-white rounded-xl shadow-md transition-all duration-300 overflow-hidden border border-gray-100 h-full ${!isAvailable ? "opacity-70" : "hover:shadow-lg"}`}
    >
      {/* Image Area */}
      <div className="h-[160px] w-full bg-gray-100 relative">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={title}
            className={`w-full h-full object-cover transform transition-transform duration-500 ${!isAvailable ? "grayscale" : "hover:scale-105"}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}

        {/* Overlay เมื่อปิดใช้งาน */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-col items-center p-4 pt-3 flex-1 justify-between">
        <div
          className={`w-full text-center ${!isAvailable ? "text-gray-400" : ""}`}
        >
          <h3 className="text-lg font-bold mb-1 truncate" title={title}>
            {title}
          </h3>
          <p className="font-bold text-lg mb-4">
            {amount}{" "}
            <span className="text-sm font-normal text-gray-500">{unit}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full mt-auto">
          {/* ปุ่ม Edit: ปิดการใช้งาน (disabled) เมื่อ isAvailable เป็น false */}
          <button
            onClick={onEdit}
            disabled={!isAvailable}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm
              ${
                !isAvailable
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-primary-orange-main hover:bg-orange-600 text-white"
              }`}
          >
            <Icons
              name="EditIcon"
              className={`w-4 h-4 ${!isAvailable ? "text-gray-400" : "text-white"}`}
            />
            Edit
          </button>

          {/* ปุ่ม Toggle Status: สลับระหว่าง Close และ Open */}
          <button
            onClick={onToggleStatus}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm border
              ${
                !isAvailable
                  ? "bg-green-50 border-green-500 text-green-600 hover:bg-green-100"
                  : "bg-white border-primary-orange-main text-primary-orange-main hover:bg-orange-50"
              }`}
          >
            {isAvailable ? (
              <>
                <Icons name="CloseIcon" className="w-4 h-4" />
                Close
              </>
            ) : (
              <>
                <Icons name="PlusIcon" className="w-4 h-4" />{" "}
                {/* หรือใช้ไอคอนที่สื่อถึงการเปิด */}
                Open
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
