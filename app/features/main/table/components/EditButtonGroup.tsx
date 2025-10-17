import { useState } from "react";

import { Icons } from "@/app/icons";

interface EditButtonGroupProps {
  onAdd: () => void;
  onRemove: () => void;
}

export const EditButtonGroup = ({
  onAdd,
  onRemove,
}: EditButtonGroupProps) => {
  var [isEditing, setIsEditing] = useState(false);
  return (
    <div className="flex flex-col gap-4 items-center">
      {isEditing && (
        <>
          <button onClick={onAdd} className="bg-primary-orange-main text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-orange-600 transition-all transform hover:scale-110 shadow-lg">
            <Icons name="PlusIcon" className="text-white w-[20px]" />
          </button>
          <button onClick={onRemove} className="bg-primary-orange-main text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold hover:bg-orange-600 transition-all transform hover:scale-110 shadow-lg">
            <Icons name="MinusIcon" className="text-white w-[20px]" />
          </button>
        </>
      )}
      <button
        onClick={() => setIsEditing(!isEditing)}
        className={`text-white px-8 py-3 rounded-full text-lg font-semibold 
             transition-all transform hover:scale-105 shadow-lg
            ${
              isEditing
                ? "bg-gray-400 hover:bg-gray-500"
                : "bg-primary-orange-main hover:bg-orange-600"
            }`}
      >
        Edit Table
      </button>
    </div>
  );
};
