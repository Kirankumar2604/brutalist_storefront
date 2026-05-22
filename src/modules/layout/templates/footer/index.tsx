import { listCategories } from "@lib/data/categories";
import { listCollections } from "@lib/data/collections";
import { Text, clx } from "@modules/common/components/ui";

import LocalizedClientLink from "@modules/common/components/localized-client-link";
import MedusaCTA from "@modules/layout/components/medusa-cta";

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  });
  const productCategories = await listCategories();

  return (
    <footer className="w-full px-2 small:px-4 pb-6 small:pb-8">
      <div className="content-container brutalist-panel brutalist-grid-bg flex flex-col w-full px-3 small:px-4 medium:px-8 py-6 small:py-10 medium:py-16">
        <div className="flex flex-col gap-y-6 small:gap-y-10 xsmall:flex-row items-start justify-between">
          <div>
            <LocalizedClientLink
              href="/"
              className="text-3xl small:text-4xl medium:text-5xl leading-none tracking-[0.1em] [font-family:var(--font-display)] hover:text-[var(--brut-accent)]"
            >
              Iron Cartel
            </LocalizedClientLink>
          </div>
          <div className="text-xs small:text-small-regular gap-4 small:gap-8 md:gap-x-12 grid grid-cols-3">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2 small:gap-y-3 border-2 border-black p-3 small:p-4 bg-[var(--brut-paper)]">
                <span className="txt-small-plus txt-ui-fg-base uppercase tracking-[0.15em] text-xs small:text-sm">
                  Categories
                </span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return;
                    }

                    const children =
                      c.category_children?.map((child) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null;

                    return (
                      <li
                        className="flex flex-col gap-2 text-ui-fg-subtle txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx(
                            "brutalist-link",
                            children && "txt-small-plus"
                          )}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children && (
                          <ul className="grid grid-cols-1 ml-3 gap-2">
                            {children &&
                              children.map((child) => (
                                <li key={child.id}>
                                  <LocalizedClientLink
                                    className="brutalist-link"
                                    href={`/categories/${child.handle}`}
                                    data-testid="category-link"
                                  >
                                    {child.name}
                                  </LocalizedClientLink>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-3 border-2 border-black p-4 bg-[var(--brut-paper)]">
                <span className="txt-small-plus txt-ui-fg-base uppercase tracking-[0.15em]">
                  Collections
                </span>
                <ul
                  className={clx(
                    "grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small",
                    {
                      "grid-cols-2": (collections?.length || 0) > 3,
                    }
                  )}
                >
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="brutalist-link"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-3 border-2 border-black p-4 bg-[var(--brut-paper)]">
              <span className="txt-small-plus txt-ui-fg-base uppercase tracking-[0.15em]">Developer</span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li>
                  <a
                    href="https://github.com/Kirankumar2604"
                    target="_blank"
                    rel="noreferrer"
                    className="brutalist-link"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.medusajs.com"
                    target="_blank"
                    rel="noreferrer"
                    className="brutalist-link"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Kirankumar2604/brutalist_storefront"
                    target="_blank"
                    rel="noreferrer"
                    className="brutalist-link"
                  >
                    Source code
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-y-3 border-2 border-black p-4 bg-[var(--brut-paper)]">
              <span className="txt-small-plus txt-ui-fg-base uppercase tracking-[0.15em]">Follow</span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                <li>
                  <a href="https://www.instagram.com/_._kirankumar_._/" target="_blank" rel="noreferrer" className="brutalist-link">Instagram</a>
                </li>
                <li>
                  <a href="https://www.facebook.com/share/1CxSx6dBMY/" target="_blank" rel="noreferrer" className="brutalist-link">Facebook</a>
                </li>
                <li>
                  <a href="https://x.com/Kiranku61063138" target="_blank" rel="noreferrer" className="brutalist-link">Twitter</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap w-full mt-10 gap-3 items-center justify-between text-ui-fg-base border-t-2 border-black pt-6">
          <Text className="txt-compact-small uppercase tracking-[0.1em]">
            © {new Date().getFullYear()} Iron Cartel. All rights reserved.
          </Text>
          <MedusaCTA />
        </div>
      </div>
    </footer>
  );
}
