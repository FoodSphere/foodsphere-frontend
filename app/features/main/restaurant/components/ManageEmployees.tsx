// src/components/restaurant/ManageEmployeesView.tsx
import React, { useState } from "react";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";

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
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

import { ConfirmModalComponent } from "@/app/components/featureComponents/ConfirmModalComponent";
import { ConfirmTypeEnum } from "@/public/enum/confirmModalEnum";
import { EmployeeSearchBar } from "./EmployeeSearchBar";

// Types
type PermissionKey =
  | "dashboard"
  | "order"
  | "table"
  | "stock"
  | "menu"
  | "restaurant";

interface FormData {
  firstName: string;
  lastName: string;
  role: string;
  password: string;
}

interface Role {
    id: number;
    name: string;
}

interface Employee {
  id: number;
  name: string;
  role: string;
  permissions: Record<PermissionKey, boolean>;
}

// Mock Data
const roles: Role[] = [
    { id: 1, name: "Manager" },
    { id: 2, name: "Cashier" },
    { id: 3, name: "Waiter" },
]

const employees: Employee[] = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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

const permissionGroups = [
  {
    title: "Management",
    keys: ["dashboard", "restaurant"] as PermissionKey[],
  },
  {
    title: "Service Operations",
    keys: ["order", "table", "menu"] as PermissionKey[],
  },
  {
    title: "Inventory",
    keys: ["stock"] as PermissionKey[],
  },
];

const permissionLabels: Record<PermissionKey, string> = {
  dashboard: "Dashboard Access",
  restaurant: "Restaurant Settings",
  order: "Order Management",
  table: "Table Management",
  menu: "Menu Editing",
  stock: "Stock Control",
};

