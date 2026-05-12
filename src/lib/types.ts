// src/lib/types.ts — auto-scaffolded shape; mirrors siab-payload/src/blocks/*.ts.

// Upload fields are projected to disk by Payload's `projectPageToDisk` hook
// with depth>=1, so they arrive as full Media-like objects (not bare ids).
// MediaRef accepts either shape so the renderer can degrade gracefully if
// a tenant's data was projected without depth, but production sites should
// always carry the populated object (with `.url`).
export type MediaRef =
  | number
  | string
  | { id: number | string; url?: string | null; filename?: string | null; alt?: string | null }
  | null

export type HeroBlock = {
  blockType: "hero"
  eyebrow?: string | null
  headline: string
  subheadline?: string | null
  cta?: { label?: string | null; href?: string | null } | null
  image?: MediaRef  // populated Media object (preferred) or bare id; resolved by Blocks.astro
}

export type FeatureListBlock = {
  blockType: "featureList"
  title?: string | null
  intro?: string | null
  features: Array<{
    title: string
    description?: string | null
    icon?: string | null  // lucide-react icon name
  }>
}

export type TestimonialsBlock = {
  blockType: "testimonials"
  title?: string | null
  items: Array<{
    quote: string
    author: string
    role?: string | null
    avatar?: MediaRef  // populated Media object (preferred) or bare id
  }>
}

export type FAQBlock = {
  blockType: "faq"
  title?: string | null
  items: Array<{ question: string; answer: string }>
}

export type CTABlock = {
  blockType: "cta"
  headline: string
  description?: string | null
  primary?: { label?: string | null; href?: string | null } | null
  secondary?: { label?: string | null; href?: string | null } | null
}

export type RichTextBlock = {
  blockType: "richText"
  body: string
}

export type ContactSectionBlock = {
  blockType: "contactSection"
  title?: string | null
  description?: string | null
  formName: string
  fields: Array<{
    name: string
    label: string
    type: "text" | "email" | "tel" | "textarea"
    required?: boolean
  }>
}

export type Block =
  | HeroBlock
  | FeatureListBlock
  | TestimonialsBlock
  | FAQBlock
  | CTABlock
  | RichTextBlock
  | ContactSectionBlock

export type Page = {
  id: string;
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  role: 'home' | 'about' | 'services' | 'contact' | 'page';
  order: number;
  blocks: Block[];
  updatedAt: string;
};

export type NAP = {
  legalName: string;
  displayName: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
};

export type OpeningHours = {
  dayOfWeek: 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa' | 'Su';
  opens: string;
  closes: string;
};

export type SiteSettings = {
  brand: string;
  language: string;
  primaryDomain: string;
  aliases: string[];
  description: string;
  nap?: NAP;
  hours?: OpeningHours[];
  serviceArea?: string[];
  socials: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    x?: string;
  };
  nav: { label: string; href: string }[];
  updatedAt: string;
};
