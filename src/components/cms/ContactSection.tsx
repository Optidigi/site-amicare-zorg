export type ContactSectionProps = {
  title?: string | null
  description?: string | null
  formName: string
  fields: Array<{
    name: string
    label: string
    type: "text" | "email" | "tel" | "textarea"
    required?: boolean
  }>
  dataBlockIndex?: number
}

export default function ContactSection({
  title,
  description,
  formName,
  fields,
  dataBlockIndex,
}: ContactSectionProps) {
  if (!fields || fields.length === 0) return null
  return (
    <section
      class="cms-block cms-block--contact px-6 py-16 md:px-12 md:py-20"
      data-block-index={dataBlockIndex}
    >
      <div class="container mx-auto max-w-2xl">
        {title && (
          <h2 class="font-serif text-[34px] leading-[1.1] tracking-[-0.01em] md:text-[44px]">
            {title}
          </h2>
        )}
        {description && (
          <p class="mt-3 text-[17px] leading-[1.6] text-ink-muted md:text-[18px]">
            {description}
          </p>
        )}
        <form
          name={formName}
          method="POST"
          action="/api/forms"
          class="mt-8 space-y-4"
        >
          <input type="hidden" name="formName" value={formName} />
          {fields.map((field) => (
            <div key={field.name} class="space-y-1.5">
              <label
                htmlFor={`f-${field.name}`}
                class="block text-sm font-medium text-ink"
              >
                {field.label}
                {field.required && <span class="text-accent"> *</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={`f-${field.name}`}
                  name={field.name}
                  required={!!field.required}
                  rows={5}
                  class="w-full rounded-md border border-rule bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
                />
              ) : (
                <input
                  id={`f-${field.name}`}
                  name={field.name}
                  type={field.type}
                  required={!!field.required}
                  class="w-full rounded-md border border-rule bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            class="rounded-full bg-accent px-6 py-3 text-[14px] font-medium text-bg transition-colors hover:bg-accent/90"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  )
}
