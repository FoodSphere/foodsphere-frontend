"use client";

import React, { useEffect, useRef, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  getRestaurant,
  updateRestaurant,
  uploadRestaurantImage,
} from "@/services/restaurant/restaurantApi";
import {
  IContact,
  IGetRestaurantResponse,
  IUpdateRestaurantRequest,
} from "@/types/restaurantType";

// Generate time options for hour 00 to 23
const hourOptions = Array.from({ length: 24 }, (_, i) => {
  const hours = i.toString().padStart(2, "0");
  return hours;
});

// Generate time options for minute 00 to 59
const minuteOptions = Array.from({ length: 60 }, (_, i) => {
  const minutes = i.toString().padStart(2, "0");
  return minutes;
});

interface HourMinute {
  hour: string;
  minute: string;
}

interface FormData {
  contact: IContact;
  name: string;
  display_name: string;
  address: string;
  opening_time: HourMinute;
  closing_time: HourMinute;
}

export const MyRestaurantView = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<FormData>({
    contact: {
      name: "-",
      email: "-",
      phone: "-",
    },
    name: "-",
    display_name: "-",
    address: "-",
    opening_time: {
      hour: "00",
      minute: "00",
    },
    closing_time: {
      hour: "00",
      minute: "00",
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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

  const handleSave = async () => {
    const payload: IUpdateRestaurantRequest = {
      ...formData,
      opening_time: `${formData.opening_time.hour}:${formData.opening_time.minute}`,
      closing_time: `${formData.closing_time.hour}:${formData.closing_time.minute}`,
    };
    await updateRestaurant(payload);
    if (selectedFile) {
      await uploadRestaurantImage(selectedFile);
    }
    setSelectedFile(null);
    fetchRestaurantData();
    setIsEditMode(false);
  };

  const handleDiscard = () => {
    fetchRestaurantData();
    setSelectedFile(null);
    setIsEditMode(false);
  };

  const inputClassName = (isEdit: boolean) => `
    transition-all duration-300 ease-in-out
    ${
      isEdit
        ? "bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-[#FF5C39] focus:border-transparent px-4 py-6 shadow-sm rounded-xl"
        : "bg-transparent border-transparent px-0 shadow-none cursor-default font-medium text-gray-800 flex justify-center"
    }
    w-full text-lg h-auto
  `;

  const fetchRestaurantData = async () => {
    try {
      const res = await getRestaurant();

      if (res && res.data) {
        const apiData: IGetRestaurantResponse = res.data;
        setFormData({
          contact: {
            name: apiData.contact.name ?? "-",
            email: apiData.contact.email ?? "-",
            phone: apiData.contact.phone ?? "-",
          },
          name: apiData.name ?? "-",
          display_name: apiData.display_name ?? "-",
          address: apiData.address ?? "-",
          opening_time: {
            hour: apiData.opening_time?.split(":")[0] ?? "00",
            minute: apiData.opening_time?.split(":")[1] ?? "00",
          },
          closing_time: {
            hour: apiData.closing_time?.split(":")[0] ?? "00",
            minute: apiData.closing_time?.split(":")[1] ?? "00",
          },
        });
        setImagePreview(apiData.image_url ?? null);
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    }
  };

  useEffect(() => {
    const initData = async () => {
      try {
        fetchRestaurantData();
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };
    initData();
  }, []);

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
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Restaurant Cover"
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isEditMode ? "scale-105" : ""
                }`}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-400">No Image</p>
              </div>
            )}
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
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
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
                value={formData.contact.email ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value },
                  })
                }
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
                value={formData.contact.phone ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact: { ...formData.contact, phone: e.target.value },
                  })
                }
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
                  {isEditMode ? (
                    <div className="flex items-center gap-4">
                      <Select
                        value={formData.opening_time.hour}
                        onValueChange={(hour) =>
                          setFormData({
                            ...formData,
                            opening_time: {
                              ...formData.opening_time,
                              hour,
                            },
                          })
                        }
                      >
                        <SelectTrigger className={inputClassName(true)}>
                          <SelectValue placeholder="Select opening time" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 bg-white">
                          {hourOptions.map((hour) => (
                            <SelectItem key={`open-${hour}`} value={hour}>
                              {hour}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={formData.opening_time.minute}
                        onValueChange={(minute) =>
                          setFormData({
                            ...formData,
                            opening_time: {
                              ...formData.opening_time,
                              minute,
                            },
                          })
                        }
                      >
                        <SelectTrigger className={inputClassName(true)}>
                          <SelectValue placeholder="Select opening time" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 bg-white">
                          {minuteOptions.map((minute) => (
                            <SelectItem key={`open-${minute}`} value={minute}>
                              {minute}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className={inputClassName(false)}>
                      {formData.opening_time.hour}:
                      {formData.opening_time.minute}
                    </div>
                  )}
                </div>
                <span className="text-gray-400 font-medium">to</span>
                <div className="flex-1">
                  {isEditMode ? (
                    <div className="flex items-center gap-4">
                      <Select
                        value={formData.closing_time.hour}
                        onValueChange={(hour) =>
                          setFormData({
                            ...formData,
                            closing_time: {
                              ...formData.closing_time,
                              hour,
                            },
                          })
                        }
                      >
                        <SelectTrigger className={inputClassName(true)}>
                          <SelectValue placeholder="Select closing time" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 bg-white">
                          {hourOptions.map((hour) => (
                            <SelectItem key={`close-${hour}`} value={hour}>
                              {hour}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={formData.closing_time.minute}
                        onValueChange={(minute) =>
                          setFormData({
                            ...formData,
                            closing_time: {
                              ...formData.closing_time,
                              minute,
                            },
                          })
                        }
                      >
                        <SelectTrigger className={inputClassName(true)}>
                          <SelectValue placeholder="Select closing time" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 bg-white">
                          {minuteOptions.map((minute) => (
                            <SelectItem key={`close-${minute}`} value={minute}>
                              {minute}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div className={inputClassName(false)}>
                      {formData.closing_time.hour}:
                      {formData.closing_time.minute}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-3 md:col-span-2">
              <Label className="flex items-center gap-2 text-gray-500 font-semibold text-sm">
                <MapPin className="w-4 h-4 text-[#FF5C39]" /> Location
              </Label>
              <Input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
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
