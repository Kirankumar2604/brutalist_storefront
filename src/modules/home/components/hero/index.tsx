"use client";

import { Github } from "@medusajs/icons";
import { Button, Heading } from "@modules/common/components/ui";

const Hero = () => {
  // CSS-only marquee; no JS required

  return (
    <div>
      <section className="relative w-full px-4 pb-8">
        <div className="content-container brutalist-panel brutalist-grid-bg overflow-hidden py-6 small:py-10 medium:py-16 relative">
          {/* Background Video */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            preload="auto"
          >
            <source src="/vid.mp4" type="video/mp4" media="(max-width: 639px)" />
            <source src="/soon.mp4" type="video/mp4" media="(min-width: 640px)" />
            Your browser does not support the video tag.
          </video>

          {/* Overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/40" style={{ zIndex: 1 }} />

          {/* marquee removed from absolute overlay; moved into content flow below */}

          <div className="absolute right-2 small:right-4 top-2 small:top-4 h-6 small:h-8 w-6 small:w-8 border-2 border-black bg-[var(--brut-accent)]" style={{ zIndex: 20 }} />
          <div className="absolute left-2 small:left-4 bottom-2 small:bottom-4 h-6 small:h-8 w-6 small:w-8 border-2 border-black bg-[var(--brut-secondary)]" style={{ zIndex: 20 }} />

          <div className="relative flex min-h-[50vh] small:min-h-[55vh] flex-col justify-between gap-6 small:gap-10" style={{ zIndex: 10 }}>
            <div className="flex flex-wrap items-center gap-4">
              {/* <span className="brutalist-chip">No Frills Commerce</span>
              <span className="brutalist-chip">Built with Medusa</span> */}
            </div>

            {/* marquee moved below hero section */}

            <span className="space-y-2">
              <Heading
                level="h1"
                className="text-3xl small:text-5xl medium:text-[4rem] lg:text-[7.5rem] leading-[0.9] tracking-[0.08em] [font-family:var(--font-display)]"
              >
                BUY HARD.
              </Heading>
              <Heading
                level="h2"
                className="max-w-3xl text-xs small:text-sm medium:text-base uppercase tracking-[0.2em] font-semibold"
              >
                Industrial storefront language, loud hierarchy, and unapologetic
                product-first browsing.
              </Heading>
            </span>

            <div className="flex flex-col small:flex-row small:items-center small:justify-between gap-4 small:gap-6">
              <p className="max-w-xl text-xs small:text-sm leading-6">
                This storefront strips away decoration and keeps only bold contrast,
                hard edges, and direct calls to action.
              </p>
              <a
                href="https://kiranfolio.netlify.app"
                target="_blank"
                rel="noreferrer"
              >
                <Button className="!rounded-none !border-2 !border-black !bg-[var(--brut-ink)] !text-[var(--brut-paper)] hover:!bg-[var(--brut-accent)] transition-colors">
                   Developer {/*<Github /> */}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CSS-only marquee section below hero (infinite seamless loop) */}
      <section className="w-full">
        <div className="content-container py-2 small:py-3">
          <div className="marquee-container w-full overflow-hidden">
            <div className="marquee-track flex items-center">
              <div className="marquee-group flex gap-8 items-center">
                <span className="marquee-item text-xs small:text-sm font-bold">30% OFF — NEW SALE</span>
                <span className="marquee-item text-xs small:text-sm font-bold">LIMITED TIME — FREE SHIPPING</span>
                <span className="marquee-item text-xs small:text-sm font-bold">NEW ARRIVALS — SHOP NOW</span>
                <span className="marquee-item text-xs small:text-sm font-bold">EXTRA DEALS — LIMITED STOCK</span>
              </div>
              <div className="marquee-group flex gap-8 items-center">
                <span className="marquee-item text-xs small:text-sm font-bold">30% OFF — NEW SALE</span>
                <span className="marquee-item text-xs small:text-sm font-bold">LIMITED TIME — FREE SHIPPING</span>
                <span className="marquee-item text-xs small:text-sm font-bold">NEW ARRIVALS — SHOP NOW</span>
                <span className="marquee-item text-xs small:text-sm font-bold">EXTRA DEALS — LIMITED STOCK</span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .marquee-container { position: relative; }
          .marquee-track { display: flex; width: 200%; align-items: center; animation: marquee 10s linear infinite; }
          .marquee-track:hover { animation-play-state: paused; }
          .marquee-group { display: flex; flex: 0 0 50%; align-items: center; }
          .marquee-item { white-space: nowrap; padding-right: 2rem; }

          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          /* Optional: reduce motion for users who prefer reduced motion */
          @media (prefers-reduced-motion: reduce) {
            .marquee-track { animation: none; }
          }
        `}</style>
      </section>

    </div>
  );
};

export default Hero;
