# Amicare-Zorg — One-pager design spec

**Date:** 2026-05-01
**Project:** `optidigi/site-amicare-zorg`
**Domain:** amicare-zorg.nl
**Status:** Superseded — first by the post-implementation note below, then in full by [`2026-05-01-amicare-restyle-design.md`](./2026-05-01-amicare-restyle-design.md) which replaces the IA, components, and performance budget.

---

## Implementation note (2026-05-01)

After this spec was approved, the project owner pointed at https://themes.zira.my.id/
as a layout reference and asked the site to be restructured before launch. The
**design tokens** (palette, typography, content) below are accurate and shipped;
the **layout, sections, and component count** are not.

**What actually shipped:**

- Sticky top nav (was: floating top-right)
- Hero is 2-column on `md+` — text left, the gesture image right with the pull-quote
  rendered as a floating card overlaid on the image's bottom-left.
- Five content sections instead of three: `Hero → Over mij → Werkwijze → Wat telt → Contact`,
  plus `Footer`.
- Two new Dutch copy blocks were authored: `Werkwijze` (three principles —
  Aandacht, Betrokkenheid, Continuïteit) and `Wat telt` (a short reflective passage).
- The standalone `ImageBreak.astro` component described in §3 was deleted —
  the gesture image lives in the hero.
- Tailwind 4 with `@tailwindcss/vite` (peer-dep conflict on `@astrojs/tailwind`
  with current Astro 6); theme tokens live in `src/styles/global.css` via the
  `@theme` block, not in a separate `tailwind.config.mjs`.

The body copy in §5 below describes the **content** correctly; only the
**section it lives in** has shifted.

---

## 1. Purpose

A static one-pager for Amicare-Zorg, a sole jeugdzorg (Dutch youth-care) practitioner.
The site exists to satisfy a *"site needs to exist"* obligation — not to acquire clients,
not to promote services. Tone is therefore deliberately understated: present, calm,
human, and short. No CTAs beyond a single email link.

Visitor goal: confirm the practice exists and find an email to contact.

## 2. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Astro (latest, from `npm create astro` `minimal` starter) | Static output, ~zero JS to client. |
| Styling | Tailwind CSS (`@astrojs/tailwind` integration) | Constrained palette/font config in `tailwind.config.mjs`. |
| Fonts | Self-hosted via `@fontsource-variable/fraunces` and `@fontsource-variable/inter` | No third-party font requests; no GDPR cookie banner needed. |
| Sitemap | `@astrojs/sitemap` | Generates `sitemap-index.xml`. |
| JS frameworks | None | No React/Vue/Svelte/Solid integrations. Pure `.astro` + CSS. |
| Package manager | pnpm | Matches the surrounding `optidigi` tooling. |
| Node | `node:22-alpine` (build stage) | Pinned in Dockerfile. |
| Runtime server | `nginx:alpine` (serve stage) | Static `dist/` served from `/usr/share/nginx/html`. |

## 3. Information architecture

Single page, three content sections plus footer. Top-right anchor nav scrolls
smoothly between them; no router, no client-side routing.

| # | Section | Anchor | Purpose |
|---|---|---|---|
| — | Hero | `#top` (page top) | Name + tagline. |
| 1 | Over mij | `#over` | Three short paragraphs of personal text + one pull-quote. |
| — | Image break | (no anchor) | Single Unsplash gesture photo as a visual exhale between Over mij and Contact. |
| 2 | Contact | `#contact` | Email link only. |
| — | Footer | (no anchor) | © year, KVK number, optional contact line. |

Anchor nav (top-right): `Over · Contact`.

## 4. Visual system

### 4.1 Direction

Editorial / typographic. Type-led hero with no photo. Generous whitespace.
Single accent colour used sparingly. One pull-quote and one photo across the
whole page — both placed for breath, not decoration.

### 4.2 Palette

| Role | Token | Hex | Use |
|---|---|---|---|
| Background | `--bg` | `#FBF7F0` | Page background, warm off-white. |
| Ink | `--ink` | `#1F1A14` | Body text, headings. |
| Ink muted | `--ink-muted` | `#5A4F44` | Secondary text, footer, nav. |
| Accent | `--accent` | `#B45A3C` | Hero rule, italic words in tagline, pull-quote mark. **Never** body links. |
| Hairline | `--rule` | `rgba(31,26,20,0.12)` | Section dividers, hairlines. |

### 4.3 Typography

