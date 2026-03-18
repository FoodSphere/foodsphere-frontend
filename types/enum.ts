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
  ORDER = 1,
  TABLE = 2,
  STOCK = 2000,
  MENU = 3000,
  RESTAURANT = 1010,
}

export const PAGE_CORE_PERMISSIONS: Record<string, number[]> = {
  "/": [EPermission.DASHBOARD],
  "/order": [EPermission.ORDER],
  "/table": [EPermission.TABLE],
  "/stock": [EPermission.STOCK],
  "/menu": [EPermission.MENU],
  "/restaurant": [EPermission.RESTAURANT],
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

export enum EMenuStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  OUT_OF_STOCK = 2,
}
