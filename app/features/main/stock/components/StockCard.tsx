import { Icons } from "@/app/icons";

interface StockCardProps {
  id: number;
  name: string;
  img_url: string | null;
  stock: number;
  unit: string;
  status?: boolean;
  onEdit: () => void;
  onToggleStatus: () => void;
}

export const StockCard = ({
  name,
  img_url,
  stock,
  unit,
  status = true,
  onEdit,
  onToggleStatus,
}: StockCardProps) => {
  return (
    <div
      className={`flex flex-col bg-white rounded-xl shadow-md transition-all duration-300 overflow-hidden border border-gray-100 h-full ${!status ? "opacity-70" : "hover:shadow-lg"}`}
    >
      {/* Image Area */}
      <div className="h-[160px] w-full bg-gray-100 relative">
        {img_url ? (
          <img
            src={img_url}
            alt={name}
            className={`w-full h-full object-cover transform transition-transform duration-500 ${!status ? "grayscale" : "hover:scale-105"}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}

        {/* Overlay เมื่อปิดใช้งาน */}
        {!status && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Close
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-col items-center p-4 pt-3 flex-1 justify-between border-t-3 border-primary-orange-main">
        <div className={`w-full text-center ${!status ? "text-gray-400" : ""}`}>
          <h3 className="text-lg font-bold mb-1 truncate" title={name}>
            {name}
          </h3>
          <p className="font-bold text-lg mb-4">
            {stock}{" "}
            <span className="text-sm font-normal text-gray-500">{unit}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full mt-auto">
          {/* ปุ่ม Edit */}
          <button
            onClick={onEdit}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm bg-primary-orange-main hover:bg-orange-600 text-white`}
          >
            <Icons name="EditIcon" className={`w-4 h-4`} />
            Edit
          </button>

          {/* ปุ่ม Toggle Status: สลับระหว่าง Close และ Open */}
          <button
            onClick={onToggleStatus}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm border
              ${
                !status
                  ? "bg-green-50 border-green-500 text-green-600 hover:bg-green-100"
                  : "bg-white border-primary-orange-main text-primary-orange-main hover:bg-orange-50"
              }`}
          >
            {status ? (
              <>
                <Icons name="CloseIcon" className="w-4 h-4" />
                Close
              </>
            ) : (
              <>
                <Icons name="CheckIcon" className="w-4 h-4" /> Open
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
