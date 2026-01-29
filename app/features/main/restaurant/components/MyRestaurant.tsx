"use client";

import React, { useRef, useState } from "react";
import {
  Clock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Store,
  Upload,
} from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

const initialRestaurantImageUrl =
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop";

export const MyRestaurantView = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(initialRestaurantImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    setIsEditMode(false);
  };

  const handleDiscard = () => {
    setImagePreview(initialRestaurantImageUrl);
    setIsEditMode(false);
  };

  const inputClassName = (isEdit: boolean) => `
    transition-all duration-300 ease-in-out
    ${
      isEdit
        ? "bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#FF5C39] focus:border-transparent px-4 py-6 shadow-sm rounded-xl"
        : "bg-transparent border-transparent px-0 shadow-none cursor-default font-medium text-gray-800"
    }
    w-full text-lg h-auto
  `;

  return (
    <>
      {/* 1. Overlay Backdrop - ลบ backdrop-blur ออก */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isEditMode
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={handleDiscard}
      />

      {/* Main Card */}
      <div
        className={`w-full max-w-[1000px] bg-white rounded-[32px] shadow-2xl relative transition-all duration-500 ease-out mx-auto ${
          isEditMode ? "z-50 scale-[1.01]" : "z-0 hover:shadow-xl"
        }`}
      >
        {/* === Image Header Section === */}
        <div className="relative h-[400px] w-full">
          {/* กรอบรูปภาพพร้อม overflow-hidden เพื่อให้มุมโค้งตาม Card */}
          <div className="w-full h-full overflow-hidden rounded-t-[32px]">
            <img
              src={imagePreview}
              alt="Restaurant Cover"
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isEditMode ? "scale-105" : ""
              }`}
            />
            {/* Dark Overlay on Image in Edit Mode - ลบ Icon และ Text ออก */}
            {isEditMode && (
              <div className="absolute inset-0 bg-black/30 animate-in fade-in transition-opacity" />
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          {/* 2. Floating Action Button - ปรับโครงสร้างให้อยู่เหนือ overflow */}
          <button
            onClick={isEditMode ? triggerFileInput : () => setIsEditMode(true)}
            className={`absolute bottom-0 right-10 translate-y-1/2 p-4 rounded-full shadow-xl transition-all duration-300 active:scale-95 z-50 flex items-center justify-center gap-2 
              ${
                isEditMode
                  ? "bg-white text-gray-900 w-auto px-6 hover:bg-gray-50 border border-gray-100"
                  : "bg-[#FF5C39] text-white w-16 h-16 hover:bg-orange-600 shadow-orange-200/50"
              }`}
          >
            {isEditMode ? (
              <>
                <Upload className="w-5 h-5" />
                <span className="font-bold text-sm">Upload New Photo</span>
              </>
            ) : (
              <Pencil className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* === Form Content Section === */}
        <div className="px-10 py-12 md:px-16 space-y-10">
          {/* Header: Restaurant Name - 3. ปรับความหนาฟอนต์ (จาก extrabold เป็น bold) และขนาดลง */}
          <div className="space-y-2 border-b border-gray-100 pb-8">
            <Label className="text-sm font-bold text-[#FF5C39] uppercase tracking-wider flex items-center gap-2">
              <Store className="w-4 h-4" /> Restaurant Name
            </Label>
            <Input
              defaultValue="Hell's Kitchen"
              readOnly={!isEditMode}
              className={`text-3xl md:text-4xl font-bold tracking-tight ${inputClassName(isEditMode)}`}
            />
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {/* Email */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-gray-500 font-semibold text-sm">
                <Mail className="w-4 h-4 text-[#FF5C39]" /> Email Address
              </Label>
              <Input
                defaultValue="contact@hellskitchen.com"
                readOnly={!isEditMode}
                className={inputClassName(isEditMode)}
              />
            </div>

            {/* Phone */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-gray-500 font-semibold text-sm">
                <Phone className="w-4 h-4 text-[#FF5C39]" /> Phone Number
              </Label>
              <Input
                defaultValue="+66 83 123 4567"
                readOnly={!isEditMode}
                className={inputClassName(isEditMode)}
              />
            </div>

            {/* Opening Hours */}
            <div className="space-y-3 md:col-span-2">
              <Label className="flex items-center gap-2 text-gray-500 font-semibold text-sm">
                <Clock className="w-4 h-4 text-[#FF5C39]" /> Opening Hours
              </Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    defaultValue="10:00 AM"
                    readOnly={!isEditMode}
                    className={`${inputClassName(isEditMode)} text-center`}
                  />
                </div>
                <span className="text-gray-400 font-medium">to</span>
                <div className="flex-1">
                  <Input
                    defaultValue="10:00 PM"
                    readOnly={!isEditMode}
                    className={`${inputClassName(isEditMode)} text-center`}
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-3 md:col-span-2">
              <Label className="flex items-center gap-2 text-gray-500 font-semibold text-sm">
                <MapPin className="w-4 h-4 text-[#FF5C39]" /> Location
              </Label>
              <Input
                defaultValue="1, Soi Chalong Krung 1, Lat Krabang, Bangkok, 10520"
                readOnly={!isEditMode}
                className={inputClassName(isEditMode)}
              />
            </div>
          </div>

          {/* Action Footer */}
          {isEditMode && (
            <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-100 animate-in slide-in-from-bottom-2 fade-in duration-300">
              <Button
                variant="ghost"
                onClick={handleDiscard}
                className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl h-12 px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[#FF5C39] hover:bg-orange-600 text-white rounded-xl h-12 px-8 shadow-lg shadow-orange-200"
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