| Role | Family | Weight | Size (desktop / mobile) | Tracking |
|---|---|---|---|---|
| Wordmark `AMICARE-ZORG` | Inter Variable | 500 | 18 / 16 px | `0.18em` uppercase |
| Hero heading (decorative) | Fraunces Variable | 400 | 88 / 56 px | `-0.01em` |
| Tagline | Fraunces Variable | 400 (italic for accent fragment) | 28 / 22 px | `0` |
| Section label | Inter Variable | 500 | 12 px | `0.18em` uppercase |
| Body | Inter Variable | 400 | 18 / 17 px | `0` |
| Pull-quote | Fraunces Variable | 400 italic | 32 / 26 px | `-0.005em` |
| Footer | Inter Variable | 400 | 13 px | `0.04em` |

Body line-height 1.6, headings 1.05–1.15.
Body measure: `max-width: 58ch`.
Page max-width: `min(1080px, 92vw)`.

### 4.4 Spacing scale

Tailwind defaults are fine. Section vertical rhythm: `py-24` desktop / `py-16` mobile.
Hero: `min-h-[80vh]` with content centred vertically.

### 4.5 Imagery

Exactly **one** photo on the page, sitting between "Over mij" and "Contact".
Sourced from Unsplash, free licence. Selection criteria:

- No identifiable faces.
- No children. (jeugdzorg context — avoid any implication a real client is depicted.)
- Quiet gesture or atmosphere — hands at a desk, hands holding a warm cup,
  partial figure looking out a window, soft natural light on a textured surface.
- Warm colour temperature; nothing high-saturation.
- Aspect ratio close to 3:2 landscape; will be displayed at full content width,
  rounded-corners off, no caption.

Three candidates to pick from at implementation time (will list URLs in the
implementation plan and the project owner picks one):

1. Hands writing in a journal, soft daylight.
2. Hands resting around a warm cup at a wooden table.
3. Partial figure (back / shoulder only) looking out a sunlit window.

## 5. Content

### 5.1 Hero

Wordmark: `AMICARE-ZORG` (uppercase, letterspaced).
Thin terracotta rule, 28 px wide, beneath wordmark.
Tagline (Fraunces): *"Jeugdzorg met **hart en toewijding**."*
The phrase "hart en toewijding" rendered in italic + accent colour.

### 5.2 Over mij

Section label: `OVER MIJ`.

Body copy (lightly tightened from the source — voice preserved, redundancy
trimmed, em-dashes added for editorial rhythm):

> Al jarenlang werk ik met toewijding in de jeugdzorg. Dit is het vak dat ik
> ken — waar mijn hart ligt, en waar ik mij dagelijks voor inzet.
>
> Tegelijk blijf ik mijzelf graag ontwikkelen, en sta ik open voor nieuwe
> uitdagingen en opdrachten binnen het werkveld.
>
> Naast mijn werk ben ik moeder, en geniet ik van het drukke, gezellige
> gezinsleven. De combinatie van werk en gezin maakt mijn dagen dynamisch
> — en waardevol.

Pull-quote (between paragraph 1 and paragraph 2, set off in Fraunces italic
with a small terracotta open-quote mark):

> "Écht verschil maken voor jongeren en gezinnen."

Edits made vs. source text:

- Dropped "veel" before "toewijding" (redundant intensifier).
- Dropped "met passie" from sentence 2 ("toewijding" + "hart ligt" already convey it).
- Pulled the *"écht verschil maken"* line out of paragraph 1 and promoted it
  to a pull-quote. Original sentence is therefore removed from prose.
- Dropped "altijd" before "open" (implicit).
- Changed "drukke, maar gezellige" → "drukke, gezellige" (no real contrast).
- Replaced two periods with em-dashes for cadence.

### 5.3 Contact

Section label: `CONTACT`.

Body:

> Wilt u meer informatie of in contact komen? Dat kan via:
>
> [info@amicare-zorg.nl](mailto:info@amicare-zorg.nl)

Email rendered larger than body (24 px desktop), serif (Fraunces), ink colour,
underlined on hover.

### 5.4 Footer

Single thin terracotta rule above. One line, body-muted, centred or left-aligned:

```
© 2026 Amicare-Zorg · KVK 99968347 · info@amicare-zorg.nl
```

Phone number deferred — owner will provide later if desired; footer ships
without it for the initial deploy.

## 6. SEO baseline

### 6.1 Document head

| Tag | Value |
|---|---|
| `<html lang>` | `nl` |
| `<title>` | `Amicare-Zorg — Jeugdzorg met hart en toewijding` |
| `<meta name="description">` | `Amicare-Zorg — werken in de jeugdzorg met hart en toewijding. Voor informatie of contact: info@amicare-zorg.nl.` |
| `<meta name="robots">` | `index, follow` |
| `<link rel="canonical">` | `https://amicare-zorg.nl/` |
| OpenGraph | `og:title`, `og:description`, `og:url`, `og:type=website`, `og:locale=nl_NL`, `og:image` (page screenshot or wordmark image — see open items) |
| Twitter | `twitter:card=summary_large_image` (mirrors OG values) |

