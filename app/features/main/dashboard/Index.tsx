"use client";
import React, { useCallback, useEffect, useState } from "react";
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

import {
  getCountBill,
  getCountEachOrder,
  getCountOrder,
  getPaymentTransaction,
  getRevenue,
  getStockUse,
} from "@/services/dashboard/dashboardApi";
import { getIngredients } from "@/services/stock/stockApi";

import DataTable, { ColumnDef } from "./components/DataTable";
import StatsCard from "./components/StatsCard";

export type StatusType =
  | "Completed"
  | "Failed"
  | "Added"
  | "Consumed"
  | "Updated";

// --- Types ---
type Transaction = {
  transactionId: string;
  timestamp: string;
  table: string;
  amount: string;
  paymentMethod: string;
  status: StatusType;
};

type BestsellerMenu = { menuId: string; menuName: string; amount: string };

// อัปเดต Type ให้ตรงกับ Response ใหม่ของ Backend
type StockUses = {
  ingredientName: string;
  totalUsed: number;
  totalAdded: number;
};

const COLORS = ["#FF5C39", "#FF7650", "#FF8A66", "#FFB8A3", "#FFE5DE"];

const renderStatus = (status: StatusType) => {
  const styles: Record<string, string> = {
    Completed: "bg-green-50 text-green-600 border-green-200",
    Consumed: "bg-orange-50 text-orange-600 border-orange-200",
    Failed: "bg-red-50 text-red-600 border-red-200",
  };
  return (
    <span
      className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border ${styles[status] || "bg-gray-100 text-gray-500"}`}
    >
      {status}
    </span>
  );
};

const SearchableIngredientDropdown = ({
  ingredients,
  selected,
  onSelect,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = ingredients.filter((ing: any) =>
    ing.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <div
        className="text-sm border border-gray-200 bg-white rounded-lg px-3 py-1.5 cursor-pointer min-w-[140px] flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate max-w-[100px]">
          {selected === "All" ? "All Ingredients" : selected}
        </span>
        <span className="text-gray-400 text-xs ml-2">▼</span>
      </div>

      {isOpen && (
        <div className="absolute z-10 right-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg max-h-56 overflow-y-auto">
          <div className="sticky top-0 bg-white p-2 border-b border-gray-50">
            <input
              type="text"
              className="w-full text-xs px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md outline-none focus:border-primary-orange-main focus:ring-1 focus:ring-primary-orange-main"
              placeholder="Search ingredient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div
            className="px-3 py-2 text-xs font-medium hover:bg-orange-50 cursor-pointer"
            onClick={() => {
              onSelect("All");
              setIsOpen(false);
            }}
          >
            All Ingredients
          </div>
          {filtered.map((ing: any) => (
            <div
              key={ing.id}
              className="px-3 py-2 text-xs font-medium text-gray-700 hover:bg-orange-50 cursor-pointer border-t border-gray-50"
              onClick={() => {
                onSelect(ing.name);
                setIsOpen(false);
              }}
            >
              {ing.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DashboardRender = () => {
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [ingredientFilter, setIngredientFilter] = useState("All");
  const [ingredientsList, setIngredientsList] = useState<any[]>([]);

  // States สำหรับ Charts
  const [salesChartData, setSalesChartData] = useState<
    { name: string; sales: number }[]
  >([]);
  const [pieChartData, setPieChartData] = useState<
    { name: string; value: number }[]
  >([]);
  const [bestsellerData, setBestsellerData] = useState<BestsellerMenu[]>([]);

  const [transactionsData, setTransactionsData] = useState<Transaction[]>([]);
  const [rawStockUsesData, setRawStockUsesData] = useState<any[]>([]);

  // Query String สำหรับวันนี้
  const todayStr = new Date().toISOString().split("T")[0];
  const dailyQueryString = `from_time=${todayStr}T00:00:00.000Z&to_time=${todayStr}T23:59:59.999Z`;

  const fetchSales = useCallback(async (dateStr: string) => {
    try {
      const qs = `from_time=${dateStr}T00:00:00.000Z&to_time=${dateStr}T23:59:59.999Z`;
      const res = await getRevenue(qs);
      return res?.data.revenue;
    } catch (err) {
      console.error(err);
      return 0;
    }
  }, []);

  const fetchBills = useCallback(async (dateStr: string) => {
    try {
      const qs = `from_time=${dateStr}T00:00:00.000Z&to_time=${dateStr}T23:59:59.999Z`;
      const res = await getCountBill(qs);
      return res?.data.bill_count;
    } catch (err) {
      console.error(err);
      return 0;
    }
  }, []);

  const fetchOrders = useCallback(async (dateStr: string) => {
    try {
      const qs = `from_time=${dateStr}T00:00:00.000Z&to_time=${dateStr}T23:59:59.999Z`;
      const res = await getCountOrder(qs);
      return res?.data.menu_sold;
    } catch (err) {
      console.error(err);
      return 0;
    }
  }, []);

  useEffect(() => {
    const fetchIng = async () => {
      try {
        const res = await getIngredients();
        setIngredientsList(res?.data);
      } catch (e) {}
    };
    fetchIng();
  }, []);

  // ดึงข้อมูล Sales Chart (ย้อนหลัง 7 วัน)
  useEffect(() => {
    const fetch7DaysSales = async () => {
      try {
        const days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          days.push(d);
        }

        const promises = days.map(async (d) => {
          const dateStr = d.toISOString().split("T")[0];
          const qs = `from_time=${dateStr}T00:00:00.000Z&to_time=${dateStr}T23:59:59.999Z`;
          const res = await getRevenue(qs);

          // ปรับเปลี่ยนจาก ชื่อวัน (Mon, Tue) เป็น วัน/เดือน (เช่น 19/03)
          const dayName = d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
          });

          return { name: dayName, sales: res?.data?.revenue || 0 };
        });

        const results = await Promise.all(promises);
        setSalesChartData(results);
      } catch (err) {
        console.error("Failed to fetch 7 days sales", err);
      }
    };
    fetch7DaysSales();
  }, []);

  // ดึงข้อมูล Top 5 Best Seller
  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await getCountEachOrder();
        const rawData = res?.data || [];

        const top5 = [...rawData]
          .sort((a, b) => b.total_sold - a.total_sold)
          .slice(0, 5);

        setPieChartData(
          top5.map((item) => ({
            name: item.menu_name,
            value: item.total_sold,
          }))
        );

        setBestsellerData(
          top5.map((item) => ({
            menuId: String(item.menu_id).padStart(7, "0"),
            menuName: item.menu_name,
            amount: `${item.total_sold} pcs`,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch best sellers", err);
      }
    };
    fetchBestSellers();
  }, []);

  // ดึงข้อมูล Recent Transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getPaymentTransaction(dailyQueryString);
        const rawData = res?.data || [];

        const mappedData: Transaction[] = rawData.map((item: any) => {
          const date = new Date(item.create_time);
          const formattedDate =
            date.toLocaleDateString("en-GB") +
            " " +
            date.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            });

          const paymentDisplay =
            item.payment_method?.toLowerCase() === "stripe"
              ? "QR Code"
              : item.payment_method || "N/A";

          return {
            transactionId: item.bill_id.split("-")[0],
            timestamp: formattedDate,
            table: item.table?.name || "-",
            amount: `฿ ${item.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            paymentMethod: paymentDisplay,
            status: item.status === 1 ? "Completed" : "Failed",
          };
        });
        setTransactionsData(mappedData);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
    };
    fetchTransactions();
  }, [dailyQueryString]);

  // ดึงข้อมูล Stock Uses
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await getStockUse(dailyQueryString);
        setRawStockUsesData(res?.data || []);
      } catch (err) {
        console.error("Failed to fetch stock uses", err);
      }
    };
    fetchStock();
  }, [dailyQueryString]);

  // แมพข้อมูลใหม่ให้ตรงกับ response จาก Backend
  const processedStockUses: StockUses[] = rawStockUsesData.map((item) => {
    return {
      ingredientName:
        item.ingredient_name || `Unknown (ID: ${item.ingredient_id})`,
      totalUsed: item.total_used,
      totalAdded: item.total_added,
    };
  });

  const filteredTransactions = transactionsData.filter(
    (t) => paymentFilter === "All" || t.paymentMethod === paymentFilter
  );

  const filteredStock = processedStockUses.filter(
    (s) => ingredientFilter === "All" || s.ingredientName === ingredientFilter
  );

  const transactionColumns: ColumnDef<Transaction>[] = [
    { header: "Bill ID", accessor: "transactionId" },
    { header: "Timestamp", accessor: "timestamp" },
    { header: "Table", accessor: "table" },
    { header: "Payment", accessor: "paymentMethod" },
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

  // อัปเดต Column ของ Stock Uses ใหม่ให้รับกับโครงสร้าง Object ใหม่
  const stockColumns: ColumnDef<StockUses>[] = [
    { header: "Ingredient Name", accessor: "ingredientName" },
    { header: "Total Used", accessor: "totalUsed" },
    { header: "Total Added", accessor: "totalAdded" },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 min-h-screen bg-gray-50/50">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1 font-medium">
          Welcome back, here&apos;s your restaurant overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Sales"
          icon={<span className="text-2xl font-black">฿</span>}
          iconBgColor="bg-green-100"
          iconTextColor="text-green-600"
          fetchData={fetchSales}
          formatValue={(val) =>
            `฿ ${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          }
        />
        <StatsCard
          title="Total Bills"
          icon={<span className="text-2xl font-black">🧾</span>}
          iconBgColor="bg-orange-100"
          iconTextColor="text-orange-600"
          fetchData={fetchBills}
          formatValue={(val) => val.toLocaleString("en-US")}
        />
        <StatsCard
          title="Total Orders"
          icon={<span className="text-2xl font-black">📦</span>}
          iconBgColor="bg-blue-100"
          iconTextColor="text-blue-600"
          fetchData={fetchOrders}
          formatValue={(val) => val.toLocaleString("en-US")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[24px] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <h3 className="text-xl font-extrabold text-gray-900 mb-6">
            Sales Overview
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

        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col">
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">
            Top 5 Best Seller Menus
          </h3>
          <div className="flex-1 w-full flex items-center justify-center">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DataTable<Transaction>
          title="Recent Transactions"
          columns={transactionColumns}
          data={filteredTransactions}
          headerAction={
            <select
              className="text-sm border border-gray-200 bg-white rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-primary-orange-main cursor-pointer"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="All">All Payments</option>
              <option value="cash">Cash</option>
              <option value="QR Code">QR Code</option>
            </select>
          }
        />

        <DataTable<BestsellerMenu>
          title="Top 5 Best Seller Menus"
          columns={bestsellerColumns}
          data={bestsellerData}
        />

        <DataTable<StockUses>
          title="Stock Uses"
          columns={stockColumns}
          data={filteredStock}
          headerAction={
            <SearchableIngredientDropdown
              ingredients={ingredientsList}
              selected={ingredientFilter}
              onSelect={setIngredientFilter}
            />
          }
        />
      </div>
    </div>
  );
};

export default DashboardRender;
