"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ConfirmModalComponent } from "@/app/components/featureComponents/ConfirmModalComponent";
import { PaymentModal } from "@/app/components/featureComponents/PaymentModal";
import { TableBillDrawer } from "@/app/features/main/table/components/TableBillDrawer";
import { ConfirmTypeEnum } from "@/public/enum/confirmModalEnum";
import { createBill, getActiveBillByTableId } from "@/services/bill/billApi";
import { getTables } from "@/services/table/tableApi";
import { IBillResponse } from "@/types/billType";
import { ITableResponse } from "@/types/tableType";

import { EditButtonGroup } from "./components/EditButtonGroup";
import { Header } from "./components/Header";
import { Table } from "./components/Table";
import { TableAddDrawer } from "./components/TableAddDrawer";
import { TableData, TableEditDrawer } from "./components/TableEditDrawer";
import { TableOpenBillModal } from "./components/TableOpenBillModal";

const TableRender = () => {
  const router = useRouter();

  const [tables, setTables] = useState<TableData[]>([]);
  const [currentTable, setCurrentTable] = useState<TableData | null>(null);

  const [showTableAddDrawer, setShowTableAddDrawer] = useState<boolean>(false);
  const [showTableDeleteDrawer, setShowTableDeleteDrawer] =
    useState<boolean>(false);

  const [showConfirmOpenBillModal, setShowConfirmOpenBillModal] =
    useState<Boolean>(false);

  const [activeBillData, setActiveBillData] = useState<IBillResponse | null>(
    null
  );

  const [showTableBillDrawer, setShowTableBillDrawer] =
    useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const [showConfirmCashPayment, setShowConfirmCashPayment] =
    useState<boolean>(false);
  const [showConfirmQRPayment, setShowConfirmQRPayment] =
    useState<boolean>(false);

  const [showPaymentSuccessModal, setShowPaymentSuccessModal] =
    useState<Boolean>(false);

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
          hasCustomers: t.status !== 0, // status 0 คือไม่มีลูกค้า
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

  async function openTable(table: TableData): Promise<void> {
    if (!table.hasCustomers) {
      setCurrentTable(table);
      setShowConfirmOpenBillModal(true);
    } else {
      setCurrentTable(table);

      try {
        // Fetch หา Bill ของโต๊ะนี้
        const billResponse = await getActiveBillByTableId(Number(table.id));

        if (billResponse && billResponse.data) {
          setActiveBillData(billResponse.data); // เก็บข้อมูล Bill ใส่ State
        } else {
          setActiveBillData(null);
        }

        setShowTableBillDrawer(true); // เปิด Drawer หลัง Fetch เสร็จ
      } catch (error) {
        console.error("Failed to fetch bill for table:", error);
        // ถ้า Fetch พลาด อาจจะเปิด Drawer เปล่าๆ หรือทำ Alert แจ้ง Error
        setShowTableBillDrawer(true);
      }
    }
  }

  // ปรับฟังก์ชัน handleOpenBillConfirm ให้เป็น async
  async function handleOpenBillConfirm(
    id: string,
    guests: number
  ): Promise<void> {
    try {
      const payload = {
        table_id: Number(id),
        pax: guests,
      };

      // ยิง API
      console.log(
        `Sending API to create bill for table ${id} with ${guests} guests`
      );
      const response = await createBill(payload);

      // จัดการผลลัพธ์
      if (response && response.statusCode === 201) {
        // เมื่อสร้างบิลสำเร็จ ให้เรียก fetchTables ใหม่เพื่ออัปเดตสถานะโต๊ะ (hasCustomers)
        await fetchTables();

        // ปิด Modal ต่างๆ
        reset();
      }
    } catch (error) {
      console.error("Failed to create bill:", error);
    }
  }

  function handleConfirmPayment(): void {
    console.log("Payment Successful!");
    setShowPaymentSuccessModal(true);
    setShowConfirmCashPayment(false);
    setShowConfirmQRPayment(false);
  }

  function reset(): void {
    setShowTableBillDrawer(false);
    setShowPaymentModal(false);
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

      {/* Open Bill Table */}
      {showConfirmOpenBillModal && currentTable && (
        <TableOpenBillModal
          isOpen={!!showConfirmOpenBillModal}
          tableId={currentTable.id}
          tableName={currentTable.name}
          onClose={() => setShowConfirmOpenBillModal(false)}
          onConfirm={handleOpenBillConfirm}
        />
      )}

      {/* TableBillDrawer */}
      {showTableBillDrawer && currentTable && (
        <TableBillDrawer
          isOpen={showTableBillDrawer}
          onClose={() => setShowTableBillDrawer(false)}
          tableName={currentTable.name}
          billData={activeBillData} // โยนข้อมูลที่ดึงมาเข้าไป
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
