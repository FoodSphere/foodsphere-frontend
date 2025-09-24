import React from "react";

// กำหนด Type สำหรับสถานะที่เป็นไปได้ทั้งหมด
export type StatusType =
  | "Completed"
  | "Failed"
  | "Added"
  | "Consumed"
  | "Updated";

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // สร้าง mapping ระหว่าง status กับ class สีของ Tailwind CSS
  const colorMap: Record<StatusType, string> = {
    Completed: "bg-green-100 text-green-800",
    Added: "bg-green-100 text-green-800",
    Failed: "bg-red-100 text-red-800",
    Consumed: "bg-red-100 text-red-800",
    Updated: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${colorMap[status]}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
