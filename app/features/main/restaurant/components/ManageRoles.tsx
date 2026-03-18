// src/components/restaurant/ManageRoleView.tsx
import { useEffect, useState } from "react";
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
import {
  getPermissions,
  getPermissionsGroupName,
  updateRolePermission,
} from "@/services/role/permissionApi";
import {
  createRole,
  deleteRole,
  getRoles,
  updateRole,
} from "@/services/role/roleApi";
import {
  IPermissionResponse,
  IPermissionsGroup,
  IRole,
  IRoleResponse,
  IRoleWithId,
} from "@/types/roleType";

import { SearchBar } from "./SearchBar";

interface FormData {
  name: string;
  description: string;
  permission_ids: number[];
}

// Permission Group each Page
const PAGE_PERMISSIONS: Record<string, Set<number>> = {
  dashboard: new Set([8000]),
  order: new Set([1, 7020, 7030]),
  table: new Set([2, 6000, 6010, 7000, 7010, 7020, 7030]),
  stock: new Set([2000, 2010, 2020, 5000, 5010]),
  menu: new Set([3000, 3010, 5000, 2010]),
  restaurant: new Set([1000, 1010, 4000, 4010, 9000, 9010, 9020, 9030]),
};

export const ManageRolesView = () => {
  const [roles, setRoles] = useState<IRoleWithId[]>([]);

  const [addingRole, setAddingRole] = useState<IRole | null>(null);
  const [editingRole, setEditingRole] = useState<IRoleWithId | null>(null);
  const [deletingRole, setDeletingRole] = useState<IRoleWithId | null>(null);

  const [rolesPageMap, setRolesPageMap] = useState<
    Record<string, Record<string, boolean>>
  >({});

  const [isFormEmpty, setIsFormEmpty] = useState<boolean>(true);
  const [showConfirmAddRole, setShowConfirmAddRole] = useState<boolean>(false);
  const [showConfirmEditRole, setShowConfirmEditRole] =
    useState<boolean>(false);
  const [showConfirmDeleteRole, setShowConfirmDeleteRole] =
    useState<boolean>(false);

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Overlay state
  const isEditing = editingRole !== null;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    permission_ids: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => {
      const newState = {
        ...prevState,
        [id]: value,
      };
      const isEmpty = newState.name === "";
      setIsFormEmpty(isEmpty);
      return newState;
    });
  };

  const handleAddRole = () => {
    const role: IRole = {
      name: formData.name,
      description: formData.description,
      permission_ids: formData.permission_ids,
    };

    setAddingRole(role);

    if (isEditing) {
      setShowConfirmEditRole(true);
    } else {
      setShowConfirmAddRole(true);
    }
  };

  const handleRoleEdit = (role: IRoleWithId) => {
    setEditingRole(role);
    setFormData({
      name: role.name || "",
      description: role.description || "",
      permission_ids: role.permission_ids,
    });
    setIsFormEmpty(false);
  };

  const handleRoleDelete = (role: IRoleWithId) => {
    setDeletingRole(role);
    setShowConfirmDeleteRole(true);
  };

  const handleAddRoleConfirm = async () => {
    console.log("Add Role");
    await createRole(formData);
    setShowConfirmAddRole(false);
    handleCancel();
    fetchRolesData();
  };

  const handleEditRoleConfirm = async () => {
    console.log("Edit Role");
    if (editingRole) {
      await updateRole(editingRole.id, formData);
      await updateRolePermission(editingRole.id, formData.permission_ids);
    }
    setShowConfirmEditRole(false);
    handleCancel();
    fetchRolesData();
  };

  const handleDeleteRoleConfirm = async () => {
    console.log("Delete Role", deletingRole);

    if (deletingRole && deletingRole.id) {
      await deleteRole(deletingRole.id);
    }
    setShowConfirmDeleteRole(false);
    handleCancel();
    fetchRolesData();
  };

  const handleCancel = () => {
    setEditingRole(null);
    setAddingRole(null);
    setDeletingRole(null);
    setFormData({ name: "", description: "", permission_ids: [] });
    setIsFormEmpty(true);
  };

  const fetchRolesData = async () => {
    try {
      const res = await getRoles();

      if (res && res.data && Array.isArray(res.data)) {
        const apiData: IRoleResponse[] = res.data;

        // แปลงข้อมูลจาก API ให้เข้ากับหน้าบ้าน (UI)
        const mappedRoles: IRoleWithId[] = apiData.map((item) => ({
          id: item.id,
          name: item.name === "" ? "Unknown" : item.name,
          description: item.description,
          permission_ids: item.permission_ids,
        }));

        setRoles(mappedRoles);

        const rolesPageMap: Record<string, Record<string, boolean>> = {};
        mappedRoles.forEach((role) => {
          let rolePermissionSet = new Set(role.permission_ids);
          const page_map: Record<string, boolean> = Object.fromEntries(
            Object.entries(PAGE_PERMISSIONS).map(([k, v]) => [
              k,
              rolePermissionSet.isSupersetOf(v),
            ])
          );
          rolesPageMap[role.id] = page_map;
        });
        setRolesPageMap(rolesPageMap);
        console.log(rolesPageMap);
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  // --- API Fetching ---
  useEffect(() => {
    fetchRolesData();
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
                  {isEditing ? "Edit Role" : "New Role"}
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
                    placeholder="Enter role name"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-12 rounded-xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-[#FF5C39] px-4 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-gray-600 font-semibold ml-1"
                  >
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="Enter role description"
                    value={formData.description}
                    onChange={handleChange}
                    className="h-12 rounded-xl bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-[#FF5C39] px-4 text-base"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <Button
                  disabled={isFormEmpty}
                  onClick={handleAddRole}
                  className="w-full h-12 rounded-xl bg-[#FF5C39] hover:bg-orange-600 text-white text-lg font-bold shadow-md disabled:opacity-50 disabled:text-white transition-transform active:scale-95"
                >
                  {isEditing ? "Save Changes" : "Create Role"}
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
                placeholder="Search role name..."
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
          <div className="grid grid-cols-1 gap-4 relative">
            {roles
              .filter((role) => {
                const matchesSearch = role.name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase());
                const matchesRole =
                  roleFilter === "All" || role.name === roleFilter;
                return matchesSearch && matchesRole;
              })
              .map((role, index) => {
                const isFocused = editingRole?.id === role.id;
                return (
                  <div
                    key={index}
                    // แก้ไข 1: ถ้าถูก Focus ให้ใช้ z-30 และ relative เพื่อลอยเหนือ Overlay
                    className={`transition-all duration-300 ${isFocused ? "z-30 relative scale-[1.02]" : "hover:translate-x-1"}`}
                  >
                    <RoleCard
                      role={role}
                      handleRoleEdit={handleRoleEdit}
                      handleRoleDelete={handleRoleDelete}
                      isEditing={isFocused}
                      rolesPageMap={rolesPageMap}
                      onPermissionsUpdate={(permission_ids) => {
                        setFormData((prev) => ({
                          ...prev,
                          permission_ids: permission_ids,
                        }));
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </div>

        {/* Confirm Modals - พวกนี้มักจะมี Portal ของตัวเอง หรือ z-index สูงอยู่แล้ว */}
        {showConfirmAddRole && addingRole && (
          <ConfirmModalComponent
            confirmType={ConfirmTypeEnum.AddRole}
            itemName={addingRole?.name}
            onConfirm={handleAddRoleConfirm}
            onCancel={() => setShowConfirmAddRole(false)}
          />
        )}
        {showConfirmEditRole && editingRole && (
          <ConfirmModalComponent
            confirmType={ConfirmTypeEnum.EditRole}
            itemName={editingRole?.name}
            onConfirm={handleEditRoleConfirm}
            onCancel={() => setShowConfirmEditRole(false)}
          />
        )}
        {showConfirmDeleteRole && deletingRole && (
          <ConfirmModalComponent
            confirmType={ConfirmTypeEnum.DeleteRole}
            itemName={deletingRole?.name}
            onConfirm={handleDeleteRoleConfirm}
            onCancel={() => setShowConfirmDeleteRole(false)}
          />
        )}
      </div>
    </div>
  );
};

const RoleCard = ({
  role,
  handleRoleEdit,
  handleRoleDelete,
  isEditing,
  rolesPageMap,
  onPermissionsUpdate,
}: {
  role: IRoleWithId;
  handleRoleEdit: (role: IRoleWithId) => void;
  handleRoleDelete: (role: IRoleWithId) => void;
  isEditing: boolean;
  rolesPageMap: Record<string, Record<string, boolean>>;
  onPermissionsUpdate: (permission_ids: number[]) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [roleData, setRoleData] = useState<IRoleWithId>(role);

  // Sync state if role prop changes (e.g. from parent edit)
  useEffect(() => {
    setRoleData(role);
  }, [role]);

  // Collapse if editing is cancelled from parent
  useEffect(() => {
    if (!isEditing) {
      setIsExpanded(false);
    }
  }, [isEditing]);

  const handleEdit = () => {
    handleRoleEdit(roleData);
    setIsExpanded(true);
  };

  const handleDelete = () => {
    handleRoleDelete(roleData);
  };

  const onPagePermissionChange = (page: string) => {
    const page_map = rolesPageMap[roleData.id];
    page_map[page] = !page_map[page];

    const newPermissions = new Set(
      Object.entries(page_map)
        .filter(([k, v]) => v)
        .flatMap(([k]) => [...PAGE_PERMISSIONS[k]])
    );

    onPermissionsUpdate(Array.from(newPermissions));
    setRoleData((prev) => ({
      ...prev,
      permission_ids: Array.from(newPermissions),
    }));
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
              role.name === "Manager" ? "bg-[#FF5C39]" : "bg-gray-400"
            }`}
          >
            {role.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {role.name}
            </h3>
            <p className="text-sm text-gray-500 max-w-[200px] truncate indent-1">
              {role.description || "..."}
            </p>
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
                disabled={role.name === "Manager"}
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
        <div className="bg-gray-50/80 border-t border-gray-100 p-5 animate-in slide-in-from-top-2 space-y-6">
          {/* Page Level Toggles */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-2">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#FF5C39]" />
              Quick Access by Page
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.keys(PAGE_PERMISSIONS).map((page) => (
                <div
                  key={page}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    rolesPageMap[roleData.id][page]
                      ? "bg-orange-50 border-[#FF5C39] text-[#FF5C39]"
                      : "bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100"
                  }`}
                  onClick={() => isEditing && onPagePermissionChange(page)}
                >
                  <span className="text-sm font-bold">{page}</span>
                  <Checkbox
                    disabled={!isEditing}
                    checked={rolesPageMap[roleData.id][page]}
                    className="mt-2 h-5 w-5 rounded-md border-gray-300 data-[state=checked]:bg-[#FF5C39] data-[state=checked]:border-[#FF5C39] cursor-pointer pointer-events-none"
                    onCheckedChange={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
