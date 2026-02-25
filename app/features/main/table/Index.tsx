"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ConfirmModalComponent } from "@/app/components/featureComponents/ConfirmModalComponent";
import { PaymentModal } from "@/app/components/featureComponents/PaymentModal";
import { TableOrderModal } from "@/app/components/featureComponents/TableOrderModal";
import { ConfirmTypeEnum } from "@/public/enum/confirmModalEnum";
import { createTable, deleteTable, getTables } from "@/services/table/tableApi";
import { ITableResponse } from "@/types/tableType";

import { EditButtonGroup } from "./components/EditButtonGroup";
import { Header } from "./components/Header";
import { Table } from "./components/Table";
import { TableAddDrawer } from "./components/TableAddDrawer";
import { TableData, TableEditDrawer } from "./components/TableEditDrawer";

const TableRender = () => {
  const router = useRouter();

  const [tables, setTables] = useState<TableData[]>([]);

  const [currentTable, setCurrentTable] = useState<TableData | null>(null);

  const [showConfirmOpenBillModal, setShowConfirmOpenBillModal] =
    useState<Boolean>(false);

  const [showTableAddDrawer, setShowTableAddDrawer] = useState<boolean>(false);
  const [showTableDeleteDrawer, setShowTableDeleteDrawer] =
    useState<boolean>(false);

  const [showTableOrderModal, setShowTableOrderModal] =
    useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const [showConfirmCashPayment, setShowConfirmCashPayment] =
    useState<boolean>(false);
  const [showConfirmQRPayment, setShowConfirmQRPayment] =
    useState<boolean>(false);

  const [showPaymentSuccessModal, setShowPaymentSuccessModal] =
    useState<Boolean>(false);

  let [guests, setGuests] = useState<number>(0);

  // ==========================================
  // 1. Fetch ข้อมูลจาก API เมื่อโหลด Component
  // ==========================================
  const fetchTables = async () => {
    try {
      const response = await getTables();
      if (response && response.data) {
        // Map ข้อมูลจาก API เข้ากับ State ของหน้าจอ
        const mappedTables = response.data.map((t: ITableResponse) => ({
          id: t.id.toString(), // ID ของ Database
          name: t.name, // ชื่อโต๊ะ
          hasCustomers: t.status !== 0, // สมมติว่า status 0 คือว่างเปล่า (ไม่มีลูกค้า)
        }));
        setTables(mappedTables);
      }
    } catch (error) {
      console.error("Failed to fetch tables:", error);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // ==========================================

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
        setGuests(guests + 1);
        break;
      case "-":
        if (guests > 0) {
          setGuests(guests - 1);
        }
        break;
    }
  }

  function handleOpenBillConfirm(id: string): void {
    // ตรงนี้อาจจะต้องต่อ API สำหรับการเปิดบิล (Open Bill) ในอนาคต
    // ชั่วคราว: อัปเดต State ล่วงหน้าไปก่อน
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

  function handleConfirmPayment(): void {
    console.log("Payment Successful!");
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
      <Header totalTable={tables.length} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {tables.map((table) => (
          <Table
            key={table.id}
            id={table.name}
            hasCustomers={table.hasCustomers}
            onClick={() => openTable(table)}
          />
        ))}
      </div>

      <div className="fixed bottom-8 right-8">
        <EditButtonGroup
          onAdd={() => setShowTableAddDrawer(true)}
          onRemove={() => setShowTableDeleteDrawer(true)}
        />
      </div>

      {/* Drawer สำหรับสร้างโต๊ะ */}
      <TableAddDrawer
        isOpen={showTableAddDrawer}
        onClose={() => setShowTableAddDrawer(false)}
        onSuccess={fetchTables}
      />

      {/* เรียกใช้งาน Drawer สำหรับลบโต๊ะ */}
      <TableEditDrawer
        isOpen={showTableDeleteDrawer}
        onClose={() => setShowTableDeleteDrawer(false)}
        onSuccess={fetchTables} // เมื่อลบสำเร็จให้โหลดข้อมูลโต๊ะใหม่
        tables={tables} // โยนข้อมูลโต๊ะเข้าไปให้ Dropdown ค้นหา
      />

      {showConfirmOpenBillModal && currentTable && (
        <ConfirmModalComponent
          id={currentTable.id}
          confirmType={ConfirmTypeEnum.OpenBill}
          itemName={`Table ${currentTable.name}`}
          onConfirm={() => handleOpenBillConfirm(currentTable.id)}
          onCancel={handleOpenBillCancel}
          guests={guests}
          onMinus={() => handleGuests("-")}
          onPlus={() => handleGuests("+")}
        />
      )}

      {showTableOrderModal && currentTable && (
        <TableOrderModal
          isOpen={showTableOrderModal}
          onClose={() => setShowTableOrderModal(false)}
          tableId={currentTable.id}
          onCheckBill={() => setShowPaymentModal(true)}
          onAddOrder={() => router.push(`/table/${currentTable.id}/add`)}
          onEditOrder={() => router.push(`/table/${currentTable.id}/edit`)}
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
          onConfirm={() => {
            setShowPaymentSuccessModal(false);
            fetchTables();
          }}
          onCancel={() => setShowPaymentSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default TableRender;
