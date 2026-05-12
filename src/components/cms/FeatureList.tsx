import { resolveIcon } from "./icons"

/**
 * FeatureList block renderer (Preact, Zen-skinned for amicare-zorg).
 *
 * Props mirror siab-site-template/src/components/cms/FeatureList.tsx exactly.
 *
 * Design: 3-up grid of feature cards. Each card has an icon header band
 * (accent-tinted background, lucide-preact icon centered) + a Fraunces
 * serif title + a body paragraph. Above the grid: Caveat script kicker
 * (the `intro` prop) + a Fraunces H2 (the `title` prop, with <em> applying
 * the accent-italic treatment).
 *
 * Visual ported from amicare's pre-CMS src/components/Werkwijze.tsx
 * (commits 91f22a2, cb59146).
 */
export type FeatureListProps = {
  title?: string | null
  intro?: string | null
  features: Array<{
    title: string
    description?: string | null
    icon?: string | null
  }>
  dataBlockIndex?: number
}

export default function FeatureList({
  title,
  intro,
  features,
  dataBlockIndex,
}: FeatureListProps) {
  if (!features || features.length === 0) return null
  return (
    <section
      id="werkwijze"
      class="cms-block cms-block--featurelist relative bg-card/50 px-6 py-20 md:px-12 md:py-24 lg:px-24"
      data-block-index={dataBlockIndex}
    >
      <div class="mx-auto max-w-7xl">
        {(title || intro) && (
          <div class="mb-14 space-y-3 text-center">
            {intro && (
              <span
                class="inline-block -rotate-2 text-[20px] text-accent"
                style={{ fontFamily: 'var(--font-script)' }}
              >
                {intro}
              </span>
            )}
            {title && (
              <h2
                class="font-serif text-[34px] leading-[1.1] tracking-[-0.01em] md:text-[44px] [&_em]:not-italic [&_em]:italic [&_em]:text-accent"
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
          </div>
        )}

        <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = resolveIcon(feature.icon)
            return (
              <article
                key={i}
                class="overflow-hidden rounded-[2rem] border border-rule bg-card shadow-lg"
              >
                <div class="flex h-32 items-center justify-center bg-accent/[0.08]">
                  {Icon && <Icon size={44} class="text-accent" strokeWidth={1.5} />}
                </div>
                <div class="space-y-3 p-7 text-center">
                  <h3 class="font-serif text-[24px] leading-[1.2]">
                    {feature.title}
                  </h3>
                  {feature.description && (
                    <p class="text-[16px] leading-[1.6] text-ink-muted">
                      {feature.description}
                    </p>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
