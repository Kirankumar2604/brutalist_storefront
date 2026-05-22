import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import Thumbnail from "@modules/products/components/thumbnail"
import { Text } from "@modules/common/components/ui"

export default async function Gallery({ region }: { region: HttpTypes.StoreRegion }) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({ regionId: region.id, queryParams: { limit: 8 } })

  if (!pricedProducts) return null

  const images = pricedProducts
    .map((p) => p.images?.[0]?.url)
    .filter(Boolean)
    .slice(0, 6) as string[]

  return (
    <section className="content-container py-6 small:py-8 medium:py-12 px-3 small:px-4 medium:px-8">
      <div className="mb-6">
        <Text className="text-2xl small:text-3xl medium:text-4xl tracking-[0.08em] [font-family:var(--font-display)] uppercase">
          Photo Gallery
        </Text>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {images.map((src, idx) => (
          <div key={idx} className="border-2 border-black bg-[var(--brut-paper)]">
            <Thumbnail thumbnail={src} size="square" />
          </div>
        ))}
      </div>
    </section>
  )
}
