# Amicare-Zorg — Zen-restyle design

**Date:** 2026-05-01
**Project:** `optidigi/site-amicare-zorg`
**Domain:** ami-care.nl
**Status:** Approved (pre-implementation)
**Supersedes (partially):** `2026-05-01-amicare-zorg-design.md` — content & deploy artefacts inherit; **information architecture, component count, animation budget, and performance budget all change.**

---

## 1. Purpose

The site has shipped once already in an editorial / typographic register (the original spec). Project owner has now requested a restyle that adopts the structural language of [`themes.zira.my.id`](https://themes.zira.my.id/) — a publicly-available Astro template called Purrfectly Zen — while keeping Amicare's content, palette, typography, and Dutch copy.

This spec covers only the restyle. Domain, hosting, Docker/Coolify deploy, KVK/business info, and SEO baseline are all inherited unchanged from the prior spec.

## 2. Scope

**In scope:**

- New IA: 7 sections mapped from Purrfectly Zen's section vocabulary onto Amicare's existing content.
- New component shapes: sticky nav with mobile hamburger, two-column hero with floating mini-cards and squiggle underline, 3-card features grid, centered prose, centered hero-quote, 3-column footer.
- New tech additions: React 19 + framer-motion + lucide-react via `@astrojs/react`; one new self-hosted font (Caveat).
- Per-section Astro islands (not a single monolithic React component).
- Restrained animation suite (whileInView fade-up, layoutId nav indicator, AnimatePresence mobile menu, infinite y-bounce on floating cards).

**Out of scope (unchanged from prior spec):**

- Forms, analytics, CMS, dark mode, i18n, cookie banner, client-side router.
- Third-party font CDN (Caveat is self-hosted via Fontsource).
- Adding pages — site remains a one-pager.
- Adding CTAs beyond the existing email link (email is the only call-to-action).
- Fabricated testimonials or reviews. Inventing voices in a youth-care context is unethical and would ship as such; the slot is repurposed for `Over mij` instead.

## 3. Decisions taken before writing this spec

These are recorded for future reference and to short-circuit re-litigation:

| # | Decision | Rationale |
|---|---|---|
| 1 | "Follow the styling/layout/components" interpreted as **structural twin** — same IA shapes, same animations, same component-level vocabulary | Project owner picked option A on Q1 of brainstorm. |
| 2 | Keep Amicare's **palette + typography**, swap only the structural language | Project owner picked V2 on Q2. Terracotta/cream/Fraunces+Inter remain; the brand stays recognizable. |
| 3 | Repurpose Zen's "Community" slot for `Over mij` (single-column prose, no testimonials) | Fabricating client testimonials in jeugdzorg is unacceptable; centered prose preserves the Zen vertical rhythm without lying. |
| 4 | Collapse Zen's "CTA grid" to a single oversized email link | Spec said no CTAs beyond email; inventing 3 channels would need a phone & a LinkedIn URL not provided. |
| 5 | Keep Zen's 3-column footer shape; fill with KVK / address / brand info | The compliance info splits naturally; a one-line footer doesn't honour "structural twin." |
| 6 | Hand-script font: **Caveat** (variable, self-hosted via `@fontsource-variable/caveat`), not Patrick Hand | Caveat reads as a thoughtful margin note; Patrick Hand reads as a kid's-birthday-card. For jeugdzorg, the former. |
| 7 | Code architecture: **per-section Astro islands**, not a single monolithic `<HomePage client:load />` | Better TTI, smaller initial payload, more idiomatic Astro. Visually identical to a monolith. |
| 8 | Animation budget: **selective** — nav indicator, mobile menu, per-section whileInView fade-up, floating-card y-bounce. **Drop**: scale-bounce on hover, rotate-on-mount, AnimatePresence on every section transition | Zen's full-volume animation reads too playful for a jeugdzorg site. |
| 9 | Decorative blobs: terracotta tints only — **no** mint/peach/yellow secondaries | Adding new accent hues would clash with the kept terracotta brand. |
| 10 | Squiggle underline: used **once**, under "hart" in the hero | One emphatic gesture; multiple uses dilute it. |

## 4. Information architecture

```
Nav (sticky)
↓
Hero
↓
Werkwijze    (was Zen "Features")
↓
Over mij     (was Zen "Community" — repurposed, see §6.4)
↓
Wat telt     (was Zen "Wisdom")
↓
Contact      (was Zen "CTA grid" — collapsed, see §6.6)
↓
Footer       (3-column, was Zen "Footer")
```

Anchor IDs: `#top` (hero), `#werkwijze`, `#over`, `#wat-telt`, `#contact`. Footer has none. Nav links: **Werkwijze · Over · Wat telt · Contact**.

## 5. Stack changes

### 5.1 Add

| Package | Version target | Use |
|---|---|---|
| `@astrojs/react` | `^4` | React integration for islands |
| `react` | `^19` | island runtime |
| `react-dom` | `^19` | island runtime |
| `framer-motion` | `^12` | animation primitives — `motion`, `AnimatePresence`, `whileInView`, `layoutId` |
| `lucide-react` | `^0.5x` | icons (`Menu`, `X`, `MapPin`, `Ear`, `HeartHandshake`, `Clock`) |
| `@fontsource-variable/caveat` | `^5` | self-hosted Caveat hand-script font |

`@astrojs/react` is added to `astro.config.mjs` `integrations`.

### 5.2 Keep (unchanged)

`astro@^6`, `tailwindcss@^4`, `@tailwindcss/vite`, `@astrojs/sitemap`, `@fontsource-variable/fraunces`, `@fontsource-variable/inter`, `sharp`. The Dockerfile, `nginx.conf`, `compose.yml`, `.dockerignore`, `.gitignore`, GitHub Actions build, public assets (`favicon.svg`, `og.png`, `llms.txt`, `robots.txt`), and `astro.config.mjs` apart from the React integration are all unchanged.

### 5.3 No third-party CDN

Zen's `Layout.astro` pulls Fonts from Google Fonts CDN. Amicare keeps its current pattern: all fonts loaded via Fontsource CSS imports in `src/styles/global.css`. No third-party font request leaves the page; existing `Base.astro` SEO baseline remains GDPR-clean.

## 6. Section-by-section spec

### 6.1 Nav (`src/components/Nav.tsx`)

**Hydration:** `client:load` (above the fold, mobile menu must be interactive immediately).

**Markup shape:** sticky top, full width, terracotta-on-cream, `border-b border-rule`, `bg-bg/80 backdrop-blur-lg`. Left: small terracotta accent dot (`w-2 h-2 rounded-full bg-accent`) + wordmark `AMICARE-ZORG` in Inter 500, `tracking-[0.18em]` uppercase 13px. Right: 4 anchor links + a terracotta pill button "Contact" (mailto).

**Active-section indicator:** the link for the section currently in view gets a 4px terracotta underline, animated between links via `motion.div layoutId="activeIndicator"`. Tracks viewport scroll via the same `getBoundingClientRect()` trick as Zen's source. Five sections tracked: `top, werkwijze, over, wat-telt, contact`.

**Mobile (`<md`):** nav links collapse into a hamburger button (lucide `Menu` / `X`). Tapping opens an `AnimatePresence` panel anchored top-right, `bg-card border-rule rounded-2xl shadow-2xl`, with the same anchor links stacked vertically + the "Contact" pill at the bottom. Click outside or click any link to close.

**Drop from Zen:** the `PawPrint` icon (replaced by the existing terracotta dot), the playful "Join the Clowder" copy (replaced by "Contact"), the `whileHover scale 1.05` on links (too playful — kept only the active-indicator spring).

### 6.2 Hero (`src/components/Hero.tsx`)

**Hydration:** `client:load` (floating cards animate above the fold).

**ID:** `#top`. Min height `min-h-[90vh]`. Padding: `px-6 py-12 md:px-12 lg:px-24`. `flex-col md:flex-row`.

**Decorative blobs:** two, both terracotta — top-left `bg-accent/15 blur-3xl w-[500px] h-[500px]`, bottom-right `bg-accent/8 blur-3xl w-[400px] h-[400px]`. Both `-z-10`, `pointer-events-none`.

**Left column** (`md:w-1/2`):

- Caveat kicker: `Voor jongeren en gezinnen` — terracotta, `font-script` 22px, `-rotate-2`, mounted with `motion initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}`.
- Headline (Fraunces 400, 56–88px responsive): `Jeugdzorg met` newline `<span italic text-accent>hart</span> en toewijding.` with an SVG squiggle behind/below "hart" (see §7.4).
- Body (Inter 17–18px, `text-ink-muted max-w-md`): the existing intro paragraph from current `Hero.astro` ("Al jarenlang werk ik met toewijding…").
- Two pills below body: `— Roermond e.o.` and `— Persoonlijke aanpak`. Inter 12px, `bg-secondary/30 border border-rule rounded-full px-3 py-2`. **No** coloured icon circles (Zen had these — drop, too busy).

**Right column** (`md:w-1/2`, relative):

- Image: `toys.jpg` via `astro:assets` `<Image>` (already imported). `aspect-[4/5] md:aspect-[4/3] object-cover rounded-[3rem] shadow-2xl`. Static rotation: `md:rotate-3`. **No** rotate-in mount animation. AVIF, eager load, `fetchpriority="high"`.
- Floating card A (bottom-left, `-bottom-8 -left-4 md:left-10`): white, `rounded-2xl shadow-lg p-4 max-w-[230px]`. Contains the existing pull-quote: a terracotta open-quote glyph + Fraunces italic 19–20px text "Écht verschil maken voor jongeren en gezinnen." `motion` infinite y-bounce: `animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}`.
- Floating card B (top-right, `-top-4 -right-4 md:-right-8`): white, same card style. Contains lucide `MapPin` icon in a `bg-secondary/30 rounded-full p-2` + two text lines: bold `Roermond e.o.` + muted `Limburg-Noord`. `motion` infinite y-bounce, opposite phase: `animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}`.

### 6.3 Werkwijze (`src/components/Werkwijze.tsx`)

**Hydration:** `client:visible`.

**ID:** `#werkwijze`. Padding: `px-6 py-24 md:px-12 lg:px-24`. Background: `bg-white/50` (a soft contrast band like Zen's Features section).

**Header block:** centered, `mb-16`. Caveat kicker `Drie dingen` (terracotta, 20px). Heading (Fraunces 400, 36–48px): `Wat voor mij <span italic text-accent>centraal staat</span>.`

**3-card grid** (`grid-cols-1 md:grid-cols-3 gap-8`, `max-w-7xl mx-auto`):

| Card | Icon (lucide) | Label | Body (existing copy) |
|---|---|---|---|
| 1 | `Ear` | **Aandacht** | "Echt luisteren naar wat een jongere of een gezin op dat moment nodig heeft. Zonder aannames vooraf." |
| 2 | `HeartHandshake` | **Betrokkenheid** | "Naast mensen staan, niet erboven. Werken vanuit gelijkwaardigheid en vertrouwen." |
| 3 | `Clock` | **Continuïteit** | "Aanwezig blijven, ook als trajecten lang of ingewikkeld worden. De relatie als basis." |

Each card: `bg-card rounded-[2rem] shadow-lg p-8` w/ border-none. Top section (`bg-accent/8 h-32 flex items-center justify-center`): icon at 48px, terracotta. Bottom (text): label in Fraunces 24px, body in Inter 16–17px `text-ink-muted leading-relaxed`. Stagger fade-up: `motion initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5, delay: idx*0.1}}`. **Drop** Zen's `whileHover y:-10` (too playful for the section).

### 6.4 Over mij (`src/components/OverMij.tsx`)

**Hydration:** `client:visible`.

**ID:** `#over`. Padding: `px-6 py-24 md:px-12 lg:px-24`. Plain `bg-bg`.

**Repurpose note:** this slot in Zen is the Community/testimonials grid. Amicare uses it as a single-column prose section instead — same vertical proportions, but no card grid.

**Layout:** centered, max-width `max-w-3xl mx-auto`.

**Header block** (centered, `mb-12`):
- Caveat kicker `Over mij` (terracotta, 20px).
- Heading (Fraunces 400, 36–44px): `Het vak waar mijn <span italic text-accent>hart ligt</span>.`

**Body** (centered prose, `max-w-prose`, Inter 17–18px, `leading-relaxed text-ink/90 space-y-6`):

> Al jarenlang werk ik met toewijding in de jeugdzorg. Dit is het vak dat ik ken — waar mijn hart ligt, en waar ik mij dagelijks voor inzet.

> Tegelijk blijf ik mijzelf graag ontwikkelen, en sta ik open voor nieuwe uitdagingen en opdrachten binnen het werkveld.

> Naast mijn werk ben ik moeder, en geniet ik van het drukke, gezellige gezinsleven. De combinatie van werk en gezin maakt mijn dagen dynamisch — en waardevol.

(The first paragraph is duplicated in the hero body. Decide at first preview whether to drop it from the hero, drop it from Over mij, or keep both — current ship has it only in the hero.)

Animation: single `whileInView` fade-up on the whole block.

### 6.5 Wat telt (`src/components/WatTelt.tsx`)

**Hydration:** `client:visible`.

**ID:** `#wat-telt`. Padding: `px-6 py-24 md:px-12`. Background: `bg-secondary/20` — a soft tinted contrast band, matching Zen's Wisdom section.

**Layout:** centered, `max-w-3xl mx-auto text-center`.

**Header block:**
- Caveat kicker `Wat telt` (terracotta, 20px).

**Quote** (Fraunces 400 italic, 36–60px, `leading-tight text-foreground/85`):

> "Vertrouwen ontstaat in de tijd, niet in één gesprek."

**Supporting body** (Inter 17px, `text-ink-muted max-w-prose mx-auto mt-6`):

> Daarom werk ik graag in trajecten waar continuïteit en kleine stappen het echte werk doen — voor jongeren, voor gezinnen, en voor de mensen om hen heen.

**Image treatment** (decision deferred to first preview):
- **Plan A:** `bedroom.jpg` rendered behind the section as a low-opacity (~10–15%) AVIF with a soft cream gradient overlay, so the quote sits on top with full readability.
- **Plan B (fallback):** `bedroom.jpg` rendered as a small inset rounded photo `aspect-[4/5] max-w-xs` to one side of the centered quote (like a margin photograph).

Risk: Plan A may not have enough contrast for the centered Fraunces italic text on top. If Plan A fails accessibility (WCAG AA on 36px italic), fall back to Plan B.

Animation: single `whileInView` fade-up.

### 6.6 Contact (`src/components/Contact.astro`)

**Hydration:** none. Pure `.astro` (no JS needed).

**Repurpose note:** this slot in Zen is a 3-card "Choose your path" CTA grid. Amicare collapses it to a single oversized email link — no 3-card grid.

**ID:** `#contact`. Padding: `px-6 py-24 md:px-12 lg:px-24`. Plain `bg-bg`.

**Layout:** centered, `max-w-3xl mx-auto text-center space-y-8`.

- Caveat kicker `Contact` (terracotta, 20px).
- Heading (Fraunces 400, 32–40px, `text-ink-muted max-w-[24ch] mx-auto`): `Wilt u meer informatie of in contact komen?`
- Email link (Fraunces 400, 28–48px, `text-ink underline decoration-1 underline-offset-[8px] hover:decoration-accent hover:text-accent transition-colors`): `info@amicare-zorg.nl`.

No animations (this is the call-to-action; it should just sit there and be clickable).

### 6.7 Footer (`src/components/Footer.astro`)

**Hydration:** none. Pure `.astro`.

**Layout:** 3-column on `md+`, single-column stack on mobile. Padding: `px-6 py-16 md:px-12 lg:px-24`. Soft gradient: `bg-gradient-to-br from-secondary/5 via-bg to-accent/5 border-t border-rule`.

**Columns** (`grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-7xl mx-auto`):

| Column | Content |
|---|---|
| **Left** — brand | Small terracotta dot + wordmark `AMICARE-ZORG` (Inter 500 16px, `tracking-[0.18em]` uppercase). Below: tagline in Fraunces italic 14px `text-ink-muted`: "Jeugdzorg met hart en toewijding." |
| **Centre** — bedrijfsgegevens | Heading: small Inter uppercase 12px terracotta "Bedrijfsgegevens". Body: 13px Inter, `text-ink-muted`, three lines stacked — `Handelsnaam: AMICARE ZORG`, `KVK 99968347`, `Vestigingsnr. 000065004922`. |
| **Right** — contact | Heading: small Inter uppercase 12px terracotta "Contact". Body: address (`Spinsterstraat 17`, `6043 RJ Roermond`) + email link `info@amicare-zorg.nl`. |

**Copyright row:** below a thin `border-t border-rule my-8`. Single line, Inter 12px `text-ink-muted/60`, centered on mobile / left-aligned on desktop: `© 2026 Amicare-Zorg`.

**Drop from Zen:** the right-column repeat-CTA "Join Our Community" button (redundant w/ §6.6), the lucide icons next to category headings (too busy), the "Built with ❤️" line (not professional for the context).

## 7. Visual system

### 7.1 Palette (unchanged)

Token | Value | Use
---|---|---
`--color-bg` | `#FBF7F0` | page background
`--color-ink` | `#1F1A14` | body text, headings
`--color-ink-muted` | `#5A4F44` | secondary text, footer body
`--color-accent` | `#B45A3C` | hero rule, italic accent words, kicker, pill buttons, blob tints, squiggle stroke
`--color-rule` | `rgba(31,26,20,0.12)` | hairlines, card borders

To support Zen's `bg-card`, `bg-secondary/30`, `bg-accent/8` patterns under Tailwind 4's `@theme` directive, the existing token block in `src/styles/global.css` extends with:

```css
@theme {
  --color-card: #FFFFFF;
  --color-secondary: #EFE9DD;  /* warm-neutral tint between bg and ink, used for soft contrast bands */
  /* …existing tokens unchanged */
}
```

`bg-accent/8`, `bg-accent/15` etc. work natively under Tailwind 4's `/<opacity>` modifier on hex/RGB colours, no extra config.

### 7.2 Typography

| Role | Family | Weight | Size (desktop / mobile) |
|---|---|---|---|
| Wordmark | Inter Variable | 500 | 16 / 14 px (uppercase 0.18em) |
| Hero headline | Fraunces Variable | 400 (italic for accent fragment) | 88 / 56 px |
| Section heading (h2) | Fraunces Variable | 400 (italic accent) | 48 / 36 px |
| Card label (h3) | Fraunces Variable | 400 | 24 / 22 px |
| Caveat kicker | Caveat Variable | 500 | 22 / 20 px (rotated -2°) |
| Body | Inter Variable | 400 | 18 / 17 px |
| Pill text | Inter Variable | 500 | 12 px |
| Footer | Inter Variable | 400 | 13 px |
| Copyright | Inter Variable | 400 | 12 px |
| Hand-script accent (general) | Caveat Variable | — | 18–24 px |

Self-hosted via three Fontsource imports in `src/styles/global.css`:

```css
@import '@fontsource-variable/fraunces/index.css';
@import '@fontsource-variable/inter/index.css';
@import '@fontsource-variable/caveat/index.css';

@theme {
  --font-sans: 'Inter Variable', ui-sans-serif, system-ui, sans-serif;
  --font-serif: 'Fraunces Variable', Georgia, serif;
  --font-script: 'Caveat Variable', cursive;
}
```

Tailwind utility class `font-script` becomes available automatically under Tailwind 4's `@theme` block.

### 7.3 Decorative blobs

Reusable component `src/components/decor/Blobs.astro` exports a generic blob pattern:

```astro
---
interface Props {
  variant?: 'hero' | 'section';
}
const { variant = 'section' } = Astro.props;
---
<div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
  {variant === 'hero' && (
    <>
      <div class="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-accent/15 blur-3xl"></div>
      <div class="absolute -bottom-[10%] -right-[5%] w-[400px] h-[400px] rounded-full bg-accent/8 blur-3xl"></div>
    </>
  )}
  {variant === 'section' && (
    <div class="absolute -bottom-[20%] -right-[10%] w-[300px] h-[300px] rounded-full bg-accent/6 blur-3xl"></div>
  )}
</div>
```

Used by `Hero.tsx` (variant `hero`) and `WatTelt.tsx` (variant `section`). Other sections ship without blobs.

### 7.4 Squiggle SVG

Component `src/components/Squiggle.astro`:

```astro
---
---
<svg
  aria-hidden="true"
  viewBox="0 0 100 10"
  preserveAspectRatio="none"
  class="absolute -bottom-1 left-0 -z-10 h-3 w-full text-accent/40"
>
  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round" />
</svg>
```

Used **once** in `Hero.tsx` — wrap "hart" in `<span class="relative inline-block"><Squiggle />hart</span>`.

Risk: at very narrow viewports, the squiggle may extend past the word's baseline if "hart" wraps. Mitigation: `whitespace-nowrap` on the wrapping span. Will be tested at 320px.

### 7.5 Animation conventions

| Where | Primitive | Notes |
|---|---|---|
| Hero text on mount | `motion initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}` | Single mount, not whileInView (already in view) |
| Hero pills stagger | `motion initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.4+idx*0.1}}` | Per pill |
| Hero floating card y-bounce | `motion animate={{y:[0,-10,0]}} transition={{repeat:Infinity, duration:4, ease:'easeInOut'}}` | Card B opposite phase: `[0,10,0]`, `delay:0.5` |
| Werkwijze cards | `motion whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5, delay:idx*0.1}}` | Triggers when grid enters viewport |
| Over mij prose block | Same `whileInView` shape, single block | |
| Wat telt quote | Same `whileInView` shape, single block | |
| Nav active indicator | `motion.div layoutId="activeIndicator"` | Spring transition, shared layout across links |
| Mobile menu | `<AnimatePresence mode="wait">` w/ `initial={{opacity:0,y:-20}}` etc. | Mounts on toggle |
| Hover effects | **None** beyond colour transitions | Zen had `whileHover scale 1.05` everywhere — drop, too playful |
| Page load | No global page-mount fade — Astro's static-first nature handles this | |

### 7.6 Spacing scale

Section vertical rhythm: `py-24` desktop / `py-16` mobile, identical to Zen.
Page max-width: `max-w-7xl` (1280px) — wider than the prior spec's 1080px to match Zen's grid.
Hero `min-h-[90vh]` (was 80vh).
Card grid: `gap-8` on `md+`.

## 8. File map

```
site-amicare-zorg/
  astro.config.mjs              ← updated: add @astrojs/react integration
  package.json                  ← updated: see §5.1 deps
  src/
    assets/
      bedroom.jpg               (unchanged)
      toys.jpg                  (unchanged)
    components/
      Nav.tsx                   ← NEW (replaces Nav.astro)
      Hero.tsx                  ← NEW (replaces Hero.astro)
      Werkwijze.tsx             ← NEW (replaces Werkwijze.astro)
      OverMij.tsx               ← NEW (replaces OverMij.astro)
      WatTelt.tsx               ← NEW (replaces WatTelt.astro)
      Contact.astro             ← updated: Zen padding/typography
      Footer.astro              ← updated: 3-column layout
      Squiggle.astro            ← NEW
      decor/
        Blobs.astro             ← NEW
    layouts/
      Base.astro                (unchanged structurally; only the global.css extension is new)
    pages/
      404.astro                 (unchanged)
      index.astro               ← updated: imports the new .tsx components, applies client:* directives
    styles/
      global.css                ← updated: add Caveat fontsource import, --font-script and --color-card tokens
  public/                       (unchanged)
  docs/superpowers/specs/
    2026-05-01-amicare-zorg-design.md       (kept, marked superseded)
    2026-05-01-amicare-restyle-design.md    ← THIS FILE
```

Delete (after `.tsx` replacements ship and verify): `Nav.astro`, `Hero.astro`, `Werkwijze.astro`, `OverMij.astro`, `WatTelt.astro`. The implementation plan handles the cutover.

## 9. Performance budget (revised)

| Metric | Prior | New | Notes |
|---|---|---|---|
| Lighthouse mobile, Performance | ≥95 | **≥90** | Five `client:visible` islands defer until scroll; only Nav and Hero hydrate eagerly. |
| Lighthouse mobile, A11y / SEO / Best Practices | ≥95 | ≥95 | Unchanged. |
| Initial JS payload (gzipped) | 0 | **≤140 KB** | React 19 ~45KB + framer-motion core ~50KB + 6 lucide icons tree-shaken ~3KB + glue. |
| Total page weight excl. images | ≤200 KB | **≤350 KB** | Includes the JS budget above. |
| Largest Contentful Paint | n/a | ≤2.5s on 4G Moto G4 emulated | Hero image (`toys.jpg`) is the LCP target — eager + AVIF + `fetchpriority="high"`. |
| Cumulative Layout Shift | n/a | ≤0.05 | Floating cards are absolutely positioned (no shift); blobs are `-z-10`. |

## 10. Risks / open at design time

1. **Squiggle word-tracking.** The squiggle SVG sits behind "hart" via `relative inline-block + absolute`. At very narrow viewports "hart en toewijding" may wrap and split the squiggle. Mitigation: `whitespace-nowrap` on the wrapping span; test at 320px. If it still breaks, drop the squiggle on `<sm` and ship only `>=sm`.
2. **`bedroom.jpg` as Wat-telt backdrop contrast.** Plan A (low-opacity full-bleed) may fail WCAG AA on the 36px italic. Plan B fallback: small inset rounded photo to the side of the centered quote. Decided at first preview.
3. **Caveat at small sizes** (kicker ~14–16px) can read as fussy. If first-preview review flags it, drop Caveat entirely and use Inter italic for kickers — the `--font-script` token stays defined but unused. Adding the dependency is cheap; removing the visual treatment is just markup.
4. **Duplicate first-paragraph.** The current ship has the "Al jarenlang werk ik…" paragraph in the hero only. The new IA places it in Over mij as well (matching the original prose source). At first preview, choose: keep in hero only (drop from Over mij), keep in Over mij only (drop from hero, lose hero body), or keep in both (rare but defensible).
5. **Active-section indicator off-screen sections.** Zen's `getBoundingClientRect()` loop assumes section IDs exist; Footer has none. Code must skip nav-tracking for Footer (no underline on any link when scrolled past Contact).
6. **Mobile floating cards.** Cards A and B at narrow viewports (<375px) can exceed the image bounds and clip outside the column. Mitigation: stop them at `-bottom-4 -left-2` on mobile (less overflow than `md+`).
7. **Repo-public concern.** `optidigi/site-amicare-zorg` is public. Brand decisions and architectural choices in this restyle are visible. No new sensitive content is introduced.

## 11. Out of scope (unchanged from prior spec)

Forms, analytics, CMS, dark mode, i18n, cookie banner, client-side router, second route, sub-pages, fabricated testimonials, third-party font CDN, JS frameworks beyond React/framer-motion, dependency on a CMS or content service. The site remains a static one-pager served via Coolify+Docker+Nginx behind Nginx Proxy Manager.

## 12. Success criteria

- All 7 sections render on `pnpm build` with no console errors and no Astro/Vite warnings.
- Initial HTML+CSS payload ≤ 50 KB. Initial JS (gzipped, summed across `client:load` islands) ≤ 140 KB. `client:visible` islands hydrate on scroll.
- Lighthouse mobile, throttled 4G: Performance ≥ 90, A11y ≥ 95, SEO ≥ 95, Best Practices ≥ 95.
- Site renders identically (within reasonable browser-CSS variation) in current Firefox, Chrome, Safari, Mobile Safari, Mobile Chrome.
- All copy is Dutch; no English strings leak (e.g. "Join the Clowder" gone, "Welcome home, human" gone, lucide icon `aria-label`s in Dutch where present).
- All five tracked anchors (`#top, #werkwijze, #over, #wat-telt, #contact`) work with the sticky-nav offset (`scroll-padding-top` already set in current `global.css`).
- Active-nav-indicator follows scroll across all five tracked sections without flicker.
- Mobile menu opens/closes with AnimatePresence; tapping any link closes it.
- Floating cards animate continuously without affecting CLS.
- WCAG AA contrast on all text including the Wat-telt quote (whichever Plan it ships with).
- The deploy chain (Dockerfile, GitHub Actions, Coolify pull + compose up) runs identically to the current shipped site — no infrastructure changes.

## 13. Non-goals for the implementation plan

The plan that follows this spec should NOT:

- Re-decide any of §3's locked decisions.
- Refactor unrelated code (e.g. revisit the Dockerfile, sitemap config, OG-image generator).
- Add a CMS, a content layer, or a markdown collection — content stays inline in the components.
- Add tests beyond what Astro's build-time checks provide (this is a static one-pager; visual review is the test).
- Add Storybook, a component library structure, or design tokens beyond the `@theme` block.
