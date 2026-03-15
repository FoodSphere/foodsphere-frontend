"use client";
import React from "react";
// นำเข้า Recharts สำหรับทำกราฟ (ต้อง npm install recharts ก่อน)
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import DataTable, { ColumnDef } from "./components/DataTable";
import StatsCard from "./components/StatsCard";

export type StatusType =
  | "Completed"
  | "Failed"
  | "Added"
  | "Consumed"
  | "Updated";

// --- Mock Data ---
type Transaction = {
  transactionId: string;
  timestamp: string;
  amount: string;
  status: StatusType;
};
const transactionData: Transaction[] = [
  {
    transactionId: "0000010",
    timestamp: "Today 11:25",
    amount: "฿ 250.00",
    status: "Completed",
  },
  {
    transactionId: "0000009",
    timestamp: "08/03/25 12:31",
    amount: "฿ 500.00",
    status: "Completed",
  },
  {
    transactionId: "0000008",
    timestamp: "08/03/25 12:29",
    amount: "฿ 500.00",
    status: "Failed",
  },
];

type BestsellerMenu = { menuId: string; menuName: string; amount: string };
const bestsellerData: BestsellerMenu[] = [
  { menuId: "0000023", menuName: "Pad Kraprao Crispy Pork", amount: "500 pcs" },
  { menuId: "0000022", menuName: "Pad Kraprao Minced Pork", amount: "350 pcs" },
  { menuId: "00000209", menuName: "Fried Rice Chicken", amount: "298 pcs" },
];

type StockItem = {
  ingredientName: string;
  timestamp: string;
  amount: string;
  status: StatusType;
};
const stockData: StockItem[] = [
  {
    ingredientName: "Wagyu Beef",
    timestamp: "Today 08:25",
    amount: "50 pcs",
    status: "Added",
  },
  {
    ingredientName: "Salmon",
    timestamp: "Today 08:40",
    amount: "50 pcs",
    status: "Added",
  },
  {
    ingredientName: "Tuna",
    timestamp: "27/02/25 12:31",
    amount: "10 pcs",
    status: "Consumed",
  },
];

// --- Mock Chart Data ---
const salesChartData = [
  { name: "Mon", sales: 4000 },
  { name: "Tue", sales: 3000 },
  { name: "Wed", sales: 5000 },
  { name: "Thu", sales: 2780 },
  { name: "Fri", sales: 6890 },
  { name: "Sat", sales: 8390 },
  { name: "Sun", sales: 9490 },
];

const pieChartData = [
  { name: "Crispy Pork", value: 500 },
  { name: "Minced Pork", value: 350 },
  { name: "Chicken", value: 298 },
  { name: "Others", value: 400 },
];
const COLORS = ["#FF5C39", "#FF8A66", "#FFB8A3", "#FFE5DE"]; // โทนสีส้มของแบรนด์

// --- Helper สำหรับแสดง Status โดยไม่ใช้ Component แยก ---
const renderStatus = (status: StatusType) => {
  const styles: Record<string, string> = {
    Completed: "bg-green-50 text-green-600 border-green-200",
    Added: "bg-blue-50 text-blue-600 border-blue-200",
    Failed: "bg-red-50 text-red-600 border-red-200",
    Consumed: "bg-orange-50 text-orange-600 border-orange-200",
    Updated: "bg-yellow-50 text-yellow-600 border-yellow-200",
  };
  return (
    <span
      className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border ${styles[status] || "bg-gray-100 text-gray-500"}`}
    >
      {status}
    </span>
  );
};

const DashboardRender = () => {
  // Columns Setup
  const transactionColumns: ColumnDef<Transaction>[] = [
    { header: "ID", accessor: "transactionId" },
    { header: "Timestamp", accessor: "timestamp" },
    { header: "Amount", accessor: "amount" },
    {
      header: "Status",
      accessor: "status",
      render: (item) => renderStatus(item.status),
    },
  ];

  const bestsellerColumns: ColumnDef<BestsellerMenu>[] = [
    { header: "ID", accessor: "menuId" },
    { header: "Menu Name", accessor: "menuName" },
    { header: "Amount", accessor: "amount" },
  ];

  const stockColumns: ColumnDef<StockItem>[] = [
    { header: "Ingredient", accessor: "ingredientName" },
    { header: "Timestamp", accessor: "timestamp" },
    { header: "Amount", accessor: "amount" },
    {
      header: "Status",
      accessor: "status",
      render: (item) => renderStatus(item.status),
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 min-h-screen bg-gray-50/50">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Welcome back, here&apos;s your restaurant overview.
          </p>
        </div>
      </div>

      {/* 2. Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Sales"
          value="฿ 5,620.69"
          icon={<span className="text-2xl font-black">฿</span>}
          iconBgColor="bg-green-100"
          iconTextColor="text-green-600"
          trend="up"
          statsPercentage={8.5}
          reportUrl="/reports/sales"
        />
        <StatsCard
          title="Total Orders"
          value="109"
          icon={<span className="text-2xl font-black">📦</span>}
          iconBgColor="bg-blue-100"
          iconTextColor="text-blue-600"
          trend="down"
          statsPercentage={2.4}
          reportUrl="/reports/orders"
        />
        <StatsCard
          title="Total Customers"
          value="42"
          icon={<span className="text-2xl font-black">👥</span>}
          iconBgColor="bg-orange-100"
          iconTextColor="text-orange-600"
          trend="up"
          statsPercentage={12.7}
          reportUrl="/reports/customers"
        />
      </div>

      {/* 3. Charts Section (NEW) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (Takes up 2 columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[24px] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <h3 className="text-xl font-extrabold text-gray-900 mb-6">
            Sales Overview (This Week)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f9fafb" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="sales"
                  fill="#FF5C39"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bestseller Pie Chart */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">
            Top Categories
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Data Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DataTable<Transaction>
          title="Recent Transactions"
          viewAllUrl="/transactions"
          columns={transactionColumns}
          data={transactionData}
        />
        <DataTable<BestsellerMenu>
          title="Bestseller Menus"
          viewAllUrl="/bestsellers"
          columns={bestsellerColumns}
          data={bestsellerData}
        />
        <DataTable<StockItem>
          title="Recent Stock Activity"
          viewAllUrl="/stock"
          columns={stockColumns}
          data={stockData}
        />
      </div>
    </div>
  );
};

export default DashboardRender;
