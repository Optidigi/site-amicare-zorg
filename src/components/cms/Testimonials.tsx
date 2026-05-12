import SmoothImage from "./SmoothImage"

export type TestimonialsProps = {
  title?: string | null
  items: Array<{
    quote: string
    author: string
    role?: string | null
    avatarUrl?: string | null
  }>
  dataBlockIndex?: number
}

export default function Testimonials({ title, items, dataBlockIndex }: TestimonialsProps) {
  if (!items || items.length === 0) return null
  return (
    <section
      class="cms-block cms-block--testimonials bg-secondary/40 px-6 py-16 md:px-12 md:py-20"
      data-block-index={dataBlockIndex}
    >
      <div class="container mx-auto">
        {title && (
          <h2 class="mb-12 text-center font-serif text-[34px] leading-[1.1] tracking-[-0.01em] md:text-[44px]">
            {title}
          </h2>
        )}
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <figure
              key={i}
              class="flex flex-col rounded-[2rem] border border-rule bg-card p-6"
            >
              <blockquote class="flex-1 font-serif text-[17px] italic leading-[1.5] text-ink">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption class="mt-4 flex items-center gap-3">
                {item.avatarUrl && (
                  <SmoothImage
                    src={item.avatarUrl}
                    alt=""
                    class="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <div class="font-medium text-ink">{item.author}</div>
                  {item.role && (
                    <div class="text-sm text-ink-muted">{item.role}</div>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
