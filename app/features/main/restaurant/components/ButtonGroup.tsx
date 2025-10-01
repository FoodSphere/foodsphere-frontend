import React from "react";
import { Store, TicketPercent, Users } from "lucide-react";

import { Button } from "@/app/components/ui/button";

export type ViewType = "my-restaurant" | "manage-employees" | "manage-discount";

interface ButtonGroupProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const navItems = [
  {
    id: "my-restaurant",
    label: "My Restaurant",
    icon: <Store className="mr-2 h-4 w-4" />,
  },
  {
    id: "manage-employees",
    label: "Manage Employees",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
  {
    id: "manage-discount",
    label: "Manage Discount",
    icon: <TicketPercent className="mr-2 h-4 w-4" />,
  },
];

export const ButtonGroup = ({ activeView, setActiveView }: ButtonGroupProps) => {
  return (
    <aside className="w-64 flex-shrink-0">
      <div className="space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => setActiveView(item.id as ViewType)}
            className={`w-full justify-start text-left text-base p-6 ${
              activeView === item.id
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-white text-gray-800 hover:bg-gray-50"
            }`}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </div>
    </aside>
  );
};
