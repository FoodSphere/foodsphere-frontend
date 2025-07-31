import { Icons } from "@/app/icons";

interface Ingredient {
  title: string;
  amount: number;
}

interface ItemCardComponentProps {
  page: string;
  imgUrl: string;
  title: string;
  amount: number;
  unit: string;
  onEdit?: () => void;
  onClose?: () => void;
  showIngredients?: boolean;
  setShowIngredientsState?: React.Dispatch<React.SetStateAction<boolean>>;
  Ingredients?: Ingredient[];
}

export const ItemCardComponent = ({
  page,
  imgUrl,
  title,
  amount,
  unit,
  onEdit,
  onClose,
  showIngredients = false,
  setShowIngredientsState,
  Ingredients = [],
}: ItemCardComponentProps) => {
  return (
    <div className="bg-white rounded-2xl w-[320px] mx-auto shadow relative flex flex-col items-center">
      <img
        src={imgUrl}
        alt={title}
        className="w-full h-[145px] object-cover rounded-t-2xl"
      />
      <div className="w-full flex flex-col items-center border-x-2 border-b-2 border-primary-orange-main rounded-b-2xl">
        <h3 className="text-xl mt-4 mb-2 text-center text-black">{title}</h3>
        <p className="mb-4 text-center text-gray-700 font-medium">
          {amount} {unit}
        </p>
        <div className="flex gap-4 mb-4">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 bg-primary-orange-main hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-lg shadow transition border-2 border-orange-500"
            >
              <Icons name="EditIcon" className="text-white w-[20px]" />
              Edit
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 bg-white text-primary-orange-main border-2 border-primary-orange-main hover:bg-orange-50 font-semibold px-5 py-2 rounded-lg shadow transition"
            >
              <Icons
                name="CloseIcon"
                className="text-primary-orange-main w-[20px]"
              />
              Close
            </button>
          )}
        </div>
        {page === "menu" && (
          <button
            className="text-sky-500 text-sm font-medium flex items-center gap-1 mb-2 hover:underline"
            onClick={() =>
              setShowIngredientsState &&
              setShowIngredientsState(!showIngredients)
            }
          >
            {showIngredients ? "Hide ingredients" : "Show ingredients"}
          </button>
        )}
        {page == "menu" && showIngredients && Ingredients.length > 0 && (
          <ul className="w-full border-t-2 border-dashed border-black my-2 pt-2">
            {Ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="flex justify-between px-2 py-1 text-base text-gray-800"
              >
                <span>{ingredient.title}</span>
                <span>x {ingredient.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
