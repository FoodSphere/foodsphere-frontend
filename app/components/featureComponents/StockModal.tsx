"use client"
import { useState, useEffect } from "react";
import { Icons } from "@/app/icons";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockItem?: {
    id: string;
    imgUrl: string | null;
    title: string;
    amount: number;
    unit: string;
  } | null;
  onSave: (item: any) => void;
}

export const StockModal = ({
  isOpen,
  onClose,
  stockItem,
  onSave,
}: StockModalProps) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("pcs.");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const isEditMode = !!stockItem;

  useEffect(() => {
    if (isOpen) {
      if (stockItem) {
        setName(stockItem.title);
        setQuantity(stockItem.amount);
        setUnit(stockItem.unit);
        setTags(["Veggies", "Red", "Fresh"]); // Mock tags for edit
      } else {
        // Reset for Add mode
        setName("");
        setQuantity(0);
        setUnit("pcs.");
        setTags([]);
      }
      setTagInput("");
    }
  }, [isOpen, stockItem]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      id: stockItem?.id, // undefined for new items
      title: name,
      amount: quantity,
      unit: unit,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-[rgba(0,0,0,0.8)]">
      <div className="bg-[#E5E5E5] rounded-3xl rounded-r-none w-[800px] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold text-black">
            {isEditMode ? "Edit Stock" : "Add New Stock"}
          </h2>
        </div>
        
        <div className="border-b border-black mx-8 mb-6"></div>

        {/* Content */}
        <div className="px-8 pb-8 flex gap-8">
          {/* Left Column: Image */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-[200px] h-[200px] bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
              {stockItem?.imgUrl ? (
                <img
                  src={stockItem.imgUrl}
                  alt={name}
                  className="w-full h-full object-contain p-2"
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
                placeholder={isEditMode ? "Edit stock name..." : "Add stock name..."}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border-none h-12 text-lg rounded-xl"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-black">Quantity</label>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="bg-white border-none h-12 text-lg rounded-xl pr-10"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="text-gray-500 hover:text-black leading-none"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => setQuantity(q => Math.max(0, q - 1))}
                      className="text-gray-500 hover:text-black leading-none"
                    >
                      -
                    </button>
                  </div>
                </div>
                <div className="w-[120px]">
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="bg-white border-none h-12 text-lg rounded-xl flex items-center">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs.">pcs.</SelectItem>
                      <SelectItem value="kg.">kg.</SelectItem>
                      <SelectItem value="g.">g.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Tag */}
            <div className="space-y-2">
              <label className="text-lg font-medium text-black">Tag</label>
              <div className="bg-white min-h-[48px] rounded-xl flex items-center px-3 gap-2 flex-wrap py-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-gray-200 hover:bg-gray-300 text-black text-base font-normal px-3 py-1 rounded-full gap-2 cursor-default"
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
                  className="flex-1 bg-transparent border-none outline-none text-base min-w-[80px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex justify-end gap-4">
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
