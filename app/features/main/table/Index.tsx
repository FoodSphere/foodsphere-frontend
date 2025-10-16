"use client";
import { useState } from "react";

import { EditButtonGroup } from "./components/EditButtonGroup";
import { Header } from "./components/Header";
import { Table } from "./components/Table";

// import { ConfirmModalComponent } from "@/app/components/featureComponents/ConfirmModalComponent";
// import { ConfirmTypeEnum } from "@/public/enum/confirmModalEnum";

interface TableData {
  id: string;
  hasCustomers: boolean;
}

const TableRender = () => {
  const [tables] = useState<TableData[]>([
    { id: "01", hasCustomers: false },
    { id: "02", hasCustomers: false },
    { id: "03", hasCustomers: true },
    { id: "04", hasCustomers: false },
    { id: "05", hasCustomers: false },
    { id: "06", hasCustomers: false },
    { id: "07", hasCustomers: true },
    { id: "08", hasCustomers: false },
    { id: "09", hasCustomers: true },
  ]);

  return (
    <div className="p-8 flex flex-col gap-6">
      {/* Header */}
      <Header totalTable={tables.length} />

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {tables.map((table) => (
          <Table
            key={table.id}
            id={table.id}
            hasCustomers={table.hasCustomers}
            onClick={(id) => console.log(id)}
          />
        ))}
      </div>

      {/* Edit Table Button Group */}
      <div className="fixed bottom-8 right-8">
        <EditButtonGroup />
      </div>

      {/* <ConfirmModalComponent
        confirmType={ConfirmTypeEnum.OpenBill}
        itemName={"Table 1"}
        onConfirm={() => console.log("Confirm")}
        onCancel={() => console.log("Cancel")}
        guests={4}
        onMinus={() => console.log("Minus")}
        onPlus={() => console.log("Plus")}
      /> */}
    </div>
  );
};

export default TableRender;
