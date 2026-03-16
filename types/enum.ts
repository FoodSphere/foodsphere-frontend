export enum EHttpStatusCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
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
