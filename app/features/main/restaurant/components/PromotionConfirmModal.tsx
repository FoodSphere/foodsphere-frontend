import { Icons } from "@/app/icons";

interface PromotionConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PromotionConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: PromotionConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center gap-3">
          {/* Icon */}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              isDestructive
                ? "bg-red-100 text-red-500"
                : "bg-primary-orange-main/10 text-primary-orange-main"
            }`}
          >
            {isDestructive ? (
              <Icons name="TrashIcon" className="w-7 h-7" />
            ) : (
              <Icons name="CheckIcon" className="w-7 h-7" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-2">{title}</h2>
          <p className="text-gray-500 font-medium mb-4">{message}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 rounded-xl font-bold text-white transition-all shadow-sm flex justify-center items-center gap-2 ${
              isDestructive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-primary-orange-main hover:bg-orange-600"
            } disabled:opacity-50`}
          >
            {isLoading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
