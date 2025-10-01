// src/components/restaurant/MyRestaurantView.tsx
import React from "react";
import { Pencil } from "lucide-react";
import Image from "next/image";

import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

export const MyRestaurantView = () => {
  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden shadow-lg">
      <div className="relative">
        <Image
          src=""
          alt="Hell's Kitchen"
          className="w-full h-64 object-cover"
        />
        <Button className="absolute bottom-4 right-4 bg-orange-500 hover:bg-orange-600 rounded-full h-12 w-12">
          <Pencil className="h-6 w-6 text-white" />
        </Button>
      </div>
      <CardContent className="p-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-md">
            Name
          </Label>
          <Input
            id="name"
            defaultValue="Hell's Kitchen"
            className="text-base p-4"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-md">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              defaultValue="Hell2Kitchen@gmail.com"
              className="text-base p-4"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephone" className="text-md">
              Telephone
            </Label>
            <Input
              id="telephone"
              defaultValue="+6683XXXXXXX"
              className="text-base p-4"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="open" className="text-md">
              Open
            </Label>
            <Input id="open" defaultValue="xx AM" className="text-base p-4" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="close" className="text-md">
              Close
            </Label>
            <Input id="close" defaultValue="xx PM" className="text-base p-4" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address" className="text-md">
            Address
          </Label>
          <Input
            id="address"
            defaultValue="1, Soi Chalong Krung 1, Lat Krabang, Lat Krabang, BKK, 10520, Thailand"
            className="text-base p-4"
          />
        </div>
      </CardContent>
    </Card>
  );
};
