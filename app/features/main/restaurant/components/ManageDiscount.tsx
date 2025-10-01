// src/components/restaurant/ManageDiscountView.tsx
import React from "react";
import { AlertCircle, Trash2 } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

// Mock Data
const discounts = [
  {
    code: "DDD111",
    value: "- 75 B.",
    minBill: 399,
    remaining: 6,
    expires: "16/03/2567",
    expired: true,
  },
  {
    code: "DDD112",
    value: "- 50 B.",
    minBill: 299,
    remaining: 11,
    expires: "31/03/2567",
    expired: false,
  },
  {
    code: "PPP111",
    value: "- 7%",
    minBill: 149,
    remaining: 4,
    expires: "16/03/2567",
    expired: true,
  },
  {
    code: "PPP112",
    value: "- 10%",
    minBill: 799,
    remaining: 3,
    expires: "19/03/2567",
    expired: true,
  },
];

export const ManageDiscountView = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Discount List */}
      <div className="lg:col-span-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Discount Lists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {discounts.map((discount, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-bold">
                        {index + 1}. {discount.code}
                      </h3>
                      <span className="bg-red-200 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {discount.value}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Discount for Minimum Bill {discount.minBill} Baht.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {discount.remaining} Rights Remaining.
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-2">
                      {discount.expired && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <Button>
                        <Trash2 className="h-5 w-5 text-gray-500 hover:text-red-500" />
                      </Button>
                    </div>
                    <p
                      className={`text-sm mt-8 ${
                        discount.expired
                          ? "text-red-500 font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      Expires On {discount.expires}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Add New Discount Form */}
      <div className="lg:col-span-1">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Add New Discount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" placeholder="e.g., NEWYEAR25" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount-type">Discount Type</Label>
              <Select>
                <SelectTrigger id="discount-type">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Amount (Baht)</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount</Label>
              <Input
                id="discount"
                type="number"
                placeholder="e.g., 100 or 15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bill-minimum">Bill Minimum</Label>
              <Input id="bill-minimum" type="number" placeholder="e.g., 500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-date">Start</Label>
              <Input id="start-date" placeholder="dd/mm/yyyy" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End</Label>
              <Input id="end-date" placeholder="dd/mm/yyyy" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rights-number">Number of Rights</Label>
              <Input id="rights-number" type="number" placeholder="e.g., 200" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              Add
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
