import { Text, Heading } from "@modules/common/components/ui"

const AboutProducts = () => {
  return (
    <section className="content-container py-6 small:py-8 medium:py-12 px-3 small:px-4 medium:px-8">
      <div className="bg-[var(--brut-paper)] border-2 border-black p-6 small:p-8">
        <Heading level="h2" className="text-2xl small:text-3xl medium:text-4xl [font-family:var(--font-display)]">
          About Our Products
        </Heading>
        <Text className="mt-4 max-w-3xl text-sm small:text-base leading-6">
          We curate durable, minimalist apparel built for everyday wear. Our
          products are selected with an emphasis on material quality, simple
          design, and honest pricing. Each piece is photographed and described
          clearly so you can buy with confidence.
        </Text>
        <ul className="mt-4 grid grid-cols-1 small:grid-cols-3 gap-4">
          <li className="border-2 border-black p-3 bg-white">High Quality Materials</li>
          <li className="border-2 border-black p-3 bg-white">Transparent Pricing</li>
          <li className="border-2 border-black p-3 bg-white">Fast, Reliable Shipping</li>
        </ul>
      </div>
    </section>
  )
}

export default AboutProducts
