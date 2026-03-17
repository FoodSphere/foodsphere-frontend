"use client";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "@/app/components/ui/toast/use-toast";
import { TableBillDrawer } from "@/app/features/main/table/components/TableBillDrawer";
import { TableBillPaymentDrawer } from "@/app/features/main/table/components/TableBillPaymentDrawer";
import { getCookie } from "@/libs/cookie";
import {
  completeBill,
  createBill,
  createOrderingPortal,
  getActiveBillByTableId,
  getPortalsByBillId,
} from "@/services/bill/billApi";
import {
  createCashPayment,
  verifyCashPayment,
} from "@/services/payment/paymentApi";
import { updateServiceRequestStatus } from "@/services/service-request/serviceRequestApi";
import {
  checkout,
  StripeVerificationResult,
  verifyCheckoutSession,
} from "@/services/stripe";
import { getTables } from "@/services/table/tableApi";
import { IBillResponse } from "@/types/billType";
import {
  EPaymentMethod,
  EServiceRequestReasonType,
  EServiceRequestStatus,
} from "@/types/enum";
import {
  CreatedServiceRequestFromSignalR,
  ServiceRequest,
  UpdatedServiceRequestFromSignalR,
} from "@/types/serviceRequestType";
import { ITableResponse } from "@/types/tableType";

import { EditButtonGroup } from "./components/EditButtonGroup";
import { Header } from "./components/Header";
import { Table } from "./components/Table";
import { TableAddDrawer } from "./components/TableAddDrawer";
import { TableBillConfirmCompleteModal } from "./components/TableBillConfirmCompleteModal";
import {
  PaymentMethod,
  TableBillConfirmPaymentModal,
} from "./components/TableBillConfirmPaymentModal";
import { TableData, TableEditDrawer } from "./components/TableEditDrawer";
import { TableOpenBillModal } from "./components/TableOpenBillModal";
import { TablePaymentFailedModal } from "./components/TablePaymentFailedModal";
import { TablePaymentSuccessModal } from "./components/TablePaymentSuccessModal";

