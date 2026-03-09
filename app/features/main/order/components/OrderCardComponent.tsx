import clsx from "clsx";

import { Icons } from "@/app/icons";

import { Button } from "../../../../components/ui/button";

interface OrderCardComponentProps {
  id: string;
  img?: string | null;
  foodName: string;
  table: string;
  additionalDetail?: string;
  quantity: string;
  order_at: string;
  status: string;
  onUpdate: (id: string) => void;
  onCancel: (id: string) => void;
}

export const OrderCardComponent = ({
  id,
  img,
  foodName,
  table,
  additionalDetail,
  quantity,
  order_at,
  status,
  onUpdate,
  onCancel,
}: OrderCardComponentProps) => {
  return (
    <div className="w-full flex flex-row border-b-2 border-primary-orange-main">
      {/* img section */}
      {img ? (
        <img src={img} alt={foodName} className="w-[25%] h-[150px]" />
      ) : (
        <div className="w-[25%] bg-gray-100 flex items-center justify-center text-xs text-gray-400 flex-shrink-0">
          No Image
        </div>
      )}
      {/* order detail section */}
      <div className="w-[55%] flex flex-col">
        {/* upper section */}
        <div className="h-1/2 flex flex-row justify-between items-center p-3.5">
          {/* table */}
          <div className="flex flex-row ">
            <div className="w-fit h-fit px-4 py-3 bg-primary-orange-main rounded-md text-white text-2xl font-semibold flex justify-center items-center">
              Table {table}
            </div>
            {/* food name & quantity */}
            <div className="flex flex-col text-base font-medium px-3.5">
              <p className="text-black font-semibold">{foodName}</p>
              <p className="text-black/70">Quantity: {quantity}</p>
            </div>
          </div>

          {/* status & time */}
          <div className="flex flex-col justify-center items-center text-base font-medium gap-2">
            <div
              className={clsx(
                "w-fit h-fit px-4 py-1 text-black flex justify-center items-center rounded-md",
                { "bg-notdone-01": status === "Pending" },
                { "bg-cooking-01": status === "Cooking" },
                { "bg-complete-01": status === "Completed" },
                { "bg-fail-01": status === "Cancel" }
              )}
            >
              {status}
            </div>
            <p className=" text-black/60">{order_at}</p>
          </div>
        </div>

        {/* line */}
        <div className="w-full h-[1px] bg-black/40"></div>

        {/* lower section */}
        <div className="h-1/2 flex flex-col text-base font-medium p-3.5">
          <p className="text-black/50 font-semibold">Additional Details</p>
          <p className="text-black">{additionalDetail}</p>
        </div>
      </div>
      {/* button section */}
      <div className="w-[20%] flex flex-col p-5 border-l-[1px] border-black/40">
        {status === "Pending" && (
          <div className="h-full flex flex-col items-center justify-between">
            <Button variant="outline" onClick={() => onCancel(id)}>
              <Icons className="w-5" name="TrashIcon" />
              Cancel
            </Button>
            <Button onClick={() => onUpdate(id)}>
              <Icons className="w-5" name="CheckIcon" />
              Update
            </Button>
          </div>
        )}
        {status === "Cooking" && (
          <div className="h-full flex flex-col justify-end items-center">
            <Button onClick={() => onUpdate(id)}>
              <Icons className="w-5" name="CheckIcon" />
              Update
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
