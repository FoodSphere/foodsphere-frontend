"use client";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
import {
  getServiceRequests,
  updateServiceRequestStatus,
} from "@/services/service-request/serviceRequestApi";
import {
  checkout,
  StripeVerificationResult,
  verifyCheckoutSession,
} from "@/services/stripe";
import { getTables } from "@/services/table/tableApi";
import {
  CreatedBillFromSignalR,
  IBillOrder,
  IBillResponse,
  UpdatedBillFromSignalR,
} from "@/types/billType";
import {
  EBillStatus,
  EPaymentMethod,
  EServiceRequestReasonType,
  EServiceRequestStatus,
  ETableStatus,
} from "@/types/enum";
import {
  ICreateOrderFromSignalR,
  IUpdateOrderItemFromSignalR,
  IUpdateOrderStatusFromSignalR,
} from "@/types/orderType";
import {
  CreatedServiceRequestFromSignalR,
  ServiceRequest,
  UpdatedServiceRequestFromSignalR,
} from "@/types/serviceRequestType";
import { ITableResponse, UpdatedTableFromSignalR } from "@/types/tableType";

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
  const pathname = usePathname();

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
        const mappedTables = await Promise.all(
          response.data.map(async (t: ITableResponse) => ({
            id: t.id.toString(), // ID ของ Database
            name: t.name, // ชื่อโต๊ะ
            hasCustomers: t.status !== 0, // status 0 คือไม่มีลูกค้า
            billId: (await getActiveBillByTableId(t.id))?.data.id || null,
          }))
        );

        setTables(mappedTables);
        console.log(mappedTables);
      }
    } catch (error) {
      console.error("Failed to fetch tables:", error);
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const response = await getServiceRequests();
      if (response && response.data) {
        setServiceRequests(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch service requests:", error);
    }
  };

  useEffect(() => {
    fetchTables();
    fetchServiceRequests();

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
        "order_created",
        async (createdOrder: ICreateOrderFromSignalR) => {
          if (!createdOrder || !createdOrder.items) return;

          try {
            // Construct the new IBillOrder object correctly from SignalR data
            const newBillOrder: IBillOrder = {
              id: createdOrder.id,
              create_time: createdOrder.create_time,
              update_time: createdOrder.update_time,
              delete_time: createdOrder.delete_time,
              bill_id: createdOrder.bill_id,
              status: createdOrder.status,
              items: createdOrder.items.map((item) => ({
                id: Number(item.id),
                create_time: item.create_time,
                update_time: item.update_time,
                bill_id: item.bill_id,
                order_id: Number(item.order_id),
                restaurant_id: item.restaurant_id,
                menu_id: item.menu_id,
                price_snapshot: item.price_snapshot,
                quantity: item.quantity,
                note: item.note,
              })),
            };

            setActiveBillData((prevActiveBillData) => {
              // Only update if the order belongs to the currently displayed bill
              if (
                !prevActiveBillData ||
                prevActiveBillData.id !== createdOrder.bill_id
              ) {
                return prevActiveBillData;
              }

              const updatedOrders = [
                ...prevActiveBillData.orders,
                newBillOrder,
              ];
              updatedOrders.sort(
                (a, b) =>
                  new Date(b.create_time).getTime() -
                  new Date(a.create_time).getTime()
              );

              return {
                ...prevActiveBillData,
                orders: updatedOrders,
              };
            });
          } catch (err) {
            console.error("Error processing new order:", err);
          }
        }
      );

      connect.on(
        "order_status_updated",
        async (updatedOrder: IUpdateOrderStatusFromSignalR) => {
          setActiveBillData((prev) => {
            if (!prev || prev.id !== updatedOrder.resource.billId) return prev;
            return {
              ...prev,
              orders: prev.orders.map((order) => {
                if (order.id === updatedOrder.resource.id) {
                  return {
                    ...order,
                    status: updatedOrder.status,
                  };
                }
                return order;
              }),
            };
          });
        }
      );

      connect.on(
        "order_item_updated",
        async (updatedOrder: IUpdateOrderItemFromSignalR) => {
          setActiveBillData((prev) => {
            if (!prev || prev.id !== updatedOrder.bill_id) return prev;
            return {
              ...prev,
              orders: prev.orders.map((order) => {
                if (order.id === updatedOrder.order_id) {
                  return {
                    ...order,
                    items: order.items.map((item) => {
                      if (item.id === updatedOrder.id) {
                        return {
                          ...item,
                          quantity: updatedOrder.quantity,
                          note: updatedOrder.note,
                        };
                      }
                      return item;
                    }),
                  };
                }
                return order;
              }),
            };
          });
        }
      );

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
            bill_id: serviceRequest.bill_id,
            table: serviceRequest.table,
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
              bill_id: findServiceRequest.bill_id,
              table: findServiceRequest.table,
              reason: findServiceRequest.reason,
              status: serviceRequest.status,
            };
            return prev.map((sr) =>
              sr.id === serviceRequest.resource.id ? updatedServiceRequest : sr
            );
          });
        }
      );

      connect.on(
        "table_status_updated",
        (updatedTable: UpdatedTableFromSignalR) => {
          console.log("Table Status Updated", updatedTable);
          setTables((prev) => {
            return prev.map((table) => {
              if (Number(table.id) === updatedTable.resource.id) {
                console.log(table.name);
                return {
                  ...table,
                  status: updatedTable.status,
                  hasCustomers: updatedTable.status === ETableStatus.OCCUPIED,
                };
              }
              return table;
            });
          });
        }
      );

      connect.on(
        "bill_status_updated",
        (updatedBill: UpdatedBillFromSignalR) => {
          if (updatedBill.status === EBillStatus.PAID) {
            setActiveBillData((prev) => {
              if (!prev || prev.id !== updatedBill.resource.id) return prev;
              return {
                ...prev,
                status: updatedBill.status,
              };
            });
            toast({
              title: "Payment Success",
              description: "Payment has been processed successfully",
            });
          } else if (updatedBill.status === EBillStatus.COMPLETED) {
            setActiveBillData((prev) => {
              if (!prev || prev.id !== updatedBill.resource.id) return prev;
              return {
                ...prev,
                status: updatedBill.status,
              };
            });
            setShowTableBillDrawer(false);
            toast({
              title: "Bill Completed",
              description: "Bill has been completed",
            });
          }
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
    const tableId = searchParams.get("table_id");
    const billId = searchParams.get("bill_id");
    const cancel = searchParams.get("cancel");
    const paymentId = searchParams.get("payment_id");

    if (tableId) {
      const getActiveBill = async () => {
        const activeBillIdResponse = await getActiveBillByTableId(
          Number(tableId)
        );
        const activeBillId = activeBillIdResponse?.data?.id;
        if (activeBillId) {
          const currentTableData = {
            id: tableId,
            name: currentTable?.name || "",
            hasCustomers: true,
            billId: activeBillId,
          };
          openTable(currentTableData);
          router.replace("/table");
        }
      };
      getActiveBill();
    }

    const clearQueryParams = () => {
      router.replace(pathname, { scroll: false });
      window.history.replaceState(null, "", window.location.pathname);
    };

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
      clearQueryParams();
      return;
    }

    if (paymentId && paymentMethod === EPaymentMethod.CASH && billId) {
      // เช็คว่าเคย Verify Payment ID นี้ไปหรือยัง
      const isProcessed = sessionStorage.getItem(
        `processed_payment_${paymentId}`
      );
      if (isProcessed) {
        clearQueryParams();
        return;
      }

      const verify = async () => {
        try {
          sessionStorage.setItem(`processed_payment_${paymentId}`, "true"); // มาร์คว่ากำลังทำ/ทำเสร็จแล้ว
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
          sessionStorage.removeItem(`processed_payment_${paymentId}`); // ลบออกถ้าพัง จะได้ลองใหม่ได้
        } finally {
          clearQueryParams();
        }
      };
      verify();
    }

    if (sessionId && paymentMethod === EPaymentMethod.PROMPTPAY && billId) {
      // เช็คว่าเคย Verify Session ID นี้ไปหรือยัง
      const isProcessed = sessionStorage.getItem(
        `processed_session_${sessionId}`
      );
      if (isProcessed) {
        clearQueryParams();
        return;
      }

      const verify = async () => {
        try {
          sessionStorage.setItem(`processed_session_${sessionId}`, "true"); // มาร์คว่ากำลังทำ/ทำเสร็จแล้ว
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
          sessionStorage.removeItem(`processed_session_${sessionId}`); // ลบออกถ้าพัง จะได้ลองใหม่ได้
        } finally {
          clearQueryParams();
        }
      };
      verify();
    }
  }, [searchParams, pathname, router]);

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
              console.log(url);
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
          billId: newBillId,
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
            badge={
              serviceRequests.filter(
                (request) =>
                  request.table.id == Number(table.id) &&
                  request.bill_id === table.billId
              ).length
            }
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
          serviceRequests={serviceRequests.filter(
            (request) =>
              request.table.id == Number(currentTable.id) &&
              request.bill_id === activeBillData?.id
          )}
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
            setShowPaymentSuccessModal(false);
            setShowPaymentModal(false);
            setShowConfirmPaymentModal(false);
            router.replace("/table");
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
