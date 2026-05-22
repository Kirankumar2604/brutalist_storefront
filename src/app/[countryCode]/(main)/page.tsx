import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import NewArrivals from "@modules/home/components/new-arrivals"
import BestSellers from "@modules/home/components/best-sellers"
import AboutProducts from "@modules/home/components/about-products"
import Gallery from "@modules/home/components/gallery"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <section className="pb-16 brutalist-grid-bg">
      <Hero />
      <div className="px-4">
        <ul className="flex flex-col gap-10">
          <NewArrivals region={region} />
          <FeaturedProducts collections={collections} region={region} />
          <BestSellers region={region} />
          <AboutProducts />
          <Gallery region={region} />
        </ul>
      </div>
    </section>
  )
}
