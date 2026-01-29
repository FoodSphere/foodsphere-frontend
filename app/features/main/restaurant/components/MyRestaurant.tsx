"use client";

import React, { useRef, useState } from "react";
import { Pencil, Upload, X } from "lucide-react";

import { Button } from "@/app/components/ui/button"; // นำเข้า Button จาก shadcn
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

// Mock Image URL
const initialRestaurantImageUrl =
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop";

export const MyRestaurantView = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialRestaurantImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function จัดการการ Upload รูป
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function เรียกคลิก input file ที่ซ่อนอยู่
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    // Logic สำหรับบันทึกข้อมูล (เรียก API ฯลฯ)
    console.log("Saving changes...");
    setIsEditMode(false);
  };

  const handleDiscard = () => {
    // Logic สำหรับยกเลิก (รีเซ็ตค่าต่างๆ)
    setImagePreview(initialRestaurantImageUrl); // รีเซ็ตรูปภาพ
    setIsEditMode(false);
  };

  return (
    <>
      {/* Overlay สีเทาดำเมื่ออยู่ใน Edit Mode */}
      {isEditMode && (
        <div
          className="fixed inset-0 bg-black/60 z-40 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Card Container - เพิ่ม z-index เมื่อ edit */}
      <div
        className={`w-full max-w-[900px] bg-[#D9D9D9] rounded-[48px] overflow-hidden shadow-md relative transition-all ${isEditMode ? "z-50 scale-[1.02]" : "z-0"}`}
      >
        {/* Image Header */}
        <div className="relative h-[350px] w-full group">
          <img
            src={imagePreview}
            alt="Restaurant Cover"
            className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
          />
          {/* Dark Overlay on Image Hover in Edit Mode */}
          {isEditMode && (
            <div className="absolute inset-0 bg-black/30 transition-opacity" />
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Floating Action Button */}
          <button
            onClick={isEditMode ? triggerFileInput : () => setIsEditMode(true)}
            className="absolute bottom-0 right-12 translate-y-1/2 bg-[#FF5C39] hover:bg-orange-600 text-white p-5 rounded-full shadow-xl transition-all active:scale-95 z-20"
            aria-label={isEditMode ? "Upload Image" : "Edit Restaurant"}
          >
            {isEditMode ? (
              <Upload className="w-7 h-7" />
            ) : (
              <Pencil className="w-7 h-7" />
            )}
          </button>
        </div>

        {/* Form Fields */}
        <div className="p-12 pt-16 space-y-8">
          <div className="space-y-3">
            <Label className="text-2xl font-bold text-black ml-1">Name</Label>
            <Input
              defaultValue="Hell's Kitchen"
              readOnly={!isEditMode}
              className={`bg-white border-none h-16 rounded-2xl text-xl px-6 shadow-sm ${
                isEditMode
                  ? "focus-visible:ring-2 ring-[#FF5C39]"
                  : "pointer-events-none bg-opacity-80"
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-3">
              <Label className="text-2xl font-bold text-black ml-1">
                Email
              </Label>
              <Input
                defaultValue="Hell2Kitchen@gmail.com"
                readOnly={!isEditMode}
                className={`bg-white border-none h-16 rounded-2xl text-lg px-6 shadow-sm ${
                  isEditMode
                    ? "focus-visible:ring-2 ring-[#FF5C39]"
                    : "pointer-events-none bg-opacity-80"
                }`}
              />
            </div>
            <div className="space-y-3">
              <Label className="text-2xl font-bold text-black ml-1">
                Telephone
              </Label>
              <Input
                defaultValue="+6683XXXXXXX"
                readOnly={!isEditMode}
                className={`bg-white border-none h-16 rounded-2xl text-lg px-6 shadow-sm ${
                  isEditMode
                    ? "focus-visible:ring-2 ring-[#FF5C39]"
                    : "pointer-events-none bg-opacity-80"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-3">
              <Label className="text-2xl font-bold text-black ml-1">Open</Label>
              <Input
                defaultValue="xx AM"
                readOnly={!isEditMode}
                className={`bg-white border-none h-16 rounded-2xl text-lg px-6 shadow-sm text-center ${
                  isEditMode
                    ? "focus-visible:ring-2 ring-[#FF5C39]"
                    : "pointer-events-none bg-opacity-80"
                }`}
              />
            </div>
            <div className="space-y-3">
              <Label className="text-2xl font-bold text-black ml-1">
                Close
              </Label>
              <Input
                defaultValue="xx PM"
                readOnly={!isEditMode}
                className={`bg-white border-none h-16 rounded-2xl text-lg px-6 shadow-sm text-center ${
                  isEditMode
                    ? "focus-visible:ring-2 ring-[#FF5C39]"
                    : "pointer-events-none bg-opacity-80"
                }`}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-2xl font-bold text-black ml-1">
              Address
            </Label>
            <Input
              defaultValue="1, Soi Chalong Krung 1, Lat Krabang, Lat Krabang, BKK, 10520, Thailand"
              readOnly={!isEditMode}
              className={`bg-white border-none h-16 rounded-2xl text-lg px-6 shadow-sm ${
                isEditMode
                  ? "focus-visible:ring-2 ring-[#FF5C39]"
                  : "pointer-events-none bg-opacity-80"
              }`}
            />
          </div>

          {/* Action Buttons (Shown only in Edit Mode) */}
          {isEditMode && (
            <div className="flex justify-end items-center gap-6 pt-6 animate-in fade-in slide-in-from-bottom-4">
              <Button
                onClick={handleDiscard}
                className="text-gray-600 text-lg font-bold hover:text-gray-800 hover:bg-transparent underline-offset-4 hover:underline px-4"
              >
                Discard Changes
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[#FF5C39] hover:bg-orange-600 text-white text-lg font-bold h-14 px-10 rounded-2xl shadow-md transition-all active:scale-95"
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
