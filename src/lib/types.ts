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

// SiteSettings type — mirrors siab-payload's settingsToJson projection
// (see /home/shimmy/Desktop/env/siab/siab-payload/src/lib/projection/settingsToJson.ts).
//
// The orchestrator's scaffolded SiteSettings type mirrors the OLDER template's
// src/content/site.ts SiteConfig (brand/primaryDomain/socials/nav) which DOES NOT
// match what the CMS reader actually loads from disk. The Payload-projected JSON
// is the authoritative runtime shape — all field accesses in BaseLayout +
// src/components/seo/*.astro use these names.

export type NAP = {
  legalName?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

export type OpeningHours = {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open?: string | null;     // 'HH:MM'
  close?: string | null;
  closed?: boolean;
};

export type SocialLink = { platform: string; url: string };
export type NavLink = { label: string; href: string; external?: boolean };
export type Alias = { host: string };
export type ServiceAreaEntry = { name: string };

export type SiteSettings = {
  siteName: string;
  siteUrl: string;                 // includes protocol — e.g. https://ami-care.nl
  description?: string | null;
  language: string;
  aliases?: Alias[];
  contactEmail?: string | null;
  branding?: {
    logo?: { url?: string | null; filename?: string | null } | null;
    primaryColor?: string | null;
  } | null;
  contact?: {
    phone?: string | null;
    address?: string | null;
    social?: SocialLink[];
  } | null;
  nap?: NAP | null;
  hours?: OpeningHours[];
  serviceArea?: ServiceAreaEntry[];
  navigation?: NavLink[];
  updatedAt?: string;
};
