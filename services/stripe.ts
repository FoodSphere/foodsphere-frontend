"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { cookies } from "next/headers";

import { EPaymentMethod, EPaymentStatus } from "@/types/enum";

const customerEmail = "guest-foodsphere@gmail.com";

const getConnectedAccountId = async () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const restaurantId = cookieStore.get("restaurant_id")?.value;

  const res = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : {
          "Content-Type": "application/json",
        },
    cache: "no-store",
  });

  const restaurant = await res.json();

  if (!restaurant) {
    throw new Error("No restaurant found");
  }
  return restaurant.stripe_account_id;
};

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
    const connectedAccountId = await getConnectedAccountId();
    if (!billId) {
      throw new Error("Bill ID is required");
    }
    if (!connectedAccountId) {
      throw new Error("Connected Account ID is not defined");
    }
    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail,
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
