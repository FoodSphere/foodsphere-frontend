// src/components/restaurant/ManageRoleView.tsx
import { useState, useEffect } from "react";
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
import { SearchBar } from "./SearchBar";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "@/services/role/roleApi";
import {
  getPermissions,
  getPermissionsGroupName,
  updateRolePermission,
} from "@/services/role/permissionApi";
import {
  IPermissionsGroup,
  IPermissionResponse,
  IRoleResponse,
  IRole,
  IRoleWithId,
} from "@/types/roleType";

interface FormData {
  name: string;
  description: string;
  permission_ids: number[];
}

export const ManageRolesView = () => {
  const [roles, setRoles] = useState<IRoleWithId[]>([]);
  const [permissionsGroup, setPermissionsGroup] = useState<IPermissionsGroup[]>(
    []
  );
  const [addingRole, setAddingRole] = useState<IRole | null>(null);
  const [editingRole, setEditingRole] = useState<IRoleWithId | null>(null);
  const [deletingRole, setDeletingRole] = useState<IRoleWithId | null>(null);

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
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  const fetchPermissionsData = async () => {
    try {
      const res = await getPermissions();

      if (res && res.data && Array.isArray(res.data)) {
        const apiData: IPermissionResponse[] = res.data;

        // แปลงข้อมูลจาก API ให้เข้ากับหน้าบ้าน (UI)
        const groupedPermissions = Object.groupBy(
          apiData,
          (item: IPermissionResponse) => getPermissionsGroupName(item.name)
        );
        const mappedPermissionsGroup: IPermissionsGroup[] = Object.entries(
          groupedPermissions
        ).map(([key, value]) => ({
          title: key,
          permissions: value || [],
        }));

        setPermissionsGroup(mappedPermissionsGroup);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  // --- API Fetching ---
  useEffect(() => {
    fetchRolesData();
    fetchPermissionsData();
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
                      permissionsGroup={permissionsGroup}
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
  permissionsGroup,
  onPermissionsUpdate,
}: {
  role: IRoleWithId;
  handleRoleEdit: (role: IRoleWithId) => void;
  handleRoleDelete: (role: IRoleWithId) => void;
  isEditing: boolean;
  permissionsGroup: IPermissionsGroup[];
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

  const onPermissionChange = (permission_id: number) => {
    setRoleData((prev) => {
      const isChecked = prev.permission_ids.includes(permission_id);
      const newPermissions = isChecked
        ? prev.permission_ids.filter((id) => id !== permission_id)
        : [...prev.permission_ids, permission_id];

      const newState = {
        ...prev,
        permission_ids: newPermissions,
      };

      onPermissionsUpdate(newPermissions);
      return newState;
    });
  };

  const onPermissionAllCheck = (group_permission_ids: number[]) => {
    setRoleData((prev) => {
      const allGroupChecked = group_permission_ids.every((id) =>
        prev.permission_ids.includes(id)
      );

      let newPermissions: number[];
      if (allGroupChecked) {
        // Uncheck all in this group
        newPermissions = prev.permission_ids.filter(
          (id) => !group_permission_ids.includes(id)
        );
      } else {
        // Check all in this group (add missing ones)
        const missingIds = group_permission_ids.filter(
          (id) => !prev.permission_ids.includes(id)
        );
        newPermissions = [...prev.permission_ids, ...missingIds];
      }

      const newState = {
        ...prev,
        permission_ids: newPermissions,
      };

      onPermissionsUpdate(newPermissions);
      return newState;
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
              role.name === "Manager" ? "bg-[#FF5C39]" : "bg-gray-400"
            }`}
          >
            {role.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {role.name}
            </h3>
            <p className="text-sm text-gray-500">{role.description}</p>
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
        <div className="bg-gray-50/80 border-t border-gray-100 p-5 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {permissionsGroup.map((group) => (
              <div
                key={group.title}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <PermissionGroup
                  group={group}
                  permission_ids={roleData.permission_ids}
                  onPermissionChange={onPermissionChange}
                  onPermissionAllCheck={onPermissionAllCheck}
                  isEditing={isEditing}
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
  permission_ids,
  onPermissionChange,
  onPermissionAllCheck,
  isEditing,
}: {
  group: IPermissionsGroup;
  permission_ids: number[];
  onPermissionChange: (permissionId: number) => void;
  onPermissionAllCheck: (permissionIds: number[]) => void;
  isEditing: boolean;
}) => {
  const allChecked = group.permissions.every((k) =>
    permission_ids.includes(k.id)
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <h4 className="font-bold text-sm text-gray-700">{group.title}</h4>
        <Checkbox
          disabled={!isEditing}
          checked={allChecked}
          className="h-5 w-5 rounded-md border-gray-300 data-[state=checked]:bg-[#FF5C39] data-[state=checked]:border-[#FF5C39]"
          onCheckedChange={() =>
            onPermissionAllCheck(group.permissions.map((k) => k.id))
          }
        />
      </div>
      <div className="space-y-2">
        {group.permissions.map((permission) => (
          <div
            key={permission.id}
            className="flex items-center justify-between group"
          >
            <span className="text-sm text-gray-500 group-hover:text-gray-800 transition-colors">
              {permission.name}
            </span>
            <Checkbox
              disabled={!isEditing}
              checked={permission_ids.includes(permission.id)}
              className="h-4 w-4 rounded border-gray-300 data-[state=checked]:bg-[#FF5C39] data-[state=checked]:border-[#FF5C39]"
              onCheckedChange={() => onPermissionChange(permission.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
