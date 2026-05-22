import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 px-2 py-2 small:px-4 small:py-4 brutalist-grid-bg">
      <header className="brutalist-panel relative mx-auto overflow-visible">
        <nav className="content-container flex items-center justify-between w-full min-h-14 small:min-h-16 py-1 small:py-2 text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="text-2xl small:text-3xl medium:text-4xl lg:text-5xl leading-none tracking-[0.1em] [font-family:var(--font-display)] hover:text-[var(--brut-accent)] transition-colors"
              data-testid="nav-store-link"
            >
              Iron Cartel
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-2 small:gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="brutalist-link uppercase tracking-[0.14em] font-semibold text-xs small:text-sm"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="brutalist-link flex gap-2 uppercase tracking-[0.14em] font-semibold text-xs small:text-sm"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
