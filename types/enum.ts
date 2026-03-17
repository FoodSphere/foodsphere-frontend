export enum EHttpStatusCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INVALID_TOKEN = 498,
  SERVER_ERROR = 500,
}

export enum ESort {
  ASC = "asc",
  DESC = "desc",
}

export enum EPaymentMethod {
  CASH = "cash",
  PROMPTPAY = "promptpay",
}

export enum EStripePaymentStatus {
  PAID = "paid",
  UNPAID = "unpaid",
  NO_PAYMENT_REQUIRED = "no_payment_required",
  CANCELLED = "cancelled",
}

export enum ECashPaymentStatus {
  PENDING = "pending",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum ECashPaymentStatusNumber {
  PENDING = 0,
  SUCCEEDED = 1,
  FAILED = 2,
  REFUNDED = 3,
}

export enum EBillStatus {
  OPEN = 0,
  PAID = 1,
  COMPLETED = 2,
  CANCELLED = 3,
}

export enum EUserType {
  MASTER = "Master",
  WORKER = "Worker",
  CUSTOMER = "Customer",
}

export enum EPermission {
  DASHBOARD = 8000,
  ORDER = 7020,
  TABLE = 6000,
  STOCK = 2000,
  MENU = 3000,
  RESTAURANT = 1000,
}

export const PAGE_CORE_PERMISSIONS: Record<string, number[]> = {
  "/": [8000],
  "/order": [7020, 7030],
  "/table": [6000, 6010, 7000, 7010],
  "/stock": [2000, 2020],
  "/menu": [3000, 3010],
  "/restaurant": [1000, 1010, 9000, 9010, 9020, 9030],
};

export enum EServiceRequestStatus {
  PENDING = 0,
  ACKNOWLEDGED = 1,
  DONE = 2,
  CANCELLED = 3,
}

export enum EServiceRequestReasonType {
  CALL_WAITER = "call_waiter",
  CASH_PAYMENT = "cash_payment"
}
