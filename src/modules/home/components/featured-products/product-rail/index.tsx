import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container brutalist-panel py-6 small:py-8 medium:py-12 px-3 small:px-4 medium:px-8">
      <div className="flex flex-col small:flex-row small:items-center small:justify-between gap-3 small:gap-4 mb-6 small:mb-8">
        <Text className="text-2xl small:text-3xl medium:text-4xl tracking-[0.08em] [font-family:var(--font-display)] uppercase">
          {collection.title}
        </Text>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 small:gap-6 medium:gap-8">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </div>
  )
}
