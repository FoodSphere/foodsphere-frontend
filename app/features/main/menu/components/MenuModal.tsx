import { useEffect,useState } from "react";

import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Icons } from "@/app/icons";

interface Ingredient {
  title: string;
  amount: number;
}

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem?: {
    id: string;
    imgUrl: string | null;
    title: string;
    price: number; 
    currency: string; 
    ingredients: Ingredient[];
  } | null;
  onSave: (item: any) => void;
}

export const MenuModal = ({
  isOpen,
  onClose,
  menuItem,
  onSave,
}: MenuModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [comparePrice, setComparePrice] = useState<number | string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const isEditMode = !!menuItem;

  useEffect(() => {
    if (isOpen) {
      if (menuItem) {
        setName(menuItem.title);
        setPrice(menuItem.price);
        setComparePrice(menuItem.price + 100); // Mock compare price
        setTags(["Hotpot", "Meat", "Japan"]); // Mock tags
        setIngredients(menuItem.ingredients || []);
      } else {
        // Reset for Add mode
        setName("");
        setPrice("");
        setComparePrice("");
        setTags([]);
        setIngredients([]);
      }
      setTagInput("");
    }
  }, [isOpen, menuItem]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      id: menuItem?.id,
      title: name,
      amount: Number(price),
      unit: "Bahts",
      ingredients,
      tags,
    });
    onClose();
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { title: "", amount: 1 }]);
  };

  const removeIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-[rgba(0,0,0,0.8)]">
      <div className="bg-[#E5E5E5] rounded-3xl rounded-r-none w-[900px] overflow-hidden shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 shrink-0">
          <h2 className="text-2xl font-bold text-black">
            {isEditMode ? "Edit Menu" : "Add Menu"}
          </h2>
        </div>
        
        <div className="border-b border-black mx-8 mb-6 shrink-0"></div>

        {/* Content */}
        <div className="px-8 pb-8 flex gap-8 overflow-y-hidden">
          {/* Left Column: Image */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-[200px] h-[200px] bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
              {menuItem?.imgUrl ? (
                <img
                  src={menuItem.imgUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400">No Image</div>
              )}
            </div>
            <button className="text-gray-500 underline text-sm hover:text-gray-700">
              Change Icon
            </button>
          </div>

          {/* Right Column: Form */}
          <div className="flex-1 space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-black">Name</label>
              <Input
                value={name}
                placeholder={isEditMode ? "Edit menu name..." : "Add menu name..."}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border-none h-12 text-lg rounded-xl"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-black">Price</label>
              <Input
                type="number"
                value={price}
                placeholder={isEditMode ? "Edit price..." : "Add price..."}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-white border-none h-12 text-lg rounded-xl"
              />
            </div>

            {/* Compare Price */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-black">Compare Price</label>
              <Input
                type="number"
                value={comparePrice}
                placeholder={isEditMode ? "Edit compare price..." : "Add compare price..."}
                onChange={(e) => setComparePrice(e.target.value)}
                className="bg-white border-none h-12 text-lg rounded-xl"
              />
            </div>

            {/* Tag */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-black">Tag</label>
              <div className="bg-white h-12 rounded-xl flex items-center px-3 gap-2 overflow-x-auto flex-nowrap py-2 no-scrollbar">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-gray-200 hover:bg-gray-300 text-black text-base font-normal px-3 py-1 rounded-full gap-2 cursor-default whitespace-nowrap"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500"
                    >
                      <Icons name="CloseIcon" className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add tag..."
                  className="flex-1 bg-transparent border-none outline-none text-base min-w-[80px] shrink-0"
                />
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-lg font-medium text-black">Ingredient</label>
                <button 
                  onClick={addIngredient}
                  className="text-sky-500 text-sm hover:underline"
                >
                  Add Ingredient
                </button>
              </div>
              <div className="bg-gray-200/50 rounded-xl p-4">
                <ScrollArea className="h-[150px] overflow-y-auto">
                  <div className="space-y-3">
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <Input
                          value={ingredient.title}
                          onChange={(e) => updateIngredient(index, "title", e.target.value)}
                          placeholder={isEditMode ? "Edit ingredient..." : "Add ingredient..."}
                          className="bg-white border-none h-12 text-base rounded-xl flex-1"
                        />
                        <div className="flex items-center bg-white rounded-xl h-12 px-2 w-[100px]">
                          <input
                            type="number"
                            value={ingredient.amount}
                            onChange={(e) => updateIngredient(index, "amount", Number(e.target.value))}
                            className="w-full text-center outline-none bg-transparent"
                          />
                          <div className="flex flex-col">
                            <button 
                              onClick={() => updateIngredient(index, "amount", ingredient.amount + 1)}
                              className="text-gray-500 hover:text-black leading-none text-xs"
                            >
                              +
                            </button>
                            <button 
                              onClick={() => updateIngredient(index, "amount", Math.max(0, ingredient.amount - 1))}
                              className="text-gray-500 hover:text-black leading-none text-xs"
                            >
                              -
                            </button>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeIngredient(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Icons name="TrashIcon" className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    {ingredients.length === 0 && (
                      <div className="text-center text-gray-400 py-4">No ingredients added</div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex justify-end gap-4 shrink-0 pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-500 hover:text-gray-700 font-medium underline"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-10 py-3 bg-[#FF5C39] hover:bg-[#ff451f] text-white font-bold rounded-xl shadow-lg transition-colors"
          >
            {isEditMode ? "Edit" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};
