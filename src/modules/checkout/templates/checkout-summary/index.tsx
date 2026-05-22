import { Heading } from "@modules/common/components/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 ">
      <div className="w-full bg-[var(--brut-paper)] border-2 border-black px-3 small:px-4 py-4 flex flex-col">
        <Divider className="my-4 small:my-6 small:hidden" />
        <Heading
          level="h2"
          className="flex flex-row text-2xl small:text-3xl medium:text-4xl lg:text-5xl [font-family:var(--font-display)] items-baseline"
        >
          In your Cart
        </Heading>
        <Divider className="my-4 small:my-6" />
        <CartTotals totals={cart} />
        <ItemsPreviewTemplate cart={cart} />
        <div className="my-4 small:my-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
