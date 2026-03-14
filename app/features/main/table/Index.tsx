"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { TableBillDrawer } from "@/app/features/main/table/components/TableBillDrawer";
import { TableBillPaymentDrawer } from "@/app/features/main/table/components/TableBillPaymentDrawer";
import {
  createBill,
  createOrderingPortal,
  getActiveBillByTableId,
  getPortalsByBillId,
} from "@/services/bill/billApi";
import { getTables } from "@/services/table/tableApi";
import { IBillResponse } from "@/types/billType";
import { ITableResponse } from "@/types/tableType";

import { EditButtonGroup } from "./components/EditButtonGroup";
import { Header } from "./components/Header";
import { Table } from "./components/Table";
import { TableAddDrawer } from "./components/TableAddDrawer";
import { PaymentMethod, TableBillConfirmPaymentModal } from "./components/TableBillConfirmPaymentModal";
import { TableData, TableEditDrawer } from "./components/TableEditDrawer";
import { TableOpenBillModal } from "./components/TableOpenBillModal";
import { TablePaymentSuccessModal } from "./components/TablePaymentSuccessModal";

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
  const [qrData, setQrData] = useState<string>("");

  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const [showConfirmPaymentModal, setShowConfirmPaymentModal] =
    useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [paymentTotal, setPaymentTotal] = useState<number>(0);
  const [paymentTableName, setPaymentTableName] = useState<string>("");
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
    setQrData("");

    if (!table.hasCustomers) {
      setCurrentTable(table);
      setShowConfirmOpenBillModal(true);
    } else {
      setCurrentTable(table);

      try {
        // Fetch หา Bill ของโต๊ะนี้
        const billResponse = await getActiveBillByTableId(Number(table.id));

        if (billResponse && billResponse.data) {
          const activeBill = billResponse.data;
          setActiveBillData(activeBill); // เก็บข้อมูล Bill ใส่ State

          // ดึงข้อมูล Portals ของ Bill นี้
          try {
            const portalsRes = await getPortalsByBillId(activeBill.id);
            if (portalsRes && portalsRes.data && portalsRes.data.length > 0) {
              const activePortal = portalsRes.data[0]; // ดึงตัวแรกมาใช้งาน
              console.log(activePortal.id);
              const customerBaseUrl = process.env.NEXT_PUBLIC_CUSTOMER_BASE_URL;
              const url = `${customerBaseUrl}/portals/${activePortal.id}`;
              setQrData(url);
            }
          } catch (portalError) {
            console.error("Failed to fetch portals:", portalError);
          }
        } else {
          setActiveBillData(null);
        }

        setShowTableBillDrawer(true); // เปิด Drawer หลัง Fetch เสร็จ
      } catch (error) {
        console.error("Failed to fetch bill for table:", error);
        setShowTableBillDrawer(true);
      }
    }
  }

  async function handleOpenBillConfirm(
    id: string,
    guests: number
  ): Promise<void> {
    try {
      const payload = {
        table_id: Number(id),
        pax: guests,
      };

      const response = await createBill(payload);

      if (
        response &&
        (response.statusCode === 201 || response.statusCode === 200)
      ) {
        const newBillId = response.data.id;

        const portalPayload = { max_usage: guests, valid_duration: null };
        const portalRes = await createOrderingPortal(newBillId, portalPayload);

        if (portalRes && portalRes.data) {
          const customerBaseUrl = process.env.NEXT_PUBLIC_CUSTOMER_BASE_URL;
          const url = `${customerBaseUrl}/portals/${portalRes.data.id}`;
          setQrData(url);
        }

        // ปิด Modal ทันที
        setShowConfirmOpenBillModal(false);

        // ดึงข้อมูลโต๊ะใหม่
        await fetchTables();

        // บังคับให้ hasCustomers เป็น true เพื่อให้เข้าเงื่อนไขเปิด Drawer เสมอ
        const currentTableData = {
          id: id,
          name: currentTable?.name || "",
          hasCustomers: true,
        };
        openTable(currentTableData);
      }
    } catch (error) {
      console.error("Failed to create bill or portal:", error);
    }
  }

  const handleOpenConfirmPayment = (
    method: PaymentMethod,
    total: number,
    tableName: string
  ) => {
    setPaymentMethod(method);
    setPaymentTotal(total);
    setPaymentTableName(tableName);
    setShowConfirmPaymentModal(true);
  };

  function handleConfirmPaymentFinished(): void {
    // ปิด Modal ยืนยันจ่ายเงิน
    setShowConfirmPaymentModal(false);
    // หากจ่ายสำเร็จ คุณสามารถเลือกปิด Payment Drawer ด้วยก็ได้
    setShowPaymentModal(false);
    // แสดง Modal Success
    setShowPaymentSuccessModal(true);
    // โหลดข้อมูลโต๊ะใหม่
    fetchTables();
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
          billData={activeBillData}
          qrUrl={qrData}
          onCheckBill={() => setShowPaymentModal(true)}
          onAddOrder={() => router.push(`/table/${currentTable.id}/add`)}
          onEditOrder={() => router.push(`/table/${currentTable.id}/edit`)}
        />
      )}

      {showPaymentModal && currentTable && (
        <TableBillPaymentDrawer
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          tableId={currentTable.id}
          billId={activeBillData?.id}
          onCashPayment={(total, tName) =>
            handleOpenConfirmPayment("cash", total, tName)
          }
          onQRPayment={(total, tName) =>
            handleOpenConfirmPayment("qr", total, tName)
          }
        />
      )}

      {/* TableBillConfirmPaymentModal */}
      {showConfirmPaymentModal && currentTable && (
        <TableBillConfirmPaymentModal
          isOpen={showConfirmPaymentModal}
          method={paymentMethod}
          totalAmount={paymentTotal}
          tableName={paymentTableName}
          billId={activeBillData?.id}
          onClose={() => setShowConfirmPaymentModal(false)}
          onConfirm={handleConfirmPaymentFinished}
        />
      )}

      {/* Payment Success Modal */}
      {showPaymentSuccessModal && (
        <TablePaymentSuccessModal
          isOpen={!!showPaymentSuccessModal}
          onClose={() => {
            setShowPaymentSuccessModal(false);
            setCurrentTable(null);
            setShowTableBillDrawer(false);
          }}
        />
      )}
    </div>
  );
};

export default TableRender;
