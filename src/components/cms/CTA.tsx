/**
 * CTA block renderer (Preact, Zen-skinned for amicare-zorg).
 *
 * Props mirror siab-site-template/src/components/cms/CTA.tsx exactly.
 *
 * Dual-purpose dispatch on primary.href:
 *   - primary.href starts with "mailto:" → contact-style: big underlined
 *     Fraunces serif email link. Used for the page's Contact section.
 *     (Visual ported from amicare's pre-CMS Contact.astro.)
 *
 *   - otherwise → quote-style: italic Fraunces big-quote treatment with
 *     subtle bedroom.jpg-style accent backdrop. Used for the Wat telt
 *     section. (Visual ported from amicare's pre-CMS WatTelt.tsx —
 *     simplified, no backdrop image; design intent preserved via
 *     bg-secondary/40 + accent blob.)
 */
export type CTAProps = {
  headline: string
  description?: string | null
  primary?: { label?: string | null; href?: string | null } | null
  secondary?: { label?: string | null; href?: string | null } | null
  dataBlockIndex?: number
}

export default function CTA({
  headline,
  description,
  primary,
  secondary,
  dataBlockIndex,
}: CTAProps) {
  const primaryLabel = primary?.label?.trim()
  const primaryHref = primary?.href?.trim()
  const isContact = primaryHref?.startsWith('mailto:') || primaryHref?.startsWith('tel:')

  if (isContact && primaryLabel && primaryHref) {
    return (
      <section
        id="contact"
        class="cms-block cms-block--cta cms-block--cta-contact border-t border-rule px-6 py-24 md:px-12 md:py-28 lg:px-24"
        data-block-index={dataBlockIndex}
      >
        <div class="mx-auto max-w-3xl space-y-8 text-center">
          <span
            class="inline-block -rotate-2 text-[20px] text-accent"
            style={{ fontFamily: 'var(--font-script)' }}
          >
            Contact
          </span>
          <h2 class="mx-auto max-w-[24ch] font-serif text-[28px] leading-[1.25] tracking-[-0.005em] text-ink-muted md:text-[36px]">
            {headline}
          </h2>
          <a
            href={primaryHref}
            class="inline-block font-serif text-[28px] text-ink underline decoration-1 underline-offset-[8px] transition-colors hover:text-accent hover:decoration-accent md:text-[44px]"
          >
            {primaryLabel}
          </a>
        </div>
      </section>
    )
  }

  // Quote-style (Wat telt) — no primary button required.
  //
  // Backdrop image: hardcoded to /media/bedroom.jpg. The original amicare
  // WatTelt.tsx used a soft bedroom-scene backdrop at ~12% opacity behind
  // the quote, behind a cream gradient overlay for legibility. The cms
  // Payload schema has no image field on the CTA block (only Hero), so this
  // can't be editor-driven — it's a fixed brand asset, uploaded into
  // tenant media on /add-cms and served from the site's local /media/
  // route (backed by CMS_DATA_DIR/media/). To brand a different tenant's
  // quote section, replace bedroom.jpg in their tenant media volume.
  return (
    <section
      id="wat-telt"
      class="cms-block cms-block--cta cms-block--cta-quote relative isolate overflow-hidden bg-secondary/40 px-6 py-24 md:px-12 md:py-28"
      data-block-index={dataBlockIndex}
    >
      <img
        aria-hidden="true"
        src="/media/bedroom.jpg"
        alt=""
        loading="lazy"
        decoding="async"
        class="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.12]"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-bg/70 via-bg/50 to-bg/70"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -bottom-[20%] -right-[10%] -z-10 h-[300px] w-[300px] rounded-full bg-accent/10 blur-3xl"
      />

      <div class="mx-auto max-w-3xl text-center">
        <span
          class="inline-block -rotate-2 text-[20px] text-accent"
          style={{ fontFamily: 'var(--font-script)' }}
        >
          Wat telt
        </span>

        <h3 class="mt-5 font-serif text-[32px] italic leading-[1.2] tracking-[-0.005em] text-ink md:text-[48px]">
          &ldquo;{headline}&rdquo;
        </h3>

        {description && (
          <p class="mx-auto mt-7 max-w-prose text-[16px] leading-[1.7] text-ink-muted md:text-[17px]">
            {description}
          </p>
        )}

        {/*
          Quote-style intentionally suppresses the primary button.
          Payload's CTA schema requires `primary.label` + `primary.href`
          (both `required: true`), so the operator must supply a placeholder
          on quote blocks — but the button is part of the "contact" layout,
          not this one. If you want a button under a quote, use a separate
          CTA block in contact-style (primary.href = mailto:/tel:/external).
        */}
      </div>
    </section>
  )
}
