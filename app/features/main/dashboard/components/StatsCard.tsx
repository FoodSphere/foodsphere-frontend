import React, { useEffect, useState } from "react";

type Trend = "up" | "down";

interface StatsCardProps {
  title: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
  fetchData: (dateStr: string) => Promise<number>;
  formatValue: (val: number) => string;
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
  icon,
  iconBgColor,
  iconTextColor,
  fetchData,
  formatValue,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const [targetDate, setTargetDate] = useState(today);
  const [compareDate, setCompareDate] = useState(yesterday);

  // States สำหรับเก็บค่าที่ได้จาก API
  const [value, setValue] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [trend, setTrend] = useState<Trend>("up");
  const [isLoading, setIsLoading] = useState(true);

  // ดึง API อัตโนมัติเมื่อ วันที่ หรือ Function ดึงข้อมูลเปลี่ยน
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      try {
        // ยิง API พร้อมกัน 2 เส้น สำหรับ Target และ Compare
        const [targetVal, compareVal] = await Promise.all([
          fetchData(targetDate),
          fetchData(compareDate),
        ]);

        if (isMounted) {
          setValue(targetVal);

          // คำนวณเปอร์เซ็นต์ Trend
          if (compareVal === 0) {
            setPercentage(targetVal > 0 ? 100 : 0);
            setTrend(targetVal >= 0 ? "up" : "down");
          } else {
            const diff = targetVal - compareVal;
            setPercentage(
              Number(Math.abs((diff / compareVal) * 100).toFixed(2))
            );
            setTrend(diff >= 0 ? "up" : "down");
          }
        }
      } catch (error) {
        console.error(`Failed to fetch stats for ${title}`, error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [targetDate, compareDate, fetchData, title]);

  const handleTargetDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTarget = e.target.value;
    setTargetDate(newTarget);
    // ดักไว้: ถ้าเลือก Target Date ให้ถอยหลังไปน้อยกว่า Compare ให้ดึง Compare กลับมาเท่ากัน
    if (newTarget < compareDate) {
      setCompareDate(newTarget);
    }
  };

  const isUp = trend === "up";
  const trendColor = isUp ? "text-green-500" : "text-red-500";
  const TrendIcon = isUp ? TrendUpIcon : TrendDownIcon;

  return (
    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] w-full flex flex-col hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            {title}
          </span>
          <span className="text-3xl font-black text-gray-900 mt-2 tracking-tight">
            {isLoading ? "..." : formatValue(value)}
          </span>
        </div>
        <div
          className={`flex items-center justify-center h-12 w-12 rounded-2xl ${iconBgColor} ${iconTextColor} font-bold text-xl shadow-sm`}
        >
          {icon}
        </div>
      </div>

      <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4 mb-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase">
            Target Date
          </span>
          <input
            type="date"
            value={targetDate}
            onChange={handleTargetDateChange}
            className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-primary-orange-main focus:ring-2 focus:ring-orange-50 transition-all font-medium text-gray-700 cursor-pointer w-36 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase">
            Compare To
          </span>
          <input
            type="date"
            value={compareDate}
            max={targetDate} // ล็อกไม่ให้เลือกวันที่เกิน Target Date
            onChange={(e) => setCompareDate(e.target.value)}
            className="text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-primary-orange-main focus:ring-2 focus:ring-orange-50 transition-all font-medium text-gray-700 cursor-pointer w-36 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
        </div>
      </div>

      <div className="flex items-center mt-auto pt-2 border-t border-gray-100 border-dashed">
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${isUp ? "bg-green-50" : "bg-red-50"}`}
        >
          <TrendIcon className={`w-4 h-4 ${trendColor}`} />
          <span className={`text-xs font-bold ${trendColor}`}>
            {percentage}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
