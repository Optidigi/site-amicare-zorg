/**
 * RichText block renderer (Preact, Zen-skinned for amicare-zorg).
 *
 * Default-prose fallback: matches template's RichTextProps exactly so
 * site-converter Phase 5 wires it without modification. Renders editorial
 * HTML inside a narrow prose container with amicare's Fraunces + ink
 * typography overrides.
 *
 * Editor writes plain HTML in the Payload textarea (or markdown that
 * payload-seeder converts to HTML at seed time). This component trusts
 * the HTML — only authenticated editors can write block content.
 */
export type RichTextProps = {
  body: string
  dataBlockIndex?: number
}

export default function RichText({ body, dataBlockIndex }: RichTextProps) {
  if (!body) return null
  return (
    <section
      class="cms-block cms-block--richtext px-6 py-20 md:px-12 md:py-24 lg:px-24"
      data-block-index={dataBlockIndex}
    >
      <div
        class="prose mx-auto max-w-prose text-[17px] leading-[1.7] text-ink/90 md:text-[18px] prose-headings:font-serif prose-headings:tracking-[-0.01em] prose-headings:text-ink prose-h2:text-[34px] prose-h2:leading-[1.1] md:prose-h2:text-[44px] prose-p:text-ink/90 prose-strong:text-ink prose-strong:font-semibold prose-em:text-accent prose-em:italic prose-a:text-accent prose-a:underline prose-a:decoration-1 prose-a:underline-offset-[6px] hover:prose-a:decoration-accent prose-blockquote:border-l-2 prose-blockquote:border-accent prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:font-serif prose-blockquote:text-[19px] md:prose-blockquote:text-[22px]"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </section>
  )
}
