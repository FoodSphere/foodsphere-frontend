// src/components/restaurant/ManageEmployeesView.tsx
import React, { useEffect, useState } from "react";
import {
  Loader2,
  Pencil,
  Trash2,
  UserPlus,
  QrCode as QrCodeIcon,
  X,
} from "lucide-react";

import { ConfirmModalComponent } from "@/app/components/featureComponents/ConfirmModalComponent";
import { QrCode as QrCodeComponent } from "@/app/components/featureComponents/QrCode";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
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
import { getRoles } from "@/services/role/roleApi";
import {
  createStaff,
  deleteStaff,
  getStaffs,
  updateStaff,
} from "@/services/staff/staffApi";
import { IRoleMap, IRoleResponse, IRoleWithId } from "@/types/roleType";
import {
  IStaff,
  IStaffResponse,
  IStaffWithId,
  IStaffWithMappedRole,
} from "@/types/staffType";
import {
  createStaff,
  createStaffPortal,
  deleteStaff,
  getStaffs,
  updateStaff,
} from "@/services/staff/staffApi";
import { getRoles } from "@/services/role/roleApi";
import { toast } from "@/app/components/ui/toast/use-toast";

interface FormData {
  name: string;
  roles: number[];
  phone: string;
}

export const ManageEmployeesView = () => {
  const [roles, setRoles] = useState<IRoleMap>({});
  const [staffs, setStaffs] = useState<IStaffWithMappedRole[]>([]);
  const [addingStaff, setAddingStaff] = useState<IStaff | null>(null);
  const [editingStaff, setEditingStaff] = useState<IStaffWithId | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<IStaffWithId | null>(null);
  const [showQRForStaff, setShowQRForStaff] = useState<IStaffWithId | null>(
    null
  );
  const [qrUrlForStaff, setQrUrlForStaff] = useState<string | null>(null);

  const [isStaffLoading, setIsStaffLoading] = useState<boolean>(true);
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
    name: "",
    roles: [],
    phone: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => {
      const newState = {
        ...prevState,
        [id]: value,
      };
      const isEmpty = newState.name === "" || newState.roles.length === 0;
      setIsFormEmpty(isEmpty);
      return newState;
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevState) => {
      const newState = {
        ...prevState,
        roles: [parseInt(value)],
      };
      const isEmpty = newState.name === "" || newState.roles.length === 0;
      setIsFormEmpty(isEmpty);
      return newState;
    });
  };

  const handleAddEmployee = () => {
    const staff: IStaff = {
      name: formData.name,
      roles: formData.roles,
      phone: formData.phone,
    };

    setAddingStaff(staff);

    if (isEditing) {
      setShowConfirmEditStaff(true);
    } else {
      setShowConfirmAddStaff(true);
    }
  };

  const handleStaffEdit = (staff: IStaffWithId) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name || "",
      roles: staff.roles,
      phone: staff.phone,
    });
    setIsFormEmpty(false);
  };

  const handleStaffDelete = (staff: IStaffWithId) => {
    setDeletingStaff(staff);
    setShowConfirmDeleteStaff(true);
  };

  const handleShowQR = async (staff: IStaffWithId) => {
    const res = await createStaffPortal(staff.id);
    if (res && res.data && res.data.id) {
      const portalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/worker-portal/${res.data.id}`;
      setQrUrlForStaff(portalUrl);
      setShowQRForStaff(staff);
      console.log(portalUrl);
    } else {
      toast({
        title: "Failed to create staff portal",
        variant: "error",
      });
    }
  };

  const handleAddEmployeeConfirm = async () => {
    console.log("Add Staff");
    if (addingStaff) {
      await createStaff(addingStaff);
    }
    setShowConfirmAddStaff(false);
    handleCancel();
    await fetchStaffData();
  };

  const handleEditStaffConfirm = async () => {
    console.log("Edit Staff");
    if (editingStaff?.id) {
      await updateStaff(editingStaff.id, formData);
    }
    setShowConfirmEditStaff(false);
    handleCancel();
    await fetchStaffData();
  };

  const handleDeleteStaffConfirm = async () => {
    console.log("Delete Staff");
    if (deletingStaff?.id) {
      await deleteStaff(deletingStaff.id);
    }
    setShowConfirmDeleteStaff(false);
    handleCancel();
    await fetchStaffData();
  };

  const handleCancel = () => {
    setEditingStaff(null);
    setAddingStaff(null);
    setDeletingStaff(null);
    setShowQRForStaff(null);
    setFormData({ name: "", roles: [], phone: "" });
    setIsFormEmpty(true);
  };

  const fetchStaffData = async () => {
    try {
      const res = await getStaffs();

      if (res && res.data && Array.isArray(res.data)) {
        const apiData: IStaffResponse[] = res.data;
        const currentRoles = await fetchRolesData();

        // แปลงข้อมูลจาก API ให้เข้ากับหน้าบ้าน (UI)
        const mappedStaffs: IStaffWithMappedRole[] = apiData.map((item) => ({
          id: item.id,
          name: item.name,
          roles: item.roles,
          role_name: currentRoles[item.roles[0]] || "Unknown",
          phone: item.phone,
        }));
        setStaffs(mappedStaffs);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const fetchRolesData = async (): Promise<IRoleMap> => {
    try {
      const res = await getRoles();

      if (res && res.data && Array.isArray(res.data)) {
        const apiData: IRoleResponse[] = res.data;
        // แปลงข้อมูลจาก API ให้เข้ากับหน้าบ้าน (UI)
        const mappedRoles: IRoleMap = apiData.reduce((acc, item) => {
          acc[item.id] = item.name;
          return acc;
        }, {} as IRoleMap);
        setRoles(mappedRoles);
        return mappedRoles;
      }
      return {};
    } catch (error) {
      console.error("Error fetching roles:", error);
      return {};
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsStaffLoading(true);
      await fetchStaffData();
      setIsStaffLoading(false);
    };
    init();
  }, []);

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
                    htmlFor="name"
                    className="text-gray-600 font-semibold ml-1"
                  >
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter staff name"
                    value={formData.name}
                    onChange={handleInputChange}
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
                  <Select
                    value={formData.roles[0]?.toString() || ""}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger
                      className={`h-12 w-full rounded-xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-[#FF5C39] px-8 text-base ${formData.roles.length === 0 ? "text-gray-400" : "text-gray-900"}`}
                    >
                      <SelectValue placeholder="Select staff role" />
                    </SelectTrigger>
                    <SelectContent className="w-full bg-white">
                      {Object.entries(roles).map(([role_id, role_name]) => (
                        <SelectItem key={role_id} value={role_id}>
                          {role_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <Button
                  disabled={isFormEmpty}
                  onClick={handleAddEmployee}
                  className="w-full h-12 rounded-xl bg-[#FF5C39] hover:bg-orange-600 text-white text-lg font-bold shadow-md disabled:opacity-50 disabled:text-white cursor-pointer transition-transform active:scale-95"
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
              <SearchBar
                placeholder="Search staff name..."
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
                  {Object.entries(roles).map(([role_id, role_name]) => (
                    <SelectItem
                      key={role_id}
                      value={role_id}
                      className="cursor-pointer hover:bg-orange-50 focus:bg-orange-50"
                    >
                      {role_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cards Grid */}
          {/* ใช้ z-0 ปกติ เพื่อให้อยู่ใต้ Search Bar (ที่เป็น z-20) */}
          <div className="grid grid-cols-1 gap-4 relative">
            {isStaffLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              staffs
                .filter((staff) => {
                  const matchesSearch = staff.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                  const matchesRole =
                    roleFilter === "All" ||
                    staff.roles[0]?.toString() === roleFilter;
                  return matchesSearch && matchesRole;
                })
                .map((staff, index) => {
                  const isFocused = editingStaff?.id === staff.id;
                  return (
                    <div
                      key={index}
                      // แก้ไข 1: ถ้าถูก Focus ให้ใช้ z-30 และ relative เพื่อลอยเหนือ Overlay
                      className={`transition-all duration-300 ${isFocused ? "z-30 relative scale-[1.02]" : "hover:translate-x-1"}`}
                    >
                      <StaffCard
                        staff={staff}
                        handleStaffEdit={handleStaffEdit}
                        handleStaffDelete={handleStaffDelete}
                        handleShowQR={handleShowQR}
                        handleCancel={handleCancel}
                        isEditing={isFocused}
                      />
                    </div>
                  );
                })
            )}
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

        {/* QR POS Modal */}
        {showQRForStaff && qrUrlForStaff && (
          <QrModal
            staffName={showQRForStaff.name}
            qrUrl={qrUrlForStaff}
            onClose={() => {
              setShowQRForStaff(null);
              setQrUrlForStaff(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

const StaffCard = ({
  staff,
  handleStaffEdit,
  handleStaffDelete,
  handleShowQR,
  handleCancel,
  isEditing,
}: {
  staff: IStaffWithMappedRole;
  handleStaffEdit: (staff: IStaffWithId) => void;
  handleStaffDelete: (staff: IStaffWithId) => void;
  handleShowQR: (staff: IStaffWithId) => void;
  handleCancel: () => void;
  isEditing: boolean;
}) => {
  const handleEdit = () => {
    handleStaffEdit(staff);
  };

  const handleDelete = () => {
    handleStaffDelete(staff);
  };

  const handleQR = () => {
    handleShowQR(staff);
  };

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
              staff.role_name === "Manager" ? "bg-[#FF5C39]" : "bg-gray-400"
            }`}
          >
            {staff.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {staff.name}
            </h3>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border mt-1 inline-block ${getRoleBadgeColor(staff.role_name)}`}
            >
              {staff.role_name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full hover:bg-orange-50 hover:text-[#FF5C39] cursor-pointer"
                onClick={handleEdit}
              >
                <Pencil className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full hover:bg-orange-50 hover:text-[#FF5C39] cursor-pointer"
                onClick={handleQR}
              >
                <QrCodeIcon className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10 rounded-full hover:bg-red-50 hover:text-red-500 cursor-pointer"
                onClick={handleDelete}
                disabled={staff.role_name === "Manager"}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

const QrModal = ({
  staffName,
  qrUrl,
  onClose,
}: {
  staffName: string;
  qrUrl: string | null;
  onClose: () => void;
}) => {
  if (!qrUrl) {
    return null;
  }
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] w-full max-w-[400px] p-6 relative flex flex-col items-center shadow-2xl animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
          <QrCodeIcon className="w-6 h-6 text-[#FF5C39]" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">POS Access QR</h3>
        <p className="text-gray-500 mb-6 text-center text-sm">
          Scan this QR code to access the POS system as{" "}
          <span className="font-semibold text-gray-900">{staffName}</span>
        </p>

        <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100 shadow-inner">
          <QrCodeComponent data={qrUrl} width={220} />
        </div>

        <Button
          onClick={onClose}
          className="w-full h-12 rounded-xl bg-[#FF5C39] hover:bg-orange-600 text-white font-bold text-lg shadow-md transition-transform active:scale-95"
        >
          Done
        </Button>
      </div>
    </div>
  );
};
