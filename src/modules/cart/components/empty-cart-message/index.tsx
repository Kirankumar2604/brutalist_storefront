import { Heading, Text } from "@modules/common/components/ui"

import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  return (
    <div className="py-12 small:py-24 px-3 small:px-4 flex flex-col justify-center items-start brutalist-panel" data-testid="empty-cart-message">
      <Heading
        level="h1"
        className="flex flex-row text-3xl small:text-4xl medium:text-5xl lg:text-6xl [font-family:var(--font-display)] gap-x-2 items-baseline"
      >
        Cart
      </Heading>
      <Text className="text-sm small:text-base-regular mt-3 small:mt-4 mb-4 small:mb-6 max-w-[32rem] uppercase tracking-[0.06em]">
        You don&apos;t have anything in your cart. Let&apos;s change that, use
        the link below to start browsing our products.
      </Text>
      <div>
        <InteractiveLink href="/store">Explore products</InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
