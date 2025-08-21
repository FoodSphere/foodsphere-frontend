import { Icons } from "@/app/icons";
import { ActionEnum, ItemTypeEnum } from "@/public/enum/confirmModalEnum";

interface ConfirmModalComponentProps {
  title: string;
  action?: ActionEnum | null;
  itemName?: string | null;
  itemType?: ItemTypeEnum | null;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const ConfirmModalComponent = ({
  title,
  action = null,
  itemName = null,
  itemType = null,
  onConfirm,
  onCancel,
}: ConfirmModalComponentProps) => {
  return (
    <div className="min-w-full min-h-full fixed top-0 left-0 flex flex-col justify-center items-center bg-[rgba(0,0,0,0.8)]">
      <div className="bg-white rounded-t-2xl w-[400px] text-center">
        <p className="text-black font-bold text-2xl m-5">{title}</p>
      </div>
      <hr className="border-t border-gray-300"></hr>
      <div className="bg-white rounded-b-2xl w-[400px]">
        {action && itemName && itemType && (
          <p className="text-black mt-8 mb-5 text-center">
            {action}{" "}
            <span className="text-primary-orange-main underline">
              {itemName}
            </span>{" "}
            to restaurant's {itemType.toLowerCase()} list
          </p>
        )}
        <div
          className={`flex gap-8 justify-center ${itemName ? "mb-8" : "my-8"}`}
        >
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="cursor-pointer flex items-center gap-2 bg-primary-orange-main hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-lg shadow transition border-2 border-orange-500"
            >
              <Icons name="CheckIcon" className="text-white w-[20px]" />
              Confirm
            </button>
          )}
          {onCancel && (
            <button
              onClick={onCancel}
              className="cursor-pointer flex items-center gap-2 bg-white text-primary-orange-main border-2 border-primary-orange-main hover:bg-orange-50 font-semibold px-5 py-3 rounded-lg shadow transition"
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
