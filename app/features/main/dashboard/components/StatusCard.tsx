// StatsCard.tsx
import React from 'react';

// กำหนด Type ของข้อมูลสถิติ (ขึ้นหรือลง)
type Trend = 'up' | 'down';

// กำหนด Type สำหรับ Props ที่ Component จะได้รับ
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode; // รับได้ทั้งตัวอักษรและ SVG Icon
  iconBgColor: string; // สีพื้นหลังของไอคอน เช่น 'bg-orange-100'
  iconTextColor: string; // สีของไอคอน เช่น 'text-orange-600'
  trend: Trend;
  statsPercentage: number;
  reportUrl: string;
}

// SVG Icon สำหรับลูกศรชี้ขึ้น
const TrendUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

// SVG Icon สำหรับลูกศรชี้ลง
const TrendDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17l5-5m0 0l-5-5m5 5H6" />
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
  // กำหนดสีและ Icon ตามค่า trend
  const isUp = trend === 'up';
  const trendColor = isUp ? 'text-green-600' : 'text-red-600';
  const TrendIcon = isUp ? TrendUpIcon : TrendDownIcon;

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm w-full max-w-sm">
      {/* ส่วนบน: Title และ Icon */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">{title}</span>
          <span className="text-2xl font-bold text-gray-800 mt-1">{value}</span>
        </div>
        <div className={`flex items-center justify-center h-12 w-12 rounded-full ${iconBgColor} ${iconTextColor} font-bold text-xl`}>
          {icon}
        </div>
      </div>

      {/* ส่วนล่าง: สถิติ และ Link */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-1">
          <TrendIcon className={`w-4 h-4 ${trendColor}`} />
          <span className={`text-sm font-medium ${trendColor}`}>
            {statsPercentage}%
          </span>
          <span className="text-sm text-gray-500">
            {isUp ? 'up' : 'down'} from yesterday
          </span>
        </div>
        <a href={reportUrl} className="text-sm text-blue-600 hover:underline">
          View report
        </a>
      </div>
    </div>
  );
};

export default StatsCard;