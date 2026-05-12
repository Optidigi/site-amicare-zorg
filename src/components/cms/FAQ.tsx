export type FAQProps = {
  title?: string | null
  items: Array<{ question: string; answer: string }>
  dataBlockIndex?: number
}

export default function FAQ({ title, items, dataBlockIndex }: FAQProps) {
  if (!items || items.length === 0) return null
  return (
    <section
      class="cms-block cms-block--faq px-6 py-16 md:px-12 md:py-20 lg:px-24"
      data-block-index={dataBlockIndex}
    >
      <div class="container mx-auto max-w-3xl">
        {title && (
          <h2 class="mb-10 text-center font-serif text-[34px] leading-[1.1] tracking-[-0.01em] md:text-[44px]">
            {title}
          </h2>
        )}
        <dl class="space-y-4">
          {items.map((item, i) => (
            <details
              key={i}
              class="group rounded-2xl border border-rule bg-card p-4"
            >
              <summary class="flex list-none cursor-pointer items-center justify-between font-medium text-ink">
                <span>{item.question}</span>
                <span class="text-ink-muted transition-transform group-open:rotate-180" aria-hidden>
                  ▾
                </span>
              </summary>
              <div class="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-muted">
                {item.answer}
              </div>
            </details>
          ))}
        </dl>
      </div>
    </section>
  )
}
