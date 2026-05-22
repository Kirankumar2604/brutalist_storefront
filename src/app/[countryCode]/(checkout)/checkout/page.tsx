import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

type CheckoutProps = {
  params: Promise<{ countryCode: string }>
}

export default async function Checkout(props: CheckoutProps) {
  const params = await props.params
  const { countryCode } = params

  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  // Redirect to login if not authenticated
  if (!customer) {
    redirect(`/${countryCode}/account`)
  }

  return (
    <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] medium:grid-cols-[1fr_416px] content-container gap-4 small:gap-6 medium:gap-8 py-6 small:py-8 medium:py-12 px-2 small:px-3 medium:px-4 brutalist-grid-bg">
      <PaymentWrapper cart={cart}>
        <CheckoutForm cart={cart} customer={customer} />
      </PaymentWrapper>
      <CheckoutSummary cart={cart} />
    </div>
  )
}
