import DataTable, { ColumnDef } from "./components/DataTable";
import SalesChart from "./components/SalesChart";
import StatusBadge, { StatusType } from "./components/StatusBadge";
import StatsCard from "./components/StatusCard";

const OrdersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);

const CustomersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

// 1. กำหนด Type และ Data สำหรับ Latest Transaction
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
    amount: "B 250.00",
    status: "Completed",
  },
  {
    transactionId: "0000009",
    timestamp: "08/03/25 12:31",
    amount: "B 500.00",
    status: "Completed",
  },
  {
    transactionId: "0000008",
    timestamp: "08/03/25 12:29",
    amount: "B 500.00",
    status: "Failed",
  },
];

const transactionColumns: ColumnDef<Transaction>[] = [
  { header: "Transaction ID", accessor: "transactionId" },
  { header: "Timestamp", accessor: "timestamp" },
  { header: "Amount", accessor: "amount" },
  {
    header: "Status",
    accessor: "status",
    render: (item) => <StatusBadge status={item.status} />,
  },
];

// 2. กำหนด Type และ Data สำหรับ Bestseller Menus
type BestsellerMenu = {
  menuId: string;
  menuName: string;
  amount: string;
};

const bestsellerData: BestsellerMenu[] = [
  { menuId: "0000023", menuName: "Pad Kraprao Crispy Pork", amount: "500 pcs" },
  { menuId: "0000022", menuName: "Pad Kraprao Minced Pork", amount: "350 pcs" },
  { menuId: "00000209", menuName: "Fried Rice Chicken", amount: "298 pcs" },
];

const bestsellerColumns: ColumnDef<BestsellerMenu>[] = [
  { header: "Menu ID", accessor: "menuId" },
  { header: "Menu Name", accessor: "menuName" },
  { header: "Amount", accessor: "amount" },
];

// 3. กำหนด Type และ Data สำหรับ Latest Stock
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

const stockColumns: ColumnDef<StockItem>[] = [
  { header: "Ingredient Name", accessor: "ingredientName" },
  { header: "Timestamp", accessor: "timestamp" },
  { header: "Amount", accessor: "amount" },
  {
    header: "Status",
    accessor: "status",
    render: (item) => <StatusBadge status={item.status} />,
  },
];

const DashboardRender = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Today Sales */}
        <StatsCard
          title="Today Sales"
          value="B 5,620.69"
          icon="B"
          iconBgColor="bg-orange-100"
          iconTextColor="text-orange-600"
          trend="up"
          statsPercentage={8.5}
          reportUrl="/reports/sales"
        />

        {/* Card 2: Today Orders */}
        <StatsCard
          title="Today Orders"
          value="109"
          icon={<OrdersIcon />}
          iconBgColor="bg-red-100"
          iconTextColor="text-red-600"
          trend="down"
          statsPercentage={8.5}
          reportUrl="/reports/orders"
        />

        {/* Card 3: Today Customers */}
        <StatsCard
          title="Today Customers"
          value="42"
          icon={<CustomersIcon />}
          iconBgColor="bg-orange-100"
          iconTextColor="text-orange-600"
          trend="up"
          statsPercentage={2.7}
          reportUrl="/reports/customers"
        />
      </div>

      <div className="w-7xl">
        <SalesChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <DataTable<Transaction>
          title="Latest Transaction"
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
          title="Latest Stock"
          viewAllUrl="/stock"
          columns={stockColumns}
          data={stockData}
        />
      </div>
    </div>
  );
};

export default DashboardRender;
