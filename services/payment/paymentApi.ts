import { getCookie } from "@/libs/cookie";
import { CashPaymentResponse } from "@/types/paymentType";

import { apiDelete, apiGet, apiPost, apiPut } from "../common";
import { redirect } from "next/navigation";
import { ECashPaymentStatus, ECashPaymentStatusNumber } from "@/types/enum";

export const getRestaurantId = () => {
  const restaurantId = getCookie("restaurant_id");
  if (!restaurantId) {
    throw new Error("Restaurant ID not found in cookies");
  }
  return restaurantId;
};

export const createCashPayment = async (billId: string) => {
  const restaurantId = getRestaurantId();
  const res = await apiPost(
    `/restaurants/${restaurantId}/bills/${billId}/cash-payments`,
    {}
  );
  const cashPayment = res.data as CashPaymentResponse;

  const redirectUrl = `/table?payment_id=${cashPayment.id}&payment_method=${cashPayment.payment_method}&bill_id=${cashPayment.bill_id}`;
  return redirect(redirectUrl);
};

export const verifyCashPayment = async (paymentId: string, billId: string) => {
  const restaurantId = getRestaurantId();

  try {
    const res = await apiGet(
      `/restaurants/${restaurantId}/bills/${billId}/payments/${paymentId}`
    );
    console.log(res);

    if (res && res.statusCode === 200) {
      const cashPayment = res.data as CashPaymentResponse;
      return {
        success: true,
        status: mapPaymentStatus(cashPayment.status),
        customer_email: "N/A",
        amount_total: cashPayment.amount,
        bill_id: cashPayment.bill_id,
        table_name: cashPayment.table.name,
        payment_method: cashPayment.payment_method,
        error:
          cashPayment.status !== ECashPaymentStatusNumber.SUCCEEDED
            ? "Payment not completed"
            : null,
      };
    }

    return {
      success: false,
      status: "error",
      customer_email: "N/A",
      amount_total: 0,
      bill_id: null,
      table_name: null,
      payment_method: null,
      error: "Invalid session",
    };
  } catch (error) {
    console.error("Error verifying cash payment:", error);
    return {
      success: false,
      status: "error",
      customer_email: "N/A",
      amount_total: 0,
      bill_id: null,
      table_name: null,
      payment_method: null,
      error: "Invalid session",
    };
  }
};

const mapPaymentStatus = (status: ECashPaymentStatusNumber) => {
  switch (status) {
    case ECashPaymentStatusNumber.SUCCEEDED:
      return ECashPaymentStatus.SUCCEEDED;
    case ECashPaymentStatusNumber.PENDING:
      return ECashPaymentStatus.PENDING;
    case ECashPaymentStatusNumber.FAILED:
      return ECashPaymentStatus.FAILED;
    case ECashPaymentStatusNumber.REFUNDED:
      return ECashPaymentStatus.REFUNDED;
    default:
      return ECashPaymentStatus.FAILED;
  }
};
