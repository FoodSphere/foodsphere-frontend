// src/components/restaurant/ManageEmployeesView.tsx
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Shield,
  Trash2,
  UserPlus,
} from "lucide-react";

import { ConfirmModalComponent } from "@/app/components/featureComponents/ConfirmModalComponent";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { ConfirmTypeEnum } from "@/public/enum/confirmModalEnum";

import { EmployeeSearchBar } from "./EmployeeSearchBar";

// Types (คงเดิม)
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

// Mock Data (คงเดิม)
const roles: Role[] = [
  { id: 1, name: "Manager" },
  { id: 2, name: "Cashier" },
  { id: 3, name: "Waiter" },
];

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
  const [showConfirmAddStaff, setShowConfirmAddStaff] =
    useState<boolean>(false);
  const [showConfirmEditStaff, setShowConfirmEditStaff] =
    useState<boolean>(false);
  const [showConfirmDeleteStaff, setShowConfirmDeleteStaff] =
    useState<boolean>(false);

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
      const isEmpty =
        newState.firstName === "" ||
        newState.lastName === "" ||
        newState.role === "" ||
        newState.password === "";
      setIsFormEmpty(isEmpty);
      return newState;
    });
  };

  const handleAddEmployee = () => {
    const defaultPermissions: Record<PermissionKey, boolean> = {
      dashboard: false,
      order: true,
      table: true,
      stock: false,
      menu: false,
      restaurant: false,
    };

    const staff: Employee = {
      id: 999, // Should be generated
      name: formData.firstName + " " + formData.lastName,
      role: formData.role,
      permissions: defaultPermissions,
    };

    setAddingStaff(staff);

    if (isEditing) {
      setShowConfirmEditStaff(true);
    } else {
      setShowConfirmAddStaff(true);
    }
  };

  const handleStaffEdit = (staff: Employee) => {
    setEditingStaff(staff);
    const [firstName, ...rest] = staff.name.split(" ");
    const lastName = rest.join(" ");

    setFormData({
      firstName: firstName || "",
      lastName: lastName || "",
      role: staff.role,
      password: "dummy-password",
    });
    setIsFormEmpty(false);
  };

  const handleStaffDelete = (staff: Employee) => {
    setDeletingStaff(staff);
    setShowConfirmDeleteStaff(true);
  };

  const handleAddEmployeeConfirm = () => {
    console.log("Add Staff");
    setShowConfirmAddStaff(false);
    handleCancel();
  };

  const handleEditStaffConfirm = () => {
    console.log("Edit Staff");
    setShowConfirmEditStaff(false);
    handleCancel();
  };

  const handleDeleteStaffConfirm = () => {
    console.log("Delete Staff");
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
    setFormData({ firstName: "", lastName: "", role: "", password: "" });
    setIsFormEmpty(true);
  };

  return (
    <div className="w-full bg-[#D9D9D9] rounded-[48px] p-8 shadow-sm relative min-h-[600px] isolate">
      {/* Overlay Background - ใช้ z-10 เพื่อบังทุกอย่างที่ไม่ได้ active */}
      {isEditing && (
        <div
          className="absolute inset-0 bg-black/20 rounded-[48px] z-10 transition-all duration-300 backdrop-blur-[1px]"
          onClick={handleCancel}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        {/* Left Column: Add/Edit Form */}
        {/* แก้ไข 1: เพิ่ม z-30 และ relative เมื่อ editing เพื่อให้ลอยเหนือ Overlay */}
        <div
          className={`lg:col-span-4 transition-all duration-300 ${isEditing ? "z-30 relative" : "z-0"}`}
        >
          <div className="sticky top-8 space-y-4">
            <div
              className={`bg-white rounded-[32px] p-8 shadow-lg space-y-6 transition-all duration-300 ${isEditing ? "ring-4 ring-[#FF5C39]/20 shadow-2xl" : ""}`}
            >
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                <div
                  className={`p-3 rounded-full ${isEditing ? "bg-orange-100" : "bg-gray-100"}`}
                >
                  {isEditing ? (
                    <Pencil className="w-6 h-6 text-[#FF5C39]" />
                  ) : (
                    <UserPlus className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEditing ? "Edit Profile" : "New Staff"}
                </h2>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-gray-600 font-semibold ml-1"
                  >
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="e.g. John"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="h-12 rounded-xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-[#FF5C39] px-4 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-gray-600 font-semibold ml-1"
                  >
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="e.g. Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="h-12 rounded-xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-[#FF5C39] px-4 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="role"
                    className="text-gray-600 font-semibold ml-1"
                  >
                    Role
                  </Label>
                  <Input
                    id="role"
                    placeholder="e.g. Waiter"
                    value={formData.role}
                    onChange={handleChange}
                    className="h-12 rounded-xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-[#FF5C39] px-4 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-600 font-semibold ml-1"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="h-12 rounded-xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-[#FF5C39] px-4 text-base"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <Button
                  disabled={isFormEmpty}
                  onClick={handleAddEmployee}
                  className="w-full h-12 rounded-xl bg-[#FF5C39] hover:bg-orange-600 text-white text-lg font-bold shadow-md disabled:opacity-50 transition-transform active:scale-95"
                >
                  {isEditing ? "Save Changes" : "Create Account"}
                </Button>

                {isEditing && (
                  <Button
                    variant="ghost"
                    onClick={handleCancel}
                    className="w-full h-12 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 font-semibold"
                  >
                    Cancel Editing
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Employees List */}
        <div className="lg:col-span-8 space-y-6">
          {/* Search & Filter Header */}
          {/* แก้ไข 2: เพิ่ม z-20 และ relative เพื่อให้ Dropdown อยู่เหนือรายการ Cards ด้านล่าง */}
          <div className="relative z-20 flex flex-col md:flex-row gap-4 bg-white/50 p-4 rounded-[24px] backdrop-blur-sm shadow-sm">
            <div className="flex-1">
              <EmployeeSearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>
            <div className="w-full md:w-[220px]">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full h-12 rounded-xl border-none bg-white text-base shadow-sm focus:ring-[#FF5C39]">
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                {/* แก้ไข 2 (ต่อ): เพิ่ม className bg-white เพื่อให้พื้นหลังทึบไม่โปร่งแสง */}
                <SelectContent className="bg-white rounded-xl border-gray-100 shadow-xl">
                  <SelectItem
                    value="All"
                    className="cursor-pointer hover:bg-orange-50 focus:bg-orange-50"
                  >
                    All Roles
                  </SelectItem>
                  {roles.map((role) => (
                    <SelectItem
                      key={role.id}
                      value={role.name}
                      className="cursor-pointer hover:bg-orange-50 focus:bg-orange-50"
                    >
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cards Grid */}
          {/* ใช้ z-0 ปกติ เพื่อให้อยู่ใต้ Search Bar (ที่เป็น z-20) */}
          <div className="grid grid-cols-1 gap-4 relative z-0">
            {employees
              .filter((employee) => {
                const matchesSearch = employee.name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase());
                const matchesRole =
                  roleFilter === "All" || employee.role === roleFilter;
                return matchesSearch && matchesRole;
              })
              .map((employee, index) => {
                const isFocused = editingStaff?.id === employee.id;
                return (
                  <div
                    key={index}
                    // แก้ไข 1: ถ้าถูก Focus ให้ใช้ z-30 และ relative เพื่อลอยเหนือ Overlay
                    className={`transition-all duration-300 ${isFocused ? "z-30 relative scale-[1.02]" : "hover:translate-x-1"}`}
                  >
                    <EmployeeCard
                      employee={employee}
                      handleStaffEdit={handleStaffEdit}
                      handleStaffDelete={handleStaffDelete}
                      handleCancel={handleCancel}
                      isEditing={isFocused}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        {/* Confirm Modals - พวกนี้มักจะมี Portal ของตัวเอง หรือ z-index สูงอยู่แล้ว */}
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

// ... (ส่วน EmployeeCard และ PermissionGroup ใช้โค้ดเดิมได้เลยครับ ไม่ต้องแก้เพราะ Logic อยู่ที่ Container หลักแล้ว) ...
// แต่เพื่อความชัวร์ ผมใส่ EmployeeCard ไว้ให้ครบชุดด้านล่างครับ

const EmployeeCard = ({
  employee,
  handleStaffEdit,
  handleStaffDelete,
  handleCancel,
  isEditing,
}: {
  employee: Employee;
  handleStaffEdit: (staff: Employee) => void;
  handleStaffDelete: (staff: Employee) => void;
  handleCancel: () => void;
  isEditing: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [staff, setStaff] = useState(employee);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Manager":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Cashier":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleEdit = () => {
    handleStaffEdit(staff);
  };

  const handleDelete = () => {
    handleStaffDelete(staff);
  };

  const onPermissionChange = (permissionKey: PermissionKey, value: boolean) => {
    setStaff({
      ...staff,
      permissions: {
        ...staff.permissions,
        [permissionKey]: value,
      },
    });
  };

  const onPermissionAllCheck = (
    permissionKeys: PermissionKey[],
    value: boolean
  ) => {
    setStaff({
      ...staff,
      permissions: {
        ...staff.permissions,
        ...permissionKeys.reduce(
          (acc, key) => {
            acc[key] = value;
            return acc;
          },
          {} as Record<PermissionKey, boolean>
        ),
      },
    });
  };

  return (
    <Card
      className={`rounded-[24px] overflow-hidden border-none transition-all duration-300 ${
        isEditing
          ? "ring-4 ring-[#FF5C39] shadow-2xl bg-white scale-[1.01]" // เพิ่ม shadow และ ring ให้ชัดตอน edit
          : "shadow-sm hover:shadow-md bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-sm ${
              employee.role === "Manager" ? "bg-[#FF5C39]" : "bg-gray-400"
            }`}
          >
            {employee.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {employee.name}
            </h3>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border mt-1 inline-block ${getRoleBadgeColor(employee.role)}`}
            >
              {employee.role}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full hover:bg-orange-50 hover:text-[#FF5C39]"
                onClick={handleEdit}
              >
                <Pencil className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full hover:bg-red-50 hover:text-red-500"
                onClick={handleDelete}
                disabled={employee.role === "Manager"}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </>
          )}

          <Button
            variant="secondary"
            className={`h-10 px-4 rounded-xl gap-2 font-semibold transition-colors ${isExpanded ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"}`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Permissions</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-gray-50/80 border-t border-gray-100 p-5 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {permissionGroups.map((group) => (
              <div
                key={group.title}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <PermissionGroup
                  group={group}
                  permissions={staff.permissions}
                  onPermissionChange={onPermissionChange}
                  onPermissionAllCheck={onPermissionAllCheck}
                />
              </div>
            ))}
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
  onPermissionAllCheck,
}: {
  group: { title: string; keys: PermissionKey[] };
  permissions: Record<PermissionKey, boolean>;
  onPermissionChange: (key: PermissionKey, value: boolean) => void;
  onPermissionAllCheck: (
    permissionKeys: PermissionKey[],
    value: boolean
  ) => void;
}) => {
  const allChecked = group.keys.every((k) => permissions[k]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <h4 className="font-bold text-sm text-gray-700">{group.title}</h4>
        <Checkbox
          checked={allChecked}
          className="h-5 w-5 rounded-md border-gray-300 data-[state=checked]:bg-[#FF5C39] data-[state=checked]:border-[#FF5C39]"
          onCheckedChange={(value) =>
            onPermissionAllCheck(group.keys, Boolean(value))
          }
        />
      </div>
      <div className="space-y-2">
        {group.keys.map((key) => (
          <div key={key} className="flex items-center justify-between group">
            <span className="text-sm text-gray-500 group-hover:text-gray-800 transition-colors">
              {permissionLabels[key]}
            </span>
            <Checkbox
              checked={permissions[key]}
              className="h-4 w-4 rounded border-gray-300 data-[state=checked]:bg-[#FF5C39] data-[state=checked]:border-[#FF5C39]"
              onCheckedChange={(value) =>
                onPermissionChange(key, Boolean(value))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};