const TableRender = () => {
  const router = useRouter();

  const [tables, setTables] = useState<TableData[]>([]);
  const [currentTable, setCurrentTable] = useState<TableData | null>(null);

  const [showTableAddDrawer, setShowTableAddDrawer] = useState<boolean>(false);
  const [showTableDeleteDrawer, setShowTableDeleteDrawer] =
    useState<boolean>(false);

  const [showConfirmOpenBillModal, setShowConfirmOpenBillModal] =
    useState<boolean>(false);

  const [showConfirmCompleteBillModal, setShowConfirmCompleteBillModal] =
    useState<boolean>(false);

  const [activeBillData, setActiveBillData] = useState<IBillResponse | null>(
    null
  );

  const [showTableBillDrawer, setShowTableBillDrawer] =
    useState<boolean>(false);
  const [qrData, setQrData] = useState<string>("");
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);

  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const [showConfirmPaymentModal, setShowConfirmPaymentModal] =
    useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const [paymentTotal, setPaymentTotal] = useState<number>(0);
  const [paymentTableName, setPaymentTableName] = useState<string>("");
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] =
    useState<boolean>(false);
  const [showPaymentFailedModal, setShowPaymentFailedModal] =
    useState<boolean>(false);
  const [stripeResult, setStripeResult] =
    useState<StripeVerificationResult | null>(null);

  const searchParams = useSearchParams();

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

    try {
      const accessToken = getCookie("access_token");
      const restaurantId = getCookie("restaurant_id");

      if (!accessToken || !restaurantId) {
        throw new Error("Access token or restaurant ID not found");
      }

      const connect = new signalR.HubConnectionBuilder()
        .withUrl(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/restaurants/${restaurantId}/branches/1/hubs/pos`,
          {
            accessTokenFactory: () => `${accessToken}`,
          }
        )
        .withAutomaticReconnect()
        .build();
      connect.start().catch((err) => {
        console.error("Error while connecting to SignalR Hub:", err);
        throw err;
      });

      connect.on(
        "service_request_created",
        (serviceRequest: CreatedServiceRequestFromSignalR) => {
          if (
            serviceRequest.reason === EServiceRequestReasonType.CASH_PAYMENT
          ) {
            console.log("Cash Payment");
          } else if (
            serviceRequest.reason === EServiceRequestReasonType.CALL_WAITER
          ) {
            console.log("Call Waiter!");
          }
          const newServiceRequest: ServiceRequest = {
            id: serviceRequest.id,
            create_time: serviceRequest.create_time,
            update_time: serviceRequest.update_time,
            reason: serviceRequest.reason,
            status: serviceRequest.status,
          };
          setServiceRequests((prev) => [...prev, newServiceRequest]);
        }
      );

      connect.on(
        "service_request_status_updated",
        (serviceRequest: UpdatedServiceRequestFromSignalR) => {
          setServiceRequests((prev) => {
            const isFinished =
              serviceRequest.status == EServiceRequestStatus.DONE ||
              serviceRequest.status == EServiceRequestStatus.CANCELLED;

            if (isFinished) {
              return prev.filter((sr) => sr.id !== serviceRequest.resource.id);
            }

            const findServiceRequest = prev.find(
              (sr) => sr.id === serviceRequest.resource.id
            );
            if (!findServiceRequest) {
              return prev;
            }
            const updatedServiceRequest: ServiceRequest = {
              id: findServiceRequest.id,
              create_time: findServiceRequest.create_time,
              update_time: findServiceRequest.update_time,
              reason: findServiceRequest.reason,
              status: serviceRequest.status,
            };
            return prev.map((sr) =>
              sr.id === serviceRequest.resource.id ? updatedServiceRequest : sr
            );
          });
        }
      );

      return () => {
        connect.stop();
      };
    } catch (error) {
      console.error("Failed to connect to SignalR Hub:", error);
      toast({
        title: "Error",
        description: "Failed to connect to SignalR Hub",
      });
      throw error;
    }
  }, []);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const paymentMethod = searchParams.get("payment_method");
    const billId = searchParams.get("bill_id");
    const cancel = searchParams.get("cancel");
    const paymentId = searchParams.get("payment_id");

    if (cancel && billId) {
      setShowPaymentFailedModal(true);
      const result = {
        success: false,
        status: "FAILED",
        customer_email: "N/A",
        amount_total: 0,
        bill_id: null,
        table_name: null,
        payment_method: null,
        error: "Payment cancelled",
      };
      setStripeResult(result);
    }

    if (paymentId && paymentMethod === EPaymentMethod.CASH && billId) {
      const verify = async () => {
        try {
          const result = await verifyCashPayment(paymentId, billId);
          setStripeResult(result);
          if (result.success) {
            setShowPaymentSuccessModal(true);
          } else {
            setShowPaymentFailedModal(true);
          }
        } catch (error) {
          console.error("Failed to verify cash payment:", error);
          toast({ variant: "error", title: "Failed to verify cash payment" });
        } finally {
          // Remove query params to prevent refetching on reload
          router.replace("/table");
        }
      };
      verify();
    }
    if (sessionId && paymentMethod === EPaymentMethod.PROMPTPAY && billId) {
      const verify = async () => {
        try {
          const result = await verifyCheckoutSession(sessionId, billId);
          setStripeResult(result);
          if (result.success) {
            setShowPaymentSuccessModal(true);
          } else {
            setShowPaymentFailedModal(true);
          }
        } catch (error) {
          console.error("Failed to verify QR payment:", error);
          toast({ variant: "error", title: "Failed to verify QR payment" });
        } finally {
          // Remove query params to prevent refetching on reload
          router.replace("/table");
        }
      };
      verify();
    }
  }, [searchParams, router]);

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
        console.log(billResponse);

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

  async function handleConfirmPaymentFinished(): Promise<void> {
    if (!activeBillData?.id) {
      toast({ variant: "error", title: "Bill not found" });
      return;
    }
    if (paymentMethod === EPaymentMethod.CASH) {
      await createCashPayment(activeBillData.id);
    } else if (paymentMethod === EPaymentMethod.PROMPTPAY) {
      await checkout(paymentTotal, paymentTableName, activeBillData.id);
    }
    await fetchTables();
    resetState();
  }

  async function handleConfirmCompleteBill() {
    if (!activeBillData?.id) {
      toast({ variant: "error", title: "Bill not found" });
      return;
    }
    await completeBill(activeBillData.id);
    await fetchTables();
    resetState();
  }

  async function handleActionServiceRequest(
    id: string,
    status: EServiceRequestStatus
  ) {
    console.log("handleActionServiceRequest", id, status);
    if (!activeBillData?.id) {
      toast({ variant: "error", title: "Bill not found" });
      return;
    }
    await updateServiceRequestStatus(id, activeBillData.id, status);
  }

  function resetState() {
    setShowPaymentSuccessModal(false);
    setShowPaymentFailedModal(false);
    setShowConfirmPaymentModal(false);
    setShowConfirmOpenBillModal(false);
    setShowConfirmCompleteBillModal(false);
    setShowTableBillDrawer(false);
    setShowPaymentModal(false);
    setCurrentTable(null);
    setActiveBillData(null);
    setPaymentMethod(null);
    setPaymentTotal(0);
    setPaymentTableName("");
    setQrData("");
  }

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen">
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
          serviceRequests={serviceRequests}
          onCheckBill={() => setShowPaymentModal(true)}
          onCompleteBill={() => setShowConfirmCompleteBillModal(true)}
          onAddOrder={() => router.push(`/table/${currentTable.id}/add`)}
          onEditOrder={() => router.push(`/table/${currentTable.id}/edit`)}
          onAcknowledgeServiceRequest={(id) =>
            handleActionServiceRequest(id, EServiceRequestStatus.ACKNOWLEDGED)
          }
          onDoneServiceRequest={(id) =>
            handleActionServiceRequest(id, EServiceRequestStatus.DONE)
          }
        />
      )}

      {showPaymentModal && currentTable && (
        <TableBillPaymentDrawer
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          tableId={currentTable.id}
          billId={activeBillData?.id}
          onCashPayment={(total, tName) =>
            handleOpenConfirmPayment(EPaymentMethod.CASH, total, tName)
          }
          onQRPayment={(total, tName) =>
            handleOpenConfirmPayment(EPaymentMethod.PROMPTPAY, total, tName)
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

      {/* TableBillConfirmCompleteModal */}
      {showConfirmCompleteBillModal && currentTable && (
        <TableBillConfirmCompleteModal
          isOpen={showConfirmCompleteBillModal}
          onClose={() => setShowConfirmCompleteBillModal(false)}
          onConfirm={handleConfirmCompleteBill}
        />
      )}

      {/* Payment Success Modal */}
      {showPaymentSuccessModal && stripeResult && (
        <TablePaymentSuccessModal
          isOpen={!!showPaymentSuccessModal}
          tableName={stripeResult.table_name || "N/A"}
          status={stripeResult.status || "COMPLETED"}
          amountTotal={stripeResult.amount_total}
          paymentMethod={stripeResult.payment_method || "CASH"}
          onClose={() => {
            resetState();
          }}
        />
      )}

      {/* Payment Failed Modal */}
      {showPaymentFailedModal && stripeResult && (
        <TablePaymentFailedModal
          isOpen={!!showPaymentFailedModal}
          tableName={stripeResult.table_name || "N/A"}
          status={stripeResult.status || "FAILED"}
          paymentMethod={stripeResult.payment_method || "CASH"}
          error={stripeResult.error || "Payment failed"}
          onClose={() => {
            resetState();
          }}
        />
      )}
    </div>
  );
};

export default TableRender;