export const ManageEmployeesView = () => {
  const [addingStaff, setAddingStaff] = useState<Employee | null>(null);
  const [editingStaff, setEditingStaff] = useState<Employee | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<Employee | null>(null);
  
  const [isFormEmpty, setIsFormEmpty] = useState<boolean>(true);
  const [showConfirmAddStaff, setShowConfirmAddStaff] = useState<boolean>(false);
  const [showConfirmEditStaff, setShowConfirmEditStaff] = useState<boolean>(false);
  const [showConfirmDeleteStaff, setShowConfirmDeleteStaff] = useState<boolean>(false);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Overlay state
  const isEditing = editingStaff !== null;

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    role: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => {
        const newState = {
            ...prevState,
            [id]: value,
        };
        // Check validity ideally here or in useEffect, simplified for now
        const isEmpty = newState.firstName === "" || newState.lastName === "" || newState.role === "" || newState.password === "";
        setIsFormEmpty(isEmpty);
        return newState;
    });
  };

  const handleAddEmployee = () => {
    // TODO: ดึง role default permissions จาก database
    const defaultPermissions: Record<PermissionKey, boolean> = {
      dashboard: false,
      order: true,
      table: true,
      stock: false,
      menu: false,
      restaurant: false,
    }

    const staff: Employee = {
      id: 999, // Should be generated
      name: formData.firstName + " " + formData.lastName,
      role: formData.role,
      permissions: defaultPermissions,
    };

    setAddingStaff(staff)
    
    if (isEditing) {
        setShowConfirmEditStaff(true);
    } else {
        setShowConfirmAddStaff(true);
    }
  };

  const handleStaffEdit = (staff: Employee) => {
    // Enter Edit Mode
    setEditingStaff(staff);
    
    // Split name for form
    const [firstName, ...rest] = staff.name.split(" ");
    const lastName = rest.join(" ");

    setFormData({
        firstName: firstName || "",
        lastName: lastName || "",
        role: staff.role,
        password: "dummy-password", // We usually don't show real password
    });
    setIsFormEmpty(false);
  };

  const handleStaffDelete = (staff: Employee) => {
    setDeletingStaff(staff);
    setShowConfirmDeleteStaff(true);
  };

  const handleAddEmployeeConfirm = () => {
    console.log("Add Staff");
    // TODO: Add staff to database
    setShowConfirmAddStaff(false);
    handleCancel();
  };

  const handleEditStaffConfirm = () => {
    console.log("Edit Staff");
    // TODO: Update staff in database
    setShowConfirmEditStaff(false);
    handleCancel();
  };

  const handleDeleteStaffConfirm = () => {
    console.log("Delete Staff");
    // TODO: Delete staff from database
    setShowConfirmDeleteStaff(false);
    if (deletingStaff?.id === editingStaff?.id) {
        handleCancel();
    }
    handleCancel();
  };

  const handleCancel = () => {
    setEditingStaff(null);
    setAddingStaff(null);
    setDeletingStaff(null);
    setFormData({ firstName: '', lastName: '', role: '', password: '' });
    setIsFormEmpty(true);
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-0">
        {/* Add/Edit User Form */}
        <div className={`lg:col-span-1 transition-all duration-300 ${isEditing ? 'z-50 relative' : ''}`}>
          <Card className="shadow-lg sticky top-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{isEditing ? `Edit User: ${editingStaff?.name}` : "Add New User"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  placeholder="Enter first name" 
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  placeholder="Enter last name" 
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input 
                  id="role" 
                  placeholder="e.g., Waiter, Cashier" 
                  value={formData.role}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-5">
              <Button 
                disabled={isFormEmpty}
                onClick={handleAddEmployee}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-40 disabled:text-white cursor-pointer"
              >
                {isEditing ? "Save Changes" : "Add"}
              </Button>
              <p
                onClick={handleCancel}
                className="h-8 px-2 text-gray-500 cursor-pointer"
                >Cancel</p>
            </CardFooter>
          </Card>
        </div>

        {/* Employees List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row md:justify-end gap-4 mb-6">
            <EmployeeSearchBar 
                searchTerm={searchTerm} 
                onSearchChange={setSearchTerm} 
            />
            <div className="w-full md:w-[200px]">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full rounded-xl border-gray-300 bg-white text-base">
                    <SelectValue placeholder="Filter by Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Roles</SelectItem>
                    {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
          </div>

          {employees
            .filter((employee) => {
                const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesRole = roleFilter === "All" || employee.role === roleFilter;
                return matchesSearch && matchesRole;
            })
            .map((employee, index) => {
             const isFocused = editingStaff?.id === employee.id;
             return (
                <div key={index} className={`transition-all duration-300 ${isFocused ? 'z-50 relative scale-105' : ''}`}>
                    <EmployeeCard
                        employee={employee}
                        handleStaffEdit={handleStaffEdit}
                        handleStaffDelete={handleStaffDelete}
                        handleCancel={handleCancel}
                        isEditing={isFocused}
                    />
                </div>
             )
          })}
        </div>

        {showConfirmAddStaff && addingStaff && (
          <ConfirmModalComponent
            confirmType={ConfirmTypeEnum.AddEmployee}
            itemName={addingStaff?.name}
            onConfirm={handleAddEmployeeConfirm}
            onCancel={() => setShowConfirmAddStaff(false)}
          />
        )}

        {showConfirmEditStaff && editingStaff && (
          <ConfirmModalComponent
            confirmType={ConfirmTypeEnum.EditEmployee}
            itemName={editingStaff?.name}
            onConfirm={handleEditStaffConfirm}
            onCancel={() => setShowConfirmEditStaff(false)}
          />
        )}

        {showConfirmDeleteStaff && deletingStaff && (
          <ConfirmModalComponent
            confirmType={ConfirmTypeEnum.DeleteEmployee}
            itemName={deletingStaff?.name}
            onConfirm={handleDeleteStaffConfirm}
            onCancel={() => setShowConfirmDeleteStaff(false)}
          />
        )}
      </div>
    </div>
  );
};


// Sub-component for individual employee card
const EmployeeCard = ({ employee, handleStaffEdit, handleStaffDelete, handleCancel, isEditing }: { employee: Employee, handleStaffEdit: (staff: Employee) => void, handleStaffDelete: (staff: Employee) => void, handleCancel: () => void, isEditing: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [staff, setStaff] = useState(employee);

  const handleEdit = () => {
    handleStaffEdit(staff);
  };

  const handleDelete = () => {
    handleStaffDelete(staff);
  };

  const onPermissionChange = (permissionKey: PermissionKey, value: boolean) => {
    // ต่อ database
    setStaff({
      ...staff,
      permissions: {
        ...staff.permissions,
        [permissionKey]: value,
      },
    });
  };

  const onPermissionAllCheck = (permissionKeys: PermissionKey[], value: boolean) => {
    // ต่อ database
    setStaff({
      ...staff,
      permissions: {
        ...staff.permissions,
        ...permissionKeys.reduce((acc, key) => {
          acc[key] = value;
          return acc;
        }, {} as Record<PermissionKey, boolean>),
      },
    });
  };

  return (
    <Card className={`shadow-lg overflow-hidden border-none ring-1 ring-gray-100 ${isEditing ? 'ring-2 ring-orange-500 shadow-xl' : ''}`}>
      <div className="p-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{employee.name}</h3>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                employee.role === "Manager"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {employee.role}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            className="h-8 w-8 p-0 bg-transparent hover:bg-gray-100 text-gray-500 shadow-none border-none"
            variant="outline" /* Using outline variant as base but overriding styles */
            onClick={isEditing ? handleCancel : handleEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            className="h-8 w-8 p-0 bg-transparent hover:bg-red-50 text-red-500 hover:text-red-600 shadow-none border-none"
            variant="outline"
            onClick={handleDelete}
            hidden={employee.role === "Manager"}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            className="h-8 w-8 p-0 bg-transparent hover:bg-gray-100 text-gray-400 shadow-none border-none"
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-gray-50 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
          <div className="p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 px-2">
              Feature Settings
            </h4>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-100/50 px-4 py-2 border-b border-gray-200 flex justify-between items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span>Feature</span>
                <span>Access</span>
              </div>
              <div className="divide-y divide-gray-100">
                {permissionGroups.map((group) => (
                  <PermissionGroup
                    key={group.title}
                    group={group}
                    permissions={staff.permissions}
                    onPermissionChange={onPermissionChange}
                    onPermissionAllCheck={onPermissionAllCheck}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

const PermissionGroup = ({
  group,
  permissions,
  onPermissionChange,
  onPermissionAllCheck
}: {
  group: { title: string; keys: PermissionKey[] };
  permissions: Record<PermissionKey, boolean>;
  onPermissionChange: (key: PermissionKey, value: boolean) => void;
  onPermissionAllCheck: (permissionKeys: PermissionKey[], value: boolean) => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // Check if all permissions in this group are true
  const allChecked = group.keys.every((k) => permissions[k]);

  return (
    <div>
      <div
        className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {group.title}
          </span>
        </div>
        <Checkbox
          checked={allChecked}
          className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
          onCheckedChange={(value) => onPermissionAllCheck(group.keys, Boolean(value))}
        />
      </div>
      {isOpen && (
        <div className="bg-gray-50/50">
          {group.keys.map((key) => (
            <div
              key={key}
              className="flex items-center justify-between pl-10 pr-4 py-2 hover:bg-gray-50"
            >
              <span className="text-sm text-gray-600">
                {permissionLabels[key]}
              </span>
              <Checkbox
                checked={permissions[key]}
                className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                onCheckedChange={(value) => onPermissionChange(key, Boolean(value))}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
