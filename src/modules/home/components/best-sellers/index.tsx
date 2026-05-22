import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"
import ProductPreview from "@modules/products/components/product-preview"

export default async function BestSellers({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: { limit: 12 },
  })

  if (!pricedProducts) {
    return null
  }

  // As a simple approximation, show the first products as "best sellers"
  return (
    <section className="content-container py-6 small:py-8 medium:py-12 px-3 small:px-4 medium:px-8">
      <div className="flex items-center justify-between mb-6">
        <Text className="text-2xl small:text-3xl medium:text-4xl tracking-[0.08em] [font-family:var(--font-display)] uppercase">
          Most Ordered
        </Text>
      </div>
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 small:gap-6 medium:gap-8">
        {pricedProducts.slice(0, 8).map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} />
          </li>
        ))}
      </ul>
    </section>
  )
}
