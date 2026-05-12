import { MapPin } from "lucide-preact"

/**
 * Hero block renderer (Preact, Zen-skinned for amicare-zorg).
 *
 * Props mirror siab-site-template/src/components/cms/Hero.tsx EXACTLY so the
 * orchestrator's site-converter (Phase 5) can wire it via the same
 * <Blocks blocks={page?.blocks} /> dispatcher without modification.
 *
 * Editorial fields:
 *   - eyebrow:    Caveat script kicker above the headline
 *   - headline:   Big Fraunces serif H1. Wrap words in <em>...</em> in the
 *                 source to apply the accent-italic + curved-underline treatment.
 *   - subheadline: Lead paragraph below the headline.
 *   - cta:        Optional contact button. Renders as a rounded accent pill.
 *   - imageUrl:   Hero image. Renders on the right at md+, below at mobile.
 *
 * Hardcoded design elements (not editorial):
 *   - Two accent-color decorative blobs (top-left, bottom-right).
 *   - Two pills below the subheadline ("Roermond e.o.", "Persoonlijke aanpak").
 *   - Floating pull-quote card on the image (bottom-left).
 *   - Floating location card on the image (top-right) with MapPin icon.
 *
 * Visual design ported from amicare's pre-CMS src/components/Hero.tsx
 * (commit cb59146 "Zen restyle for ami-care.nl"). Animations replaced with
 * CSS keyframes (no framer-motion — Preact-only environment).
 */
export type HeroProps = {
  eyebrow?: string | null
  headline: string
  subheadline?: string | null
  cta?: { label?: string | null; href?: string | null } | null
  imageUrl?: string | null
  imageAlt?: string | null
  dataBlockIndex?: number
}

const PILLS = ['— Roermond e.o.', '— Persoonlijke aanpak'] as const
const PULL_QUOTE = 'Écht verschil maken voor jongeren en gezinnen.'

export default function Hero({
  eyebrow,
  headline,
  subheadline,
  cta,
  imageUrl,
  imageAlt,
  dataBlockIndex,
}: HeroProps) {
  const ctaLabel = cta?.label?.trim()
  const ctaHref = cta?.href?.trim()
  const showCta = ctaLabel && ctaHref

  return (
    <section
      id="top"
      class="cms-block cms-block--hero relative flex min-h-[90vh] flex-col items-center overflow-hidden px-6 py-12 md:flex-row md:px-12 lg:px-24"
      data-block-index={dataBlockIndex}
    >
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -left-[10%] -top-[10%] -z-10 h-[500px] w-[500px] rounded-full bg-accent/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -bottom-[10%] -right-[5%] -z-10 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl"
      />

      {/* Left column */}
      <div class="relative z-10 w-full space-y-7 md:w-1/2">
        {eyebrow && (
          <span
            class="inline-block -rotate-2 text-[22px] text-accent animate-fade-up [animation-delay:0ms]"
            style={{ fontFamily: 'var(--font-script)' }}
          >
            {eyebrow}
          </span>
        )}

        <h1
          class="font-serif text-[44px] font-normal leading-[1.05] tracking-[-0.01em] md:text-[60px] lg:text-[76px] animate-fade-up [animation-delay:50ms] [&_em]:relative [&_em]:not-italic [&_em]:inline-block [&_em]:whitespace-nowrap [&_em]:italic [&_em]:text-accent"
          style={{ maxWidth: '14ch' }}
          dangerouslySetInnerHTML={{ __html: renderHeadlineWithUnderline(headline) }}
        />

        {subheadline && (
          <p class="max-w-md text-[17px] leading-[1.6] text-ink-muted md:text-[18px] animate-fade-up [animation-delay:150ms]">
            {subheadline}
          </p>
        )}

        <div class="flex flex-wrap gap-2 pt-2 animate-fade [animation-delay:300ms]">
          {PILLS.map((label) => (
            <span
              key={label}
              class="rounded-full border border-rule bg-secondary/40 px-3 py-1.5 text-[12px] font-medium text-ink-muted"
            >
              {label}
            </span>
          ))}
        </div>

        {showCta && (
          <a
            href={ctaHref}
            class="inline-block rounded-full bg-accent px-6 py-3 text-[14px] font-medium text-bg shadow-sm transition-colors hover:bg-accent/90 animate-fade-up [animation-delay:400ms]"
          >
            {ctaLabel}
          </a>
        )}
      </div>

      {/* Right column */}
      <div class="relative mt-14 w-full md:mt-0 md:w-1/2">
        {imageUrl && (
          <div class="relative z-10 animate-fade [animation-delay:100ms]">
            <img
              src={imageUrl}
              alt={imageAlt ?? ''}
              loading="eager"
              decoding="async"
              class="aspect-[4/5] w-full rotate-0 transform rounded-[3rem] object-cover shadow-2xl md:aspect-[4/3] md:rotate-3"
            />

            {/* Floating pull-quote card — bottom-left */}
            <figure class="absolute -bottom-8 -left-2 max-w-[230px] rounded-2xl border border-rule bg-card p-4 shadow-lg md:-bottom-10 md:-left-8 md:p-5 animate-float [animation-delay:0ms]">
              <span
                aria-hidden="true"
                class="mr-1 align-top text-3xl leading-none italic text-accent"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                &ldquo;
              </span>
              <blockquote class="inline font-serif text-[17px] italic leading-[1.35] text-ink md:text-[19px]">
                {PULL_QUOTE}
              </blockquote>
            </figure>

            {/* Floating location card — top-right */}
            <div class="absolute -top-6 -right-2 flex max-w-[200px] items-center gap-3 rounded-2xl border border-rule bg-card p-3 shadow-lg md:-top-8 md:-right-8 md:p-4 animate-float [animation-delay:500ms]">
              <span class="rounded-full bg-accent/10 p-2 text-accent">
                <MapPin size={18} />
              </span>
              <div class="text-[12px] leading-tight">
                <p class="font-serif text-[14px] italic text-ink">Roermond e.o.</p>
                <p class="text-ink-muted">Limburg-Noord</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * Renders the headline with the curved-underline SVG decoration on
 * the FIRST <em>...</em> span (the editorial accent word, typically "hart").
 *
 * Falls back to plain text if no <em> is present.
 */
function renderHeadlineWithUnderline(headline: string): string {
  const emRegex = /<em>([^<]+)<\/em>/i
  const match = headline.match(emRegex)
  if (!match) {
    return headline
  }
  const underlineSvg = `<svg aria-hidden="true" viewBox="0 0 100 10" preserveAspectRatio="none" class="absolute -bottom-1 left-0 -z-10 h-3 w-full text-accent/40"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round"/></svg>`
  const decorated = `<em class="relative inline-block whitespace-nowrap italic text-accent">${match[1]}${underlineSvg}</em>`
  return headline.replace(emRegex, decorated)
}
