"use client"

type RazorpayOrderResponse = {
  order_id: string
  amount: number
  currency: string
}

type RazorpayCreateOrderRequest = {
  amount: number
  currency?: string
  receipt?: string
}

type RazorpayVerifyRequest = {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

type RazorpayWindow = Window & {
  Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
}

type RazorpayOptions = {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description?: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  handler: (response: RazorpayVerifyRequest) => void | Promise<void>
  modal?: {
    ondismiss?: () => void
  }
  theme?: {
    color?: string
  }
}

type RazorpayInstance = {
  open: () => void
  on: (
    eventName: "payment.failed",
    callback: (response: {
      error?: {
        description?: string
        reason?: string
      }
    }) => void
  ) => void
}

const razorpayBackendUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const medusaPublishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

function getRazorpayHeaders() {
  if (!medusaPublishableKey) {
    throw new Error("Medusa publishable API key is missing.")
  }

  return {
    "Content-Type": "application/json",
    "x-publishable-api-key": medusaPublishableKey,
  }
}

async function parseErrorMessage(response: Response) {
  const payload = await response.json().catch(() => ({}))

  return (
    payload?.message ||
    payload?.error?.description ||
    payload?.error?.reason ||
    "Razorpay request failed."
  )
}

export async function createRazorpayOrder(
  data: RazorpayCreateOrderRequest
): Promise<RazorpayOrderResponse> {
  const response = await fetch(
    `${razorpayBackendUrl}/store/razorpay/create-order`,
    {
      method: "POST",
      headers: getRazorpayHeaders(),
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  return response.json()
}

export async function verifyRazorpayPayment(
  data: RazorpayVerifyRequest
): Promise<{ success: true }> {
  const response = await fetch(
    `${razorpayBackendUrl}/store/razorpay/verify-payment`,
    {
      method: "POST",
      headers: getRazorpayHeaders(),
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  return response.json()
}

let scriptPromise: Promise<void> | null = null

export function loadRazorpayCheckoutScript() {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Razorpay checkout can only load in the browser.")
    )
  }

  const browserWindow = window as RazorpayWindow

  if (browserWindow.Razorpay) {
    return Promise.resolve()
  }

  if (scriptPromise) {
    return scriptPromise
  }

  scriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(
      "razorpay-checkout-script"
    ) as HTMLScriptElement | null

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true })
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Razorpay checkout script.")),
        { once: true }
      )
      return
    }

    const script = document.createElement("script")
    script.id = "razorpay-checkout-script"
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      reject(new Error("Failed to load Razorpay checkout script."))
    }

    document.body.appendChild(script)
  })

  return scriptPromise
}