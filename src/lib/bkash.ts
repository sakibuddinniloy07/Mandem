// bKash Checkout (Tokenized) API integration.
// Docs: https://developer.bka.sh/docs/tokenized-checkout-intro
//
// Required env vars (see .env.example):
//   BKASH_BASE_URL        sandbox: https://tokenized.sandbox.bka.sh/v1.2.0-beta
//                         live:    https://tokenized.pay.bka.sh/v1.2.0-beta
//   BKASH_APP_KEY
//   BKASH_APP_SECRET
//   BKASH_USERNAME
//   BKASH_PASSWORD
//   BKASH_CALLBACK_URL    e.g. https://yourdomain.com/api/payments/bkash/callback

type TokenResponse = {
  id_token: string;
  token_type: string;
  expires_in: number; // seconds
  refresh_token: string;
};

let cachedToken: { token: string; expiresAt: number } | null = null;

function env(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var ${name} for bKash integration`);
  return v;
}

export function isBkashConfigured() {
  return Boolean(
    process.env.BKASH_BASE_URL &&
      process.env.BKASH_APP_KEY &&
      process.env.BKASH_APP_SECRET &&
      process.env.BKASH_USERNAME &&
      process.env.BKASH_PASSWORD
  );
}

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 10_000) {
    return cachedToken.token;
  }
  const baseUrl = env("BKASH_BASE_URL");
  const res = await fetch(`${baseUrl}/tokenized/checkout/token/grant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      username: env("BKASH_USERNAME"),
      password: env("BKASH_PASSWORD"),
    },
    body: JSON.stringify({
      app_key: env("BKASH_APP_KEY"),
      app_secret: env("BKASH_APP_SECRET"),
    }),
  });
  if (!res.ok) {
    throw new Error(`bKash token grant failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as TokenResponse;
  cachedToken = { token: data.id_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.token;
}

async function authedHeaders() {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: await getToken(),
    "X-APP-Key": env("BKASH_APP_KEY"),
  };
}

export type BkashCreatePaymentResult = {
  paymentID: string;
  bkashURL: string;
  successCallbackURL: string;
  failureCallbackURL: string;
  cancelledCallbackURL: string;
};

export async function createBkashPayment(opts: {
  amount: number;
  orderNumber: string;
}): Promise<BkashCreatePaymentResult> {
  const baseUrl = env("BKASH_BASE_URL");
  const callbackURL = env("BKASH_CALLBACK_URL");
  const res = await fetch(`${baseUrl}/tokenized/checkout/create`, {
    method: "POST",
    headers: await authedHeaders(),
    body: JSON.stringify({
      mode: "0011",
      payerReference: opts.orderNumber,
      callbackURL,
      amount: opts.amount.toFixed(2),
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: opts.orderNumber,
    }),
  });
  const data = await res.json();
  if (!res.ok || data.statusCode !== "0000") {
    throw new Error(`bKash create payment failed: ${JSON.stringify(data)}`);
  }
  return data as BkashCreatePaymentResult;
}

export type BkashExecuteResult = {
  statusCode: string;
  statusMessage: string;
  paymentID: string;
  trxID?: string;
  transactionStatus?: string;
  amount?: string;
};

export async function executeBkashPayment(paymentID: string): Promise<BkashExecuteResult> {
  const baseUrl = env("BKASH_BASE_URL");
  const res = await fetch(`${baseUrl}/tokenized/checkout/execute`, {
    method: "POST",
    headers: await authedHeaders(),
    body: JSON.stringify({ paymentID }),
  });
  return (await res.json()) as BkashExecuteResult;
}

export async function queryBkashPayment(paymentID: string): Promise<BkashExecuteResult> {
  const baseUrl = env("BKASH_BASE_URL");
  const res = await fetch(`${baseUrl}/tokenized/checkout/payment/status`, {
    method: "POST",
    headers: await authedHeaders(),
    body: JSON.stringify({ paymentID }),
  });
  return (await res.json()) as BkashExecuteResult;
}
