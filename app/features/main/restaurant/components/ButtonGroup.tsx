"use client";
import { Store, TicketPercent, Users, Lock } from "lucide-react";

export type ViewType = "my-restaurant" | "manage-employees" | "manage-roles" | "manage-discount";

interface ButtonGroupProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const navItems = [
  {
    id: "my-restaurant",
    label: "My Restaurant",
    icon: <Store className="w-5 h-5" />,
  },
  {
    id: "manage-employees",
    label: "Manage Employees",
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: "manage-roles",
    label: "Manage Roles",
    icon: <Lock className="w-5 h-5" />,
  },
  {
    id: "manage-discount",
    label: "Manage Discount",
    icon: <TicketPercent className="w-5 h-5" />,
  },
];

export const ButtonGroup = ({
  activeView,
  setActiveView,
}: ButtonGroupProps) => {
  return (
    <aside className="w-72 shrink-0">
      {/* Sidebar Container: สีเทาอ่อนและโค้งมน */}
      <div className="bg-[#E5E5E5] rounded-[20px] p-5 space-y-4 shadow-sm">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all duration-200 ${
                isActive
                  ? "bg-[#FF5C39] text-white shadow-lg" // ปุ่มส้มเมื่อ Active
                  : "bg-white text-gray-800 hover:bg-gray-50 shadow-sm" // ปุ่มขาวปกติ
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