### 6.2 `public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://amicare-zorg.nl/sitemap-index.xml
```

### 6.3 Sitemap

Generated at build time by `@astrojs/sitemap`. Single URL: `https://amicare-zorg.nl/`.

### 6.4 `public/llms.txt`

Short markdown summary for AI crawlers:

```
# Amicare-Zorg

A solo practitioner working in Dutch youth care (jeugdzorg).

Tagline: Jeugdzorg met hart en toewijding.

Contact: info@amicare-zorg.nl
```

### 6.5 Favicon

Single `public/favicon.svg`. Design: lowercase italic **a** in Fraunces,
terracotta on warm-cream background, rounded corners. ICO fallback not
generated (Astro emits `<link rel="icon" href="/favicon.svg">`; modern
browsers handle SVG favicons natively).

### 6.6 OG image

A 1200×630 PNG generated once and committed to `public/og.png`. Design mirrors
the hero: cream background, wordmark + thin terracotta rule + tagline. No
runtime OG generation needed for a static one-pager.

## 7. Deploy

### 7.1 Dockerfile (multi-stage)

```dockerfile
# --- build stage ---
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# --- serve stage ---
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### 7.2 `nginx.conf`

Minimal config: serve static files, gzip on, sensible cache headers
(immutable for hashed assets, short for `index.html`), 404 → `404.html`
fallback (Astro emits one).

### 7.3 `compose.yml`

Single service `web`, image built locally (or from GHCR if a CI step is
added later). Traefik v3 labels handle:

- A router matching `amicare-zorg.nl` and `www.amicare-zorg.nl` on the
  `websecure` (HTTPS) entrypoint, with TLS via Coolify-managed certs.
- A redirect-to-HTTPS middleware on the HTTP entrypoint.
- A `www → apex` redirect middleware so `www.amicare-zorg.nl` 301s to the
  bare domain.

Final label syntax authored during implementation.

### 7.4 `.dockerignore`

Excludes `node_modules`, `dist`, `.astro`, `.git`, `.superpowers`, docs,
`compose.yml` itself, and editor cruft.

### 7.5 GitHub repo

`optidigi/site-amicare-zorg`, **public**. Created via `gh repo create`.
First commit contains scaffolded project, this spec, and all deploy artefacts.
No CI workflow — Coolify pulls and builds on push.

## 8. Project structure (target)

```
amicare-zorg/
  .dockerignore
  .gitignore
  Dockerfile
  README.md
  astro.config.mjs
  compose.yml
  docs/
    superpowers/
      specs/
        2026-05-01-amicare-zorg-design.md   ← this file
  nginx.conf
  package.json
  pnpm-lock.yaml
  public/
    favicon.svg
    llms.txt
    og.png
    robots.txt
  src/
    components/
      Footer.astro
      Hero.astro
      Nav.astro
      Section.astro
    layouts/
      Base.astro
    pages/
      index.astro
    styles/
      global.css
  tailwind.config.mjs
  tsconfig.json
```

## 9. Open items (resolved or deferred)

1. ~~**KVK number** for the footer.~~ — `99968347` (resolved 2026-05-01).
2. **Phone number** — deferred; ship without it, add later if owner provides.
3. **Final imagery pick** — implementer selects from Unsplash without further
   review; project owner will flag if the chosen photo doesn't fit.
4. **`og.png` content review** — once generated, project owner reviews
   before merge.

None of the above block scaffolding, building, or deploying.

## 10. Out of scope

- Forms (contact, newsletter, anything).
- Analytics or tracking (no GA, no Plausible, nothing).
- A blog, news, services pages, or any second route.
- A CMS.
- Internationalisation (Dutch-only).
- Dark mode.
- A cookie banner (no third-party requests means none required).
- Any client-side JavaScript beyond Astro's default zero-JS output.

## 11. Success criteria

- `pnpm build` produces a `dist/` that scores ≥95 on Lighthouse mobile across
  all four categories.
- Total page weight under 200 KB (excluding the one image, which is sized down
  to ~60 KB at 1600px wide).
- `docker build .` and `docker run -p 8080:80 <image>` serves the page locally.
- Site renders identically in Firefox, Chrome, Safari, and on mobile Safari/Chrome.
- All copy is Dutch; no English strings leak into the rendered output.
- `https://amicare-zorg.nl/` returns 200 with valid HTML, sitemap and robots
  resolve, OG card preview works in Slack/WhatsApp.
