import { clx } from "@modules/common/components/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-[var(--brut-bg)] border-2 border-black animate-pulse" />
  }

  return (
    <div className="flex flex-col text-ui-fg-base border-2 border-black p-3 bg-[var(--brut-paper)]">
      <span
        className={clx("text-3xl [font-family:var(--font-display)] tracking-[0.08em]", {
          "text-[var(--brut-accent)]": selectedPrice.price_type === "sale",
        })}
      >
        {!variant && "From "}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <>
          <p className="text-xs uppercase tracking-[0.1em]">
            <span className="text-ui-fg-subtle">Original: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="text-[var(--brut-accent)] text-xs uppercase tracking-[0.1em]">
            -{selectedPrice.percentage_diff}%
          </span>
        </>
      )}
    </div>
  )
}
