// src/components/restaurant/ManageEmployeesView.tsx
import React from "react";
import { Pencil, Trash2 } from "lucide-react";

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
import { Switch } from "@/app/components/ui/switch";

// Mock Data
const employees = [
  {
    name: "John Doe",
    role: "Manager",
    permissions: {
      dashboard: true,
      order: true,
      table: true,
      stock: true,
      menu: true,
      restaurant: true,
    },
  },
  {
    name: "Jane Mary",
    role: "Cashier",
    permissions: {
      dashboard: false,
      order: true,
      table: true,
      stock: false,
      menu: true,
      restaurant: false,
    },
  },
  {
    name: "Jack Kopenski",
    role: "Waiter",
    permissions: {
      dashboard: false,
      order: true,
      table: true,
      stock: false,
      menu: false,
      restaurant: false,
    },
  },
  {
    name: "Joe Timberland",
    role: "Waiter",
    permissions: {
      dashboard: false,
      order: true,
      table: true,
      stock: false,
      menu: false,
      restaurant: false,
    },
  },
];

const permissionLabels = [
  "Dashboard",
  "Order",
  "Table",
  "Stock",
  "Menu",
  "Restaurant",
];

export const ManageEmployeesView = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Add New User Form */}
      <div className="lg:col-span-1">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Enter first name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Enter last name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" placeholder="e.g., Waiter, Cashier" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              Add
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Employees List */}
      <div className="lg:col-span-2 space-y-4">
        {employees.map((employee, index) => (
          <Card key={index} className="shadow-lg p-4">
            <CardContent className="p-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{employee.name}</h3>
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      employee.role === "Manager"
                        ? "bg-orange-200 text-orange-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {employee.role}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {permissionLabels.map((label) => {
                  const key =
                    label.toLowerCase() as keyof typeof employee.permissions;
                  return (
                    <div
                      key={key}
                      className="flex flex-col items-center space-y-1"
                    >
                      <Label
                        htmlFor={`${employee.name}-${key}`}
                        className="text-sm"
                      >
                        {label}
                      </Label>
                      <Switch
                        id={`${employee.name}-${key}`}
                        checked={employee.permissions[key]}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
