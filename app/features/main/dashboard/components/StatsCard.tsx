import React, { useState } from "react";

type Trend = "up" | "down";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
  trend: Trend;
  statsPercentage: number;
  reportUrl: string;
}

const TrendUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M13 7l5 5m0 0l-5 5m5-5H6"
    />
  </svg>
);

const TrendDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M13 17l5-5m0 0l-5-5m5 5H6"
    />
  </svg>
);

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  iconTextColor,
  trend,
  statsPercentage,
  reportUrl,
}) => {
  const isUp = trend === "up";
  const trendColor = isUp ? "text-green-500" : "text-red-500";
  const TrendIcon = isUp ? TrendUpIcon : TrendDownIcon;

  // State สำหรับเก็บวันที่ (ตั้งค่าเริ่มต้นเป็น วันนี้ กับ เมื่อวาน)
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const [targetDate, setTargetDate] = useState(today);
  const [compareDate, setCompareDate] = useState(yesterday);

  return (
    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] w-full flex flex-col hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-shadow duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            {title}
          </span>
          <span className="text-3xl font-black text-gray-900 mt-2 tracking-tight">
            {value}
          </span>
        </div>
        <div
          className={`flex items-center justify-center h-12 w-12 rounded-2xl ${iconBgColor} ${iconTextColor} font-bold text-xl shadow-sm`}
        >
          {icon}
        </div>
      </div>

      {/* Date Comparison Section */}
      <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3 mb-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase">
            Target Date
          </span>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-primary-orange-main focus:ring-2 focus:ring-orange-50 transition-all font-medium text-gray-700 cursor-pointer"
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase">
            Compare To
          </span>
          <input
            type="date"
            value={compareDate}
            onChange={(e) => setCompareDate(e.target.value)}
            className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-primary-orange-main focus:ring-2 focus:ring-orange-50 transition-all font-medium text-gray-700 cursor-pointer"
          />
        </div>
      </div>

      {/* Footer / Stats */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 border-dashed">
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${isUp ? "bg-green-50" : "bg-red-50"}`}
        >
          <TrendIcon className={`w-4 h-4 ${trendColor}`} />
          <span className={`text-xs font-bold ${trendColor}`}>
            {statsPercentage}%
          </span>
        </div>
        <a
          href={reportUrl}
          className="text-xs font-bold text-gray-400 hover:text-primary-orange-main underline decoration-gray-300 hover:decoration-primary-orange-main transition-all"
        >
          View full report
        </a>
      </div>
    </div>
  );
};

export default StatsCard;
