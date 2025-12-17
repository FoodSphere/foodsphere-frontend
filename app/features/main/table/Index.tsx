"use client";
import { useState } from "react";

import { ConfirmModalComponent } from "@/app/components/featureComponents/ConfirmModalComponent";
import { PaymentModal } from "@/app/components/featureComponents/PaymentModal";
import { TableOrderModal } from "@/app/components/featureComponents/TableOrderModal";
import { ConfirmTypeEnum } from "@/public/enum/confirmModalEnum";

import { EditButtonGroup } from "./components/EditButtonGroup";
import { Header } from "./components/Header";
import { Table } from "./components/Table";

interface TableData {
  id: string;
  hasCustomers: boolean;
}

const Tables: TableData[] = [
  { id: "01", hasCustomers: false },
  { id: "02", hasCustomers: false },
  { id: "03", hasCustomers: true },
  { id: "04", hasCustomers: false },
  { id: "05", hasCustomers: false },
  { id: "06", hasCustomers: false },
  { id: "07", hasCustomers: true },
  { id: "08", hasCustomers: false },
  { id: "09", hasCustomers: true },
];

const TableRender = () => {
  const [tables, setTables] = useState<TableData[]>(Tables);

  const [currentTable, setCurrentTable] = useState<TableData | null>(null);

  const [showConfirmOpenBillModal, setShowConfirmOpenBillModal] =
    useState<Boolean>(false);

  const [showConfirmAddTableModal, setShowConfirmAddTableModal] =
    useState<Boolean>(false);

  const [showConfirmRemoveTableModal, setShowConfirmRemoveTableModal] =
    useState<Boolean>(false);

  const [showTableOrderModal, setShowTableOrderModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const [showConfirmCashPayment, setShowConfirmCashPayment] = useState<boolean>(false);
  const [showConfirmQRPayment, setShowConfirmQRPayment] = useState<boolean>(false);

  const [showPaymentSuccessModal, setShowPaymentSuccessModal] =
    useState<Boolean>(false);

  let [guests, setGuests] = useState<number>(0);

  function openTable(table: TableData): void {
    if (!table.hasCustomers) {
      setCurrentTable(table);
      setShowConfirmOpenBillModal(true);
    } else {
      setCurrentTable(table);
      setShowTableOrderModal(true);
    }
  }

  function handleGuests(operation: "+" | "-"): void {
    switch (operation) {
      case "+":
        setGuests(++guests);
        break;
      case "-":
        if (guests > 0) {
          setGuests(--guests);
        }
        break;
    }
  }

  function handleTables(operation: "+" | "-"): void {
    console.log(operation)
    switch (operation) {
      case "+":
        // Get the highest table ID and add 1 to create a new table
        const highestId = Math.max(
          ...tables.map((table) => parseInt(table.id))
        );
        const newId = (highestId + 1).toString().padStart(2, "0");

        setTables((prevTables) => [
          ...prevTables,
          { id: newId, hasCustomers: false },
        ]);
        break;

      case "-":
        // Remove the last table if it has no customers
        const lastTable = tables[tables.length - 1];
        if (!lastTable.hasCustomers) {
          setTables((prevTables) => prevTables.slice(0, -1));
        }
        break;
    }
  }

  function handleOpenBillConfirm(id: string): void {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === id
          ? { ...table, hasCustomers: !table.hasCustomers }
          : table
      )
    );
    reset();
  }

  function handleOpenBillCancel(): void {
    reset();
  }

  function handleAddTableConfirm(): void {
    handleTables("+");
    setShowConfirmAddTableModal(false);
  }

  function handleRemoveTableConfirm(): void {
    handleTables("-");
    setShowConfirmRemoveTableModal(false);
  }

  function handleConfirmPayment(): void {
   console.log("Payment Successful!")
   setShowPaymentSuccessModal(true);
   setShowConfirmCashPayment(false);
   setShowConfirmQRPayment(false);
  }

  function reset(): void {
    setShowTableOrderModal(false);
    setShowPaymentModal(false);
    setGuests(0);
    setCurrentTable(null);
    setShowConfirmOpenBillModal(false);
    setShowPaymentSuccessModal(false);
  }

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
            onClick={() => openTable(table)}
          />
        ))}
      </div>

      {/* Edit Table Button Group */}
      <div className="fixed bottom-8 right-8">
        <EditButtonGroup
          onAdd={() => setShowConfirmAddTableModal(!showConfirmAddTableModal)}
          onRemove={() =>
            setShowConfirmRemoveTableModal(!showConfirmRemoveTableModal)
          }
        />
      </div>

      {showConfirmOpenBillModal && currentTable && (
        <ConfirmModalComponent
          id={currentTable.id}
          confirmType={ConfirmTypeEnum.OpenBill}
          itemName={`Table ${currentTable.id}`}
          onConfirm={() => handleOpenBillConfirm(currentTable.id)}
          onCancel={handleOpenBillCancel}
          guests={guests}
          onMinus={() => handleGuests("-")}
          onPlus={() => handleGuests("+")}
        />
      )}

      {showConfirmAddTableModal && (
        <ConfirmModalComponent
          confirmType={ConfirmTypeEnum.AddTable}
          onConfirm={handleAddTableConfirm}
          onCancel={() => setShowConfirmAddTableModal(false)}
        />
      )}

      {showConfirmRemoveTableModal && (
        <ConfirmModalComponent
          confirmType={ConfirmTypeEnum.DeleteTable}
          onConfirm={handleRemoveTableConfirm}
          onCancel={() => setShowConfirmRemoveTableModal(false)}
        />
      )}

      {showTableOrderModal && currentTable && (
        <TableOrderModal
          isOpen={showTableOrderModal}
          onClose={() => setShowTableOrderModal(false)}
          tableId={currentTable.id}
          onCheckBill={() => setShowPaymentModal(true)}
        />
      )}

      {showPaymentModal && currentTable && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          tableId={currentTable.id}
          onCashPayment={() => setShowConfirmCashPayment(true)}
          onQRPayment={() => setShowConfirmQRPayment(true)}
        />
      )}

      {showConfirmCashPayment && (
        <ConfirmModalComponent
          confirmType={ConfirmTypeEnum.CashPayment}
          total={856}
          onConfirm={handleConfirmPayment}
          onCancel={() => setShowConfirmCashPayment(false)}
        />
      )}

      {showConfirmQRPayment && (
        <ConfirmModalComponent
          confirmType={ConfirmTypeEnum.QRPayment}
          total={856}
          qrUrl="https://media-cdn.tripadvisor.com/media/photo-s/17/92/17/25/thai-qr-payment.jpg"
          onConfirm={handleConfirmPayment}
          onCancel={() => setShowConfirmQRPayment(false)}
        />
      )}

      {showPaymentSuccessModal && (
        <ConfirmModalComponent
          confirmType={ConfirmTypeEnum.PaymentSuccess}
          onConfirm={() => setShowPaymentSuccessModal(false)}
          onCancel={() => setShowPaymentSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default TableRender;
