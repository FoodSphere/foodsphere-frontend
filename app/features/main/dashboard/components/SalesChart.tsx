"use client";

import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";

// ลงทะเบียน components ทั้งหมดของ Chart.js
Chart.register(...registerables);

// กำหนดประเภทสำหรับช่วงเวลา
type TimeRange = "day" | "week" | "month" | "year";

// ข้อมูลตัวอย่างสำหรับแต่ละช่วงเวลา
const sampleChartData = {
  day: {
    labels: Array.from({ length: 31 }, (_, i) => i.toString()),
    data: [
      50000, 48000, 49000, 45000, 51000, 48000, 9750000, 52000, 49000, 50000,
      48000, 53000, 47000, 49000, 51000, 50000, 48000, 52000, 49000, 51000,
      50000, 46000, 25000, 48000, 50000, 53000, 49000, 51000, 50000, 48000,
      50000,
    ],
  },
  week: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    data: [350000, 9950000, 360000, 355000],
  },
  month: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    data: [
      1200000, 1500000, 1800000, 1600000, 2100000, 11500000, 2200000, 2500000,
      2300000, 2700000, 2800000, 3100000,
    ],
  },
  year: {
    labels: ["2022", "2023", "2024", "2025"],
    data: [150000000, 185000000, 220000000, 195000000],
  },
};

const SalesChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("day");

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        // ทำลาย instance ของ chart เก่าก่อนสร้างใหม่
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const currentData = sampleChartData[timeRange];

        chartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: currentData.labels,
            datasets: [
              {
                label: "Sales",
                data: currentData.data,
                borderColor: "rgba(79, 70, 229, 1)",
                backgroundColor: "rgba(79, 70, 229, 1)",
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) =>
                    `Sales: ${new Intl.NumberFormat("en-US").format(
                      context.parsed.y ?? 0
                    )}`,
                },
                backgroundColor: "#000",
                titleFont: { size: 14, weight: "bold" },
                bodyFont: { size: 12 },
                padding: 10,
                cornerRadius: 4,
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Time",
                  font: { size: 14 },
                  color: "#6b7280",
                },
                grid: { display: false },
              },
              y: {
                title: {
                  display: true,
                  text: "Sales",
                  font: { size: 14 },
                  color: "#6b7280",
                },
                beginAtZero: true,
                ticks: {
                  callback: (value) => {
                    if (Number(value) >= 1000000)
                      return `${Number(value) / 1000000}M`;
                    if (Number(value) >= 1000)
                      return `${Number(value) / 1000}k`;
                    return value.toLocaleString();
                  },
                },
              },
            },
          },
        });
      }
    }

    // Cleanup function
    return () => {
      chartInstance.current?.destroy();
    };
  }, [timeRange]); // <-- Dependency array: ให้ useEffect ทำงานใหม่ทุกครั้งที่ timeRange เปลี่ยน

  // ฟังก์ชันสำหรับสร้าง class ของปุ่มแบบไดนามิก
  const getButtonClass = (range: TimeRange) => {
    return `px-4 py-1.5 text-sm font-medium rounded-md focus:outline-none transition-colors duration-200 ${
      timeRange === range
        ? "bg-indigo-600 text-white shadow"
        : "text-gray-700 bg-white hover:bg-gray-100"
    }`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Total Sales</h2>
        <div className="flex items-center space-x-1 border border-gray-200 p-1 rounded-lg">
          {/* ปุ่มสำหรับเปลี่ยน TimeRange */}
          <button
            onClick={() => setTimeRange("day")}
            className={getButtonClass("day")}
          >
            Day
          </button>
          <button
            onClick={() => setTimeRange("week")}
            className={getButtonClass("week")}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={getButtonClass("month")}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange("year")}
            className={getButtonClass("year")}
          >
            Year
          </button>
        </div>
      </div>

      <div className="h-80">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default SalesChart;
