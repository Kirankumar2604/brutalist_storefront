"use client"

import { isManual, isStripeLike } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import {
  createRazorpayOrder,
  loadRazorpayCheckoutScript,
  verifyRazorpayPayment,
} from "@lib/data/razorpay"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useEffect, useState } from "react"
import ErrorMessage from "../error-message"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <RazorpayPaymentButton
          cart={cart}
          notReady={notReady}
          data-testid={dataTestId}
        />
      )
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const RazorpayPaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [scriptReady, setScriptReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    loadRazorpayCheckoutScript()
      .then(() => {
        if (isMounted) {
          setScriptReady(true)
        }
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : String(error))
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = async () => {
    setSubmitting(true)
    setErrorMessage(null)

    try {
      await loadRazorpayCheckoutScript()

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

      if (!keyId) {
        throw new Error("Razorpay key ID is missing.")
      }

      const order = await createRazorpayOrder({
        amount: Math.max(100, Math.round(Number(cart.total) * 100)),
        currency: cart.currency_code,
        receipt: cart.id,
      })

      const RazorpayCheckout = (window as Window & {
        Razorpay?: new (options: {
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
          handler: (response: {
            razorpay_payment_id: string
            razorpay_order_id: string
            razorpay_signature: string
          }) => void | Promise<void>
          modal?: {
            ondismiss?: () => void
          }
          theme?: {
            color?: string
          }
        }) => {
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
      }).Razorpay

      if (!RazorpayCheckout) {
        throw new Error("Razorpay checkout is not available.")
      }

      const billingFirstName = cart.billing_address?.first_name || ""
      const billingLastName = cart.billing_address?.last_name || ""
      const billingName = `${billingFirstName} ${billingLastName}`.trim()

      const razorpay = new RazorpayCheckout({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "Razorpay Checkout",
        description: "Complete your order",
        prefill: {
          name: billingName || undefined,
          email: cart.email || undefined,
          contact: cart.billing_address?.phone || undefined,
        },
        handler: async (response) => {
          try {
            const verification = await verifyRazorpayPayment(response)

            if (verification.success) {
              await onPaymentCompleted()
            }
          } catch (error) {
            setErrorMessage(
              error instanceof Error ? error.message : String(error)
            )
          } finally {
            setSubmitting(false)
          }
        },
        modal: {
          ondismiss: () => {
            setErrorMessage("Payment cancelled.")
            setSubmitting(false)
          },
        },
      })

      razorpay.on("payment.failed", (response) => {
        setErrorMessage(
          response.error?.description ||
            response.error?.reason ||
            "Razorpay payment failed."
        )
        setSubmitting(false)
      })

      razorpay.open()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error))
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button
        disabled={notReady || !scriptReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId}
      >
        Pay with Razorpay
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="razorpay-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
