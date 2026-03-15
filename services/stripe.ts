"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";

import { EPaymentMethod, EPaymentStatus } from "@/types/enum";

const connectedAccountId = "acct_1SDkwz781n9LFcRD";

export async function checkout(
  totalPrice: number,
  tableName: string,
  billId: string | null
) {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

  if (!STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY is not defined in the server environment");
    throw new Error("STRIPE_SECRET_KEY is not defined");
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    typescript: true,
  });

  try {
    if (!billId) {
      throw new Error("Bill ID is required");
    }
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: [EPaymentMethod.PROMPTPAY],
      line_items: [
        {
          price_data: {
            currency: "thb",
            product_data: {
              name: `Table ${tableName}`,
            },
            unit_amount: Math.round((totalPrice as number) * 100),
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        transfer_data: {
          destination: connectedAccountId,
        },
        metadata: {
          bill_id: billId,
          table_name: tableName,
          payment_method: EPaymentMethod.PROMPTPAY,
        },
      },
      metadata: {
        bill_id: billId,
        table_name: tableName,
        payment_method: EPaymentMethod.PROMPTPAY,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/table?session_id={CHECKOUT_SESSION_ID}&payment_method=promptpay&bill_id=${billId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/table`,
    });
    return redirect(session.url as string);
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    throw error;
  }
}

export interface StripeVerificationResult {
  success: boolean;
  status: string;
  customer_email: string;
  amount_total: number;
  bill_id: string | null;
  table_name: string | null;
  error: string | null;
  payment_method: string | null;
}

export async function verifyCheckoutSession(
  sessionId: string,
  billId: string
): Promise<StripeVerificationResult> {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

  if (!STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined");
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    typescript: true,
  });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session && session.metadata?.bill_id === billId) {
      return {
        success: session.payment_status === EPaymentStatus.PAID,
        status: session.payment_status,
        customer_email: session.customer_details?.email || "N/A",
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
        bill_id: (session.metadata?.bill_id as string) || null,
        table_name: (session.metadata?.table_name as string) || null,
        payment_method: (session.metadata?.payment_method as string) || null,
        error:
          session.payment_status !== EPaymentStatus.PAID
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
    console.error("Error retrieving Stripe session:", error);
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
}

export async function getTransactions() {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

  if (!STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined");
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    typescript: true,
  });

  try {
    const sessions = await stripe.checkout.sessions.list();
    console.log(sessions);
  } catch (error) {
    console.error("Error retrieving Stripe session:", error);
  }
}
