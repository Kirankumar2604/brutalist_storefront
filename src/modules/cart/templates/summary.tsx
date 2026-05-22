"use client"

import { Button, Heading, Text } from "@modules/common/components/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart, customer }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-2xl small:text-3xl medium:text-4xl lg:text-5xl leading-[0.9] [font-family:var(--font-display)]">
        Summary
      </Heading>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals totals={cart} />
      {!customer ? (
        <div className="flex flex-col gap-y-3">
          <LocalizedClientLink href="/account">
            <Button className="w-full h-10 small:h-11" data-testid="sign-in-for-checkout">Sign in to Checkout</Button>
          </LocalizedClientLink>
          <Text className="txt-small text-ui-fg-subtle text-center">
            You need to be logged in to complete your purchase
          </Text>
        </div>
      ) : (
        <LocalizedClientLink
          href={"/checkout?step=" + step}
          data-testid="checkout-button"
        >
          <Button className="w-full h-10 small:h-11">Go to checkout</Button>
        </LocalizedClientLink>
      )}
    </div>
  )
}

export default Summary
