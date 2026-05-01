# Amicare-Zorg Zen-Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle `site-amicare-zorg` so its IA, components, and animations mirror the Purrfectly Zen template, while keeping Amicare's terracotta-on-cream palette, Fraunces+Inter typography, and existing Dutch content. Source of truth: `docs/superpowers/specs/2026-05-01-amicare-restyle-design.md`.

**Architecture:** Per-section Astro islands. Each interactive section (`Nav`, `Hero`, `Werkwijze`, `OverMij`, `WatTelt`) becomes a `.tsx` React component hydrated with `client:load` (above the fold) or `client:visible` (below). Static sections (`Contact`, `Footer`) remain `.astro`. `index.astro` is the orchestrator — imports + client directives only, no logic. New self-hosted Caveat font for hand-script accents. New tokens (`--color-card`, `--color-secondary`, `--font-script`) added to the existing `@theme` block; existing terracotta/cream/ink/Fraunces/Inter tokens unchanged.

**Tech Stack:** Astro 6, Tailwind 4 (via `@tailwindcss/vite`), `@astrojs/react@^5` (latest at install time; the v5 line is the one that supports Astro 6 + React 19), React 19, react-dom 19, framer-motion ^12, lucide-react ^1 (latest at install time — same icon names as 0.5x), `@fontsource-variable/caveat`, existing `@fontsource-variable/fraunces` and `@fontsource-variable/inter`, `@astrojs/sitemap`. pnpm. Node 22.

**Project root for all relative paths:** `/home/shimmy/Desktop/env/sandbox/site-amicare-zorg`.
The repo is already initialised at this path. Current branch: `main`. Implementation is recommended on a feature branch (`feat/zen-restyle`) per Task 1.

**Verification model:** This site has no JavaScript behaviour to unit-test (no test framework is installed and the previous spec explicitly excluded one). Verification is per-task:

1. `pnpm dev` renders the section as expected at http://localhost:4321 — each task includes a visual checklist.
2. `pnpm build` succeeds without warnings.
3. Manual cross-viewport check at 320 / 768 / 1280 px.

A final Lighthouse + Docker smoke test happens in Task 9.

---

## Up-front deviations from the spec

Two intentional simplifications, made when going from spec → plan:

1. **Squiggle is inlined**, not extracted into `Squiggle.astro`. Spec §7.4 proposed a reusable component; spec §7.4 itself notes "Used **once** in `Hero.tsx`". A 6-line inline SVG in Hero is simpler than an extracted component for a single use.

2. **Blobs are inlined**, not extracted into `decor/Blobs.astro`. Spec §7.3 proposed a reusable component used by Hero (variant `hero`) and WatTelt (variant `section`); each variant ships a different number of blobs (2 vs 1) with different positions, making the component little more than a switch statement. Inlining 4–6 lines in each section is clearer. **Note also:** Hero and WatTelt are React islands (`.tsx`); Astro components cannot be imported into React components, so a shared `Blobs.astro` would have had to become `Blobs.tsx` anyway — no real reuse.

Everything else in the spec ships as written.

---

## File structure (target)

| Path | Action | Responsibility |
|---|---|---|
| `package.json` | **modify** | Add deps: `@astrojs/react`, `react`, `react-dom`, `framer-motion`, `lucide-react`, `@fontsource-variable/caveat`. |
| `astro.config.mjs` | **modify** | Add `react()` integration. |
| `src/styles/global.css` | **modify** | Import Caveat, add `--color-card`, `--color-secondary`, `--font-script` tokens. |
| `src/layouts/Base.astro` | unchanged | (only `global.css` it imports changes) |
| `src/pages/index.astro` | **modify** | Imports React `.tsx` components instead of `.astro`, applies `client:*` directives. Section order unchanged: `Nav → Hero → Werkwijze → OverMij → WatTelt → Contact → Footer`. |
| `src/pages/404.astro` | unchanged | |
| `src/components/Nav.astro` | **delete** | Replaced by `Nav.tsx`. |
| `src/components/Nav.tsx` | **create** | Sticky+blur nav, mobile AnimatePresence menu, layoutId active-section indicator, terracotta "Contact" pill. `client:load`. |
| `src/components/Hero.astro` | **delete** | Replaced by `Hero.tsx`. |
| `src/components/Hero.tsx` | **create** | 2-col, Caveat kicker, Fraunces headline w/ inline squiggle SVG under "hart", body, 2 pills, rotated rounded `toys.jpg`, two y-bouncing floating cards (pull-quote + location). `client:load`. |
| `src/components/Werkwijze.astro` | **delete** | Replaced by `Werkwijze.tsx`. |
| `src/components/Werkwijze.tsx` | **create** | Centered header + 3-card grid w/ lucide icons (Ear / HeartHandshake / Clock), staggered whileInView fade-up. `client:visible`. |
| `src/components/OverMij.astro` | **delete** | Replaced by `OverMij.tsx`. |
| `src/components/OverMij.tsx` | **create** | Centered single-column prose, Caveat kicker, whileInView fade-up. `client:visible`. |
| `src/components/WatTelt.astro` | **delete** | Replaced by `WatTelt.tsx`. |
| `src/components/WatTelt.tsx` | **create** | Centered Fraunces-italic quote on tinted backdrop using `bedroom.jpg` as low-opacity AVIF behind, supporting prose below, whileInView fade-up. `client:visible`. |
| `src/components/Contact.astro` | **modify** | Add Caveat kicker, larger Zen-style padding. Stays `.astro`. |
| `src/components/Footer.astro` | **modify** | 3 columns: brand+tagline / bedrijfsgegevens / adres+email. Soft gradient backdrop. Mobile single-column stack. Stays `.astro`. |
| `src/assets/bedroom.jpg` | unchanged | Used as backdrop in `WatTelt.tsx`. |
| `src/assets/toys.jpg` | unchanged | Used as the right-column photo in `Hero.tsx`. |
| All public assets, Dockerfile, nginx.conf, compose.yml, .github/, scripts/, README.md | unchanged | No infra changes. |

---

## Task 1: Setup — branch, dependencies, config

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`
- Modify: `src/styles/global.css`

- [ ] **Step 1.1: Create the feature branch**

```bash
cd /home/shimmy/Desktop/env/sandbox/site-amicare-zorg
git checkout -b feat/zen-restyle
git status
```

Expected: `On branch feat/zen-restyle. nothing to commit, working tree clean.`

- [ ] **Step 1.2: Install dependencies**

```bash
pnpm add @astrojs/react react@^19 react-dom@^19 framer-motion@^12 lucide-react @fontsource-variable/caveat
pnpm add -D @types/react @types/react-dom
```

Expected: pnpm reports six runtime adds and two devDependency adds. `pnpm-lock.yaml` updated. No peer-dep warnings about React 19 being unsupported.

If `framer-motion@^12` reports a peer-dep mismatch with React 19, install `framer-motion@latest` instead and pin in `package.json` afterwards.

- [ ] **Step 1.3: Add the React integration to `astro.config.mjs`**

Replace the entire file with:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ami-care.nl',
  trailingSlash: 'never',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
```

Diff vs. current file: added `import react from '@astrojs/react';` and added `react()` as the first integration.

- [ ] **Step 1.4: Extend `src/styles/global.css` with the Caveat import and new tokens**

Replace the entire file with:

```css
@import '@fontsource-variable/fraunces/index.css';
@import '@fontsource-variable/inter/index.css';
@import '@fontsource-variable/caveat/index.css';

@import 'tailwindcss';

@theme {
  --color-bg: #FBF7F0;
  --color-ink: #1F1A14;
  --color-ink-muted: #5A4F44;
  --color-accent: #B45A3C;
  --color-rule: rgba(31, 26, 20, 0.12);
  --color-card: #FFFFFF;
  --color-secondary: #EFE9DD;

  --font-sans: 'Inter Variable', ui-sans-serif, system-ui, sans-serif;
  --font-serif: 'Fraunces Variable', Georgia, serif;
  --font-script: 'Caveat Variable', cursive;

  --max-width-prose: 58ch;
  --max-width-page: 1080px;
}

@layer base {
  :root {
    color-scheme: light;
  }

  html {
    background-color: var(--color-bg);
    color: var(--color-ink);
    font-family: var(--font-sans);
    font-size: 17px;
    line-height: 1.6;
    scroll-behavior: smooth;
    scroll-padding-top: 80px;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  @media (min-width: 768px) {
    html { font-size: 18px; }
  }

  body {
    min-height: 100vh;
  }

  ::selection {
    background: rgba(180, 90, 60, 0.18);
  }

  a {
    color: inherit;
  }
}
```

Diff vs. current file: added the Caveat import, added `--color-card`, `--color-secondary`, `--font-script` tokens. Existing tokens unchanged.

- [ ] **Step 1.5: Verify dev server still runs cleanly**

```bash
pnpm dev
```

Expected: Astro reports `Local http://localhost:4321/`. Open the URL — the existing site renders unchanged (no React in use yet, so all components still .astro). No console errors. Stop with Ctrl-C.

- [ ] **Step 1.6: Verify build still succeeds**

```bash
pnpm build
```

Expected: build completes; `dist/index.html` has a slightly larger CSS chunk (Caveat font). No errors, no warnings about missing fonts.

- [ ] **Step 1.7: Commit**

```bash
git add astro.config.mjs package.json pnpm-lock.yaml src/styles/global.css
git commit -m "build: add React + framer-motion + lucide + Caveat for Zen restyle"
```

---

## Task 2: Nav.tsx — sticky React island

**Files:**
- Create: `src/components/Nav.tsx`
- Delete: `src/components/Nav.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 2.1: Create `src/components/Nav.tsx` with the full implementation**

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '#werkwijze', label: 'Werkwijze', id: 'werkwijze' },
  { href: '#over', label: 'Over', id: 'over' },
  { href: '#wat-telt', label: 'Wat telt', id: 'wat-telt' },
] as const;

const TRACKED_SECTIONS = ['top', 'werkwijze', 'over', 'wat-telt', 'contact'] as const;

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('top');

  useEffect(() => {
    const onScroll = () => {
      let current = 'top';
      for (const id of TRACKED_SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      aria-label="Hoofdnavigatie"
      className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-rule bg-bg/80 px-6 py-5 backdrop-blur-lg md:px-12 lg:px-20"
    >
      <a href="#top" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
        <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-accent" />
        <span className="font-sans text-[13px] font-medium uppercase tracking-[0.18em]">
          Amicare-Zorg
        </span>
      </a>

      {/* Desktop links */}
      <div className="hidden items-center gap-8 text-[13px] tracking-[0.04em] md:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className={`relative transition-colors ${
              activeSection === link.id ? 'text-ink' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {link.label}
            {activeSection === link.id && (
              <motion.span
                layoutId="navIndicator"
                aria-hidden="true"
                className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-accent"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </a>
        ))}
        <a
          href="#contact"
          className="rounded-full bg-accent px-5 py-2 text-[13px] font-medium text-bg shadow-sm transition-colors hover:bg-accent/90"
        >
          Contact
        </a>
      </div>

      {/* Mobile toggle */}
      <button
        type="button"
        aria-label={isOpen ? 'Menu sluiten' : 'Menu openen'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        className="rounded-full bg-accent/10 p-2 text-ink transition-colors hover:bg-accent/20 md:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-4 left-4 top-full z-50 mt-2 flex w-[calc(100%-2rem)] flex-col gap-5 rounded-2xl border border-rule bg-card p-6 shadow-2xl md:hidden"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.id}
                href={link.href}
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ delay: i * 0.06, duration: 0.2 }}
                className={`text-[15px] tracking-[0.04em] ${
                  activeSection === link.id ? 'text-ink font-medium' : 'text-ink-muted'
                }`}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: NAV_LINKS.length * 0.06 + 0.05, duration: 0.2 }}
              className="mt-2 inline-block rounded-full bg-accent px-5 py-3 text-center text-[14px] font-medium text-bg"
            >
              Contact
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
```

- [ ] **Step 2.2: Update `src/pages/index.astro` to import `Nav.tsx` instead of `Nav.astro`**

Replace the entire file with:

```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.tsx';
import Hero from '../components/Hero.astro';
import OverMij from '../components/OverMij.astro';
import Werkwijze from '../components/Werkwijze.astro';
import WatTelt from '../components/WatTelt.astro';
import Contact from '../components/Contact.astro';
import Footer from '../components/Footer.astro';
---
<Base>
  <Nav client:load />
  <Hero />
  <Werkwijze />
  <OverMij />
  <WatTelt />
  <Contact />
  <Footer />
</Base>
```

(Section order is `Nav → Hero → Werkwijze → OverMij → WatTelt → Contact → Footer`, same as current ship; only the Nav import changed.)

- [ ] **Step 2.3: Delete the old `Nav.astro`**

```bash
rm src/components/Nav.astro
```

- [ ] **Step 2.4: Verify in dev server**

```bash
pnpm dev
```

Open http://localhost:4321 and verify each item:

- Nav renders as a sticky bar at the top with `AMICARE-ZORG` left and `Werkwijze · Over · Wat telt · Contact` right.
- The "Contact" pill is terracotta.
- Scroll down past Werkwijze — the active link gains an underline that animates between links (smooth spring transition).
- Resize browser below 768px — the link cluster collapses to a hamburger button.
- Tap the hamburger — the menu slides down with stagger, links visible.
- Tap a link in the mobile menu — it scrolls to the section and the menu closes.
- No console errors.

Stop the server with Ctrl-C.

- [ ] **Step 2.5: Verify build**

```bash
pnpm build
```

Expected: build succeeds. The build report shows `Nav` hydrated (look for `[client:load]` near `Nav.tsx`). No warnings.

- [ ] **Step 2.6: Commit**

```bash
git add src/components/Nav.tsx src/components/Nav.astro src/pages/index.astro
git commit -m "feat(nav): React island with mobile menu + active-section indicator"
```

(Note: `git add` on a deleted file stages the deletion.)

---

## Task 3: Hero.tsx — two-column hero with floating cards and inline squiggle

**Files:**
- Create: `src/components/Hero.tsx`
- Delete: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 3.1: Create `src/components/Hero.tsx`**

The image URL is computed in `index.astro` via `getImage()` and passed as a prop. This preserves AVIF optimisation (which Astro's `<Image>` would have done on `.astro`-side) across the React-island boundary.

```tsx
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const PILLS = ['— Roermond e.o.', '— Persoonlijke aanpak'] as const;

interface Props {
  toysSrc: string;
}

export default function Hero({ toysSrc }: Props) {
  return (
    <section
      id="top"
      className="relative flex min-h-[90vh] flex-col items-center overflow-hidden px-6 py-12 md:flex-row md:px-12 lg:px-24"
    >
      {/* Decorative blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[10%] -top-[10%] -z-10 h-[500px] w-[500px] rounded-full bg-accent/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[10%] -right-[5%] -z-10 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl"
      />

      {/* Left column */}
      <div className="relative z-10 w-full space-y-7 md:w-1/2">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block -rotate-2 text-[22px] text-accent"
          style={{ fontFamily: 'var(--font-script)' }}
        >
          Voor jongeren en gezinnen
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-serif text-[44px] font-normal leading-[1.05] tracking-[-0.01em] md:text-[60px] lg:text-[76px]"
          style={{ maxWidth: '14ch' }}
        >
          Jeugdzorg met{' '}
          <span className="relative inline-block whitespace-nowrap italic text-accent">
            hart
            <svg
              aria-hidden="true"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
              className="absolute -bottom-1 left-0 -z-10 h-3 w-full text-accent/40"
            >
              <path
                d="M0 5 Q 50 10 100 5"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>{' '}
          en toewijding.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-md text-[17px] leading-[1.6] text-ink-muted md:text-[18px]"
        >
          Al jarenlang werk ik met toewijding in de jeugdzorg. Dit is het vak dat ik
          ken &mdash; waar mijn hart ligt, en waar ik mij dagelijks voor inzet.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-2 pt-2"
        >
          {PILLS.map((label, idx) => (
            <motion.span
              key={label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + idx * 0.08, duration: 0.4 }}
              className="rounded-full border border-rule bg-secondary/40 px-3 py-1.5 text-[12px] font-medium text-ink-muted"
            >
              {label}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Right column */}
      <div className="relative mt-14 w-full md:mt-0 md:w-1/2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative z-10"
        >
          <img
            src={toysSrc}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="aspect-[4/5] w-full rotate-0 transform rounded-[3rem] object-cover shadow-2xl md:aspect-[4/3] md:rotate-3"
          />

          {/* Floating card A — pull quote, bottom-left */}
          <motion.figure
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="absolute -bottom-8 -left-2 max-w-[230px] rounded-2xl border border-rule bg-card p-4 shadow-lg md:-bottom-10 md:-left-8 md:p-5"
          >
            <span
              aria-hidden="true"
              className="mr-1 align-top text-3xl leading-none italic text-accent"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              &ldquo;
            </span>
            <blockquote className="inline font-serif text-[17px] italic leading-[1.35] text-ink md:text-[19px]">
              Écht verschil maken voor jongeren en gezinnen.
            </blockquote>
          </motion.figure>

          {/* Floating card B — location, top-right */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
            className="absolute -top-6 -right-2 flex max-w-[200px] items-center gap-3 rounded-2xl border border-rule bg-card p-3 shadow-lg md:-top-8 md:-right-8 md:p-4"
          >
            <span className="rounded-full bg-accent/10 p-2 text-accent">
              <MapPin size={18} />
            </span>
            <div className="text-[12px] leading-tight">
              <p className="font-serif text-[14px] italic text-ink">Roermond e.o.</p>
              <p className="text-ink-muted">Limburg-Noord</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3.2: Update `src/pages/index.astro` to use `Hero.tsx` and pass the AVIF URL**

Replace the entire file:

```astro
---
import { getImage } from 'astro:assets';
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.tsx';
import Hero from '../components/Hero.tsx';
import OverMij from '../components/OverMij.astro';
import Werkwijze from '../components/Werkwijze.astro';
import WatTelt from '../components/WatTelt.astro';
import Contact from '../components/Contact.astro';
import Footer from '../components/Footer.astro';
import toysImg from '../assets/toys.jpg';

const toys = await getImage({
  src: toysImg,
  format: 'avif',
  quality: 55,
  width: 1280,
});
---
<Base>
  <Nav client:load />
  <Hero client:load toysSrc={toys.src} />
  <Werkwijze />
  <OverMij />
  <WatTelt />
  <Contact />
  <Footer />
</Base>
```

The `getImage()` call runs at build time. Astro emits the AVIF into `dist/_astro/` and `toys.src` is its hashed URL. The React island receives a string and renders a plain `<img>`.

- [ ] **Step 3.3: Delete the old `Hero.astro`**

```bash
rm src/components/Hero.astro
```

- [ ] **Step 3.4: Verify in dev server**

```bash
pnpm dev
```

Open http://localhost:4321 and verify:

- Hero is two-column on desktop. Left has Caveat kicker (slightly rotated), big serif headline with the word "hart" italicised in terracotta, body paragraph, two small pills.
- Squiggle visible behind/under "hart" in soft terracotta.
- On mount: kicker, headline, body, pills fade in with slight stagger.
- Right column: `toys.jpg` rotated +3°, rounded-3rem corners, big drop shadow.
- Bottom-left of image: white floating card with the pull-quote, bouncing up and down slowly.
- Top-right of image: white floating card with `MapPin` icon, "Roermond e.o.", "Limburg-Noord", bouncing opposite phase.
- Two soft terracotta blurred blobs behind the section.
- Resize to 320px width — single column, image below text, both floating cards still visible inside the image bounds (no clipping off-screen).
- No layout shift while floating cards animate.

Stop server.

- [ ] **Step 3.5: Verify build**

```bash
pnpm build
```

Expected: build succeeds. `Hero.tsx` hydrated as a `client:load` island.

- [ ] **Step 3.6: Commit**

```bash
git add src/components/Hero.tsx src/components/Hero.astro src/pages/index.astro
git commit -m "feat(hero): React island with squiggle, floating cards, blobs"
```

---

## Task 4: Werkwijze.tsx — 3-card grid with lucide icons

**Files:**
- Create: `src/components/Werkwijze.tsx`
- Delete: `src/components/Werkwijze.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 4.1: Create `src/components/Werkwijze.tsx`**

```tsx
import { motion } from 'framer-motion';
import { Clock, Ear, HeartHandshake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Principle = {
  icon: LucideIcon;
  label: string;
  body: string;
};

const PRINCIPLES: Principle[] = [
  {
    icon: Ear,
    label: 'Aandacht',
    body: 'Echt luisteren naar wat een jongere of een gezin op dat moment nodig heeft. Zonder aannames vooraf.',
  },
  {
    icon: HeartHandshake,
    label: 'Betrokkenheid',
    body: 'Naast mensen staan, niet erboven. Werken vanuit gelijkwaardigheid en vertrouwen.',
  },
  {
    icon: Clock,
    label: 'Continuïteit',
    body: 'Aanwezig blijven, ook als trajecten lang of ingewikkeld worden. De relatie als basis.',
  },
];

export default function Werkwijze() {
  return (
    <section
      id="werkwijze"
      className="relative bg-card/50 px-6 py-20 md:px-12 md:py-24 lg:px-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 space-y-3 text-center">
          <span
            className="inline-block -rotate-2 text-[20px] text-accent"
            style={{ fontFamily: 'var(--font-script)' }}
          >
            Drie dingen
          </span>
          <h2 className="font-serif text-[34px] leading-[1.1] tracking-[-0.01em] md:text-[44px]">
            Wat voor mij <span className="italic text-accent">centraal staat</span>.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {PRINCIPLES.map(({ icon: Icon, label, body }, idx) => (
            <motion.article
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="overflow-hidden rounded-[2rem] border border-rule bg-card shadow-lg"
            >
              <div className="flex h-32 items-center justify-center bg-accent/8">
                <Icon size={44} className="text-accent" strokeWidth={1.5} />
              </div>
              <div className="space-y-3 p-7 text-center">
                <h3 className="font-serif text-[24px] leading-[1.2]">{label}</h3>
                <p className="text-[16px] leading-[1.6] text-ink-muted">{body}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4.2: Update `src/pages/index.astro`**

Change the Werkwijze import + invocation:

```astro
import Werkwijze from '../components/Werkwijze.tsx';
```

```astro
<Werkwijze client:visible />
```

- [ ] **Step 4.3: Delete the old `Werkwijze.astro`**

```bash
rm src/components/Werkwijze.astro
```

- [ ] **Step 4.4: Verify in dev server**

```bash
pnpm dev
```

Open http://localhost:4321 and verify:

- Werkwijze section appears below Hero with a soft white-ish band background (`bg-card/50`).
- Centered Caveat "Drie dingen" kicker + Fraunces "Wat voor mij _centraal staat_." heading.
- Three rounded-2xl cards in a row on desktop, stacked on mobile.
- Each card top-half has a soft terracotta-tinted band with a single lucide icon centered: ear / heart-handshake / clock.
- As you scroll, the cards fade-up in sequence (0.1s stagger).
- Card content reads: Aandacht / Betrokkenheid / Continuïteit (existing copy).
- No flash-of-unstyled before the islands hydrate.

Stop server.

- [ ] **Step 4.5: Verify build**

```bash
pnpm build
```

Expected: success. `Werkwijze.tsx` hydrated as `client:visible`.

- [ ] **Step 4.6: Commit**

```bash
git add src/components/Werkwijze.tsx src/components/Werkwijze.astro src/pages/index.astro
git commit -m "feat(werkwijze): 3-card grid with lucide icons + whileInView fade-up"
```

---

## Task 5: OverMij.tsx — centered single-column prose

**Files:**
- Create: `src/components/OverMij.tsx`
- Delete: `src/components/OverMij.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 5.1: Create `src/components/OverMij.tsx`**

```tsx
import { motion } from 'framer-motion';

export default function OverMij() {
  return (
    <section
      id="over"
      className="px-6 py-20 md:px-12 md:py-24 lg:px-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center"
      >
        <span
          className="inline-block -rotate-2 text-[20px] text-accent"
          style={{ fontFamily: 'var(--font-script)' }}
        >
          Over mij
        </span>
        <h2 className="mt-3 font-serif text-[34px] leading-[1.1] tracking-[-0.01em] md:text-[44px]">
          Het vak waar mijn <span className="italic text-accent">hart ligt</span>.
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mx-auto mt-10 max-w-prose space-y-6 text-[17px] leading-[1.6] text-ink/90 md:text-[18px]"
      >
        <p>
          Tegelijk blijf ik mijzelf graag ontwikkelen, en sta ik open voor nieuwe
          uitdagingen en opdrachten binnen het werkveld.
        </p>
        <p>
          Naast mijn werk ben ik moeder, en geniet ik van het drukke, gezellige
          gezinsleven. De combinatie van werk en gezin maakt mijn dagen dynamisch
          {' '}&mdash; en waardevol.
        </p>
      </motion.div>
    </section>
  );
}
```

(The first source-spec paragraph "Al jarenlang werk ik…" lives in the hero body and is not duplicated here. Spec §10 risk 4 deferred this to first preview; this implementation picks "keep in hero only.")

- [ ] **Step 5.2: Update `src/pages/index.astro`**

```astro
import OverMij from '../components/OverMij.tsx';
```

```astro
<OverMij client:visible />
```

- [ ] **Step 5.3: Delete the old `OverMij.astro`**

```bash
rm src/components/OverMij.astro
```

- [ ] **Step 5.4: Verify in dev server**

- Section renders below Werkwijze with a Caveat "Over mij" kicker, Fraunces heading "Het vak waar mijn hart ligt." (italic + terracotta on "hart ligt"), centered.
- Below: two paragraphs of body, max-width prose, centered alignment.
- Fade-up animation when scrolled into view.

Stop server.

- [ ] **Step 5.5: Verify build**

```bash
pnpm build
```

- [ ] **Step 5.6: Commit**

```bash
git add src/components/OverMij.tsx src/components/OverMij.astro src/pages/index.astro
git commit -m "feat(over-mij): centered prose section with fade-up"
```

---

## Task 6: WatTelt.tsx — centered quote with bedroom.jpg backdrop

**Files:**
- Create: `src/components/WatTelt.tsx`
- Delete: `src/components/WatTelt.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 6.1: Create `src/components/WatTelt.tsx` (Plan A — full-bleed low-opacity backdrop)**

Like Hero, the image URL is passed as a prop computed via `getImage()` in `index.astro`.

```tsx
import { motion } from 'framer-motion';

interface Props {
  bedroomSrc: string;
}

export default function WatTelt({ bedroomSrc }: Props) {
  return (
    <section
      id="wat-telt"
      className="relative isolate overflow-hidden bg-secondary/40 px-6 py-24 md:px-12 md:py-28"
    >
      {/* Backdrop image — low opacity */}
      <img
        aria-hidden="true"
        src={bedroomSrc}
        alt=""
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.12]"
      />
      {/* Cream gradient overlay to keep contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-bg/70 via-bg/50 to-bg/70"
      />
      {/* Soft accent blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[20%] -right-[10%] -z-10 h-[300px] w-[300px] rounded-full bg-accent/10 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-3xl text-center"
      >
        <span
          className="inline-block -rotate-2 text-[20px] text-accent"
          style={{ fontFamily: 'var(--font-script)' }}
        >
          Wat telt
        </span>

        <h3 className="mt-5 font-serif text-[32px] italic leading-[1.2] tracking-[-0.005em] text-ink md:text-[48px]">
          &ldquo;Vertrouwen ontstaat in de tijd, niet in &eacute;&eacute;n gesprek.&rdquo;
        </h3>

        <p className="mx-auto mt-7 max-w-prose text-[16px] leading-[1.7] text-ink-muted md:text-[17px]">
          Daarom werk ik graag in trajecten waar continuïteit en kleine stappen
          het echte werk doen &mdash; voor jongeren, voor gezinnen, en voor de
          mensen om hen heen.
        </p>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 6.2: Update `src/pages/index.astro` to compute the bedroom AVIF and import `WatTelt.tsx`**

Replace the entire file:

```astro
---
import { getImage } from 'astro:assets';
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.tsx';
import Hero from '../components/Hero.tsx';
import OverMij from '../components/OverMij.tsx';
import Werkwijze from '../components/Werkwijze.tsx';
import WatTelt from '../components/WatTelt.tsx';
import Contact from '../components/Contact.astro';
import Footer from '../components/Footer.astro';
import toysImg from '../assets/toys.jpg';
import bedroomImg from '../assets/bedroom.jpg';

const toys = await getImage({
  src: toysImg,
  format: 'avif',
  quality: 55,
  width: 1280,
});
const bedroom = await getImage({
  src: bedroomImg,
  format: 'avif',
  quality: 60,
  width: 1280,
});
---
<Base>
  <Nav client:load />
  <Hero client:load toysSrc={toys.src} />
  <Werkwijze client:visible />
  <OverMij client:visible />
  <WatTelt client:visible bedroomSrc={bedroom.src} />
  <Contact />
  <Footer />
</Base>
```

(This consolidates all Tasks 2–6's incremental edits to `index.astro` into the final shape. The intermediate edits in Tasks 2/3/4/5 were partial; this is the file's end-state once Task 6 ships.)

- [ ] **Step 6.3: Delete the old `WatTelt.astro`**

```bash
rm src/components/WatTelt.astro
```

- [ ] **Step 6.4: Verify in dev server + check WCAG AA contrast**

```bash
pnpm dev
```

Open http://localhost:4321 and verify:

- Section has soft warm background (`bg-secondary/40` over `bedroom.jpg` at 12% opacity).
- Caveat "Wat telt" kicker, then big italic Fraunces quote centered.
- Supporting body paragraph below.
- Fade-up on scroll.

**Contrast check (Plan A acceptance criterion):**
1. In Chrome devtools, open the Lighthouse panel and run an Accessibility audit on the page. Look at the Wat-telt section.
2. Or in devtools Elements, inspect the `<h3>` of the quote. Click the colour swatch in Styles. Devtools shows a contrast ratio. Target: ≥ 4.5:1 (WCAG AA for normal text) or ≥ 3:1 (large text — the quote at 32–48px qualifies).

If the contrast is **below 3:1**, fall back to Plan B (Step 6.5). If it's **≥ 3:1**, skip Step 6.5 and continue to 6.6.

- [ ] **Step 6.5: (Conditional — Plan B fallback) Replace backdrop with inset rounded photo**

Skip this step if Plan A passed contrast. Otherwise, replace the body of `WatTelt.tsx` with:

```tsx
import { motion } from 'framer-motion';

interface Props {
  bedroomSrc: string;
}

export default function WatTelt({ bedroomSrc }: Props) {
  return (
    <section
      id="wat-telt"
      className="relative overflow-hidden bg-secondary/40 px-6 py-20 md:px-12 md:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[20%] -right-[10%] -z-10 h-[300px] w-[300px] rounded-full bg-accent/10 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7 }}
        className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16"
      >
        <div className="text-center md:text-left">
          <span
            className="inline-block -rotate-2 text-[20px] text-accent"
            style={{ fontFamily: 'var(--font-script)' }}
          >
            Wat telt
          </span>
          <h3 className="mt-5 font-serif text-[28px] italic leading-[1.2] tracking-[-0.005em] text-ink md:text-[40px]">
            &ldquo;Vertrouwen ontstaat in de tijd, niet in &eacute;&eacute;n gesprek.&rdquo;
          </h3>
          <p className="mt-6 max-w-prose text-[16px] leading-[1.7] text-ink-muted md:text-[17px]">
            Daarom werk ik graag in trajecten waar continuïteit en kleine stappen
            het echte werk doen &mdash; voor jongeren, voor gezinnen, en voor de
            mensen om hen heen.
          </p>
        </div>

        <img
          src={bedroomSrc}
          alt=""
          loading="lazy"
          decoding="async"
          className="aspect-[4/5] w-full max-w-md rounded-[2rem] object-cover shadow-xl md:max-w-none"
        />
      </motion.div>
    </section>
  );
}
```

Re-run Step 6.4 visual check (the contrast question is moot — text now sits on plain background).

- [ ] **Step 6.6: Verify build**

```bash
pnpm build
```

- [ ] **Step 6.7: Commit**

```bash
git add src/components/WatTelt.tsx src/components/WatTelt.astro src/pages/index.astro
git commit -m "feat(wat-telt): centered quote with bedroom.jpg backdrop"
```

---

## Task 7: Contact.astro — Caveat kicker + Zen padding

**Files:**
- Modify: `src/components/Contact.astro`

- [ ] **Step 7.1: Replace the entire `Contact.astro`**

```astro
---
---
<section
  id="contact"
  class="px-6 py-24 md:px-12 md:py-28 lg:px-24 border-t border-rule"
>
  <div class="mx-auto max-w-3xl text-center space-y-8">
    <span
      class="inline-block -rotate-2 text-[20px] text-accent"
      style="font-family: var(--font-script);"
    >
      Contact
    </span>

    <h2 class="font-serif text-[28px] leading-[1.25] tracking-[-0.005em] text-ink-muted max-w-[24ch] mx-auto md:text-[36px]">
      Wilt u meer informatie of in contact komen?
    </h2>

    <a
      href="mailto:info@amicare-zorg.nl"
      class="inline-block font-serif text-[28px] text-ink underline decoration-1 underline-offset-[8px] hover:decoration-accent hover:text-accent transition-colors md:text-[44px]"
    >
      info@amicare-zorg.nl
    </a>
  </div>
</section>
```

Diff vs. existing file: replaced the small uppercase Inter "CONTACT" label with a Caveat-script kicker, increased section padding from `py-14 md:py-20` to `py-24 md:py-28` (Zen rhythm), bumped the email link size from `28px md:40px` to `28px md:44px`. Heading copy unchanged.

- [ ] **Step 7.2: Verify in dev server**

```bash
pnpm dev
```

- Section reads: Caveat "Contact" kicker, big Fraunces heading, oversized underlined email link.
- Padding feels generous (matches Werkwijze and OverMij rhythm).
- Hover the email link — underline turns terracotta.
- No layout regressions.

Stop server.

- [ ] **Step 7.3: Verify build**

```bash
pnpm build
```

- [ ] **Step 7.4: Commit**

```bash
git add src/components/Contact.astro
git commit -m "feat(contact): Caveat kicker + Zen padding rhythm"
```

---

## Task 8: Footer.astro — 3-column with brand / KVK / address

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 8.1: Replace the entire `Footer.astro`**

```astro
---
const year = new Date().getFullYear();
---
<footer
  class="relative border-t border-rule bg-gradient-to-br from-secondary/20 via-bg to-accent/5 px-6 py-16 md:px-12 lg:px-24"
>
  <div class="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 lg:gap-12">
    <!-- Left: brand -->
    <div class="space-y-3">
      <div class="flex items-center gap-2.5">
        <span aria-hidden="true" class="inline-block w-2 h-2 rounded-full bg-accent"></span>
        <span class="font-sans font-medium tracking-[0.18em] uppercase text-[14px] text-ink">
          AMICARE-ZORG
        </span>
      </div>
      <p class="font-serif italic text-[14px] leading-[1.5] text-ink-muted max-w-[28ch]">
        Jeugdzorg met hart en toewijding.
      </p>
    </div>

    <!-- Center: bedrijfsgegevens -->
    <div class="space-y-3">
      <p class="text-[11px] tracking-[0.18em] uppercase text-accent font-medium">
        Bedrijfsgegevens
      </p>
      <div class="space-y-1.5 text-[13px] leading-[1.6] text-ink-muted">
        <p>Handelsnaam: <span class="text-ink">AMICARE ZORG</span></p>
        <p>KVK <span class="text-ink">99968347</span></p>
        <p>Vestigingsnr. <span class="text-ink">000065004922</span></p>
      </div>
    </div>

    <!-- Right: contact + adres -->
    <div class="space-y-3">
      <p class="text-[11px] tracking-[0.18em] uppercase text-accent font-medium">
        Contact
      </p>
      <div class="space-y-1.5 text-[13px] leading-[1.6] text-ink-muted">
        <p>Spinsterstraat 17</p>
        <p>6043 RJ Roermond</p>
        <p class="pt-1.5">
          <a
            href="mailto:info@amicare-zorg.nl"
            class="text-ink hover:text-accent transition-colors"
          >
            info@amicare-zorg.nl
          </a>
        </p>
      </div>
    </div>
  </div>

  <div class="border-t border-rule my-8 max-w-7xl mx-auto"></div>

  <p class="mx-auto max-w-7xl text-center md:text-left text-[12px] tracking-[0.04em] text-ink-muted/70">
    &copy; {year} Amicare-Zorg
  </p>
</footer>
```

Diff vs. existing file: was a single-line center-aligned footer; now a 3-column grid with a soft gradient backdrop, a divider, and a copyright row. All KVK info moved into Column 2; address moved into Column 3.

- [ ] **Step 8.2: Verify in dev server**

```bash
pnpm dev
```

- Footer has soft gradient backdrop (warmest in the bottom-right corner).
- Three columns visible on `md+`: brand (with the small terracotta dot) / bedrijfsgegevens (Handelsnaam, KVK, Vestigingsnr) / contact (address + email).
- Each centre/right column has a small terracotta uppercase tracking-wide kicker label.
- Below a thin divider: a left-aligned `© <year> Amicare-Zorg` line.
- Resize to 320px — columns stack vertically, copyright row is centered.

Stop server.

- [ ] **Step 8.3: Verify build**

```bash
pnpm build
```

- [ ] **Step 8.4: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat(footer): 3-column grid with brand / KVK / address"
```

---

## Task 9: Final ship-readiness — Lighthouse, viewports, smoke

**Files:**
- May modify: any component if a regression is found
- May add: nothing

- [ ] **Step 9.1: Build and inspect output**

```bash
pnpm build
```

Read the build report. Confirm:
- Two `client:load` islands hydrated: `Nav.tsx`, `Hero.tsx`.
- Three `client:visible` islands hydrated: `Werkwijze.tsx`, `OverMij.tsx`, `WatTelt.tsx`.
- No CSS warnings from Tailwind.
- No type errors.

Inspect `dist/`:

```bash
ls -lh dist/_astro/ | head -20
du -sh dist/
```

Expected: `dist/` total under 1.5 MB (mostly the two AVIF images). Initial JS bundles in `_astro/` should sum to roughly 100–140 KB gzipped — measure:

```bash
find dist/_astro -name '*.js' -exec gzip -c {} \; | wc -c
```

If the gzipped JS sum exceeds 200 KB, run:

```bash
find dist/_astro -name '*.js' -exec sh -c 'echo "$(gzip -c "$1" | wc -c) $1"' _ {} \; | sort -n
```

…to identify the largest chunks. Common culprits: `framer-motion` not tree-shaking when both `motion` and `AnimatePresence` are imported; `lucide-react` if many icons are imported. Confirmed icons used: `Menu`, `X` (Nav), `MapPin` (Hero), `Ear`, `HeartHandshake`, `Clock` (Werkwijze) — six total. Anything else is a leak.

- [ ] **Step 9.2: Preview the production build locally**

```bash
pnpm preview
```

Open http://localhost:4321 and verify the production bundle behaves identically to dev:
- All five tracked sections render.
- Nav active-indicator follows scroll.
- Mobile hamburger works at 320 / 375 / 414 px.
- Floating cards bounce.
- whileInView fade-ups trigger.
- All anchor links scroll smoothly with the sticky-nav offset.

Stop with Ctrl-C.

- [ ] **Step 9.3: Lighthouse mobile**

Start `pnpm preview` again, then in another terminal:

```bash
npx -y lighthouse http://localhost:4321 \
  --preset=desktop --only-categories=performance,accessibility,best-practices,seo \
  --view=false --output=json --output-path=./lighthouse-desktop.json --quiet
npx -y lighthouse http://localhost:4321 \
  --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo \
  --view=false --output=json --output-path=./lighthouse-mobile.json --quiet
```

Then read the scores:

```bash
node -e "const r=require('./lighthouse-mobile.json');for(const[k,v]of Object.entries(r.categories))console.log(k.padEnd(18),Math.round(v.score*100));"
node -e "const r=require('./lighthouse-desktop.json');for(const[k,v]of Object.entries(r.categories))console.log(k.padEnd(18),Math.round(v.score*100));"
```

Expected (mobile, per spec §9):
- performance ≥ 90
- accessibility ≥ 95
- seo ≥ 95
- best-practices ≥ 95

If any score is below threshold, open the JSON in `--view=true` mode (omit `--view=false`) and address the failing audits. Common items:
- Missing `alt` on images → ensure all `<img>` have `alt=""` for decorative or descriptive `alt` for content.
- LCP > 2.5s → confirm `toys.jpg` has `loading="eager"` and `fetchPriority="high"`.
- Layout shift → confirm floating cards are absolutely positioned and not in normal flow.

Delete the report files after:

```bash
rm lighthouse-mobile.json lighthouse-desktop.json
```

Stop preview server.

- [ ] **Step 9.4: Cross-viewport visual sweep**

Run `pnpm preview`. In Chrome devtools, toggle device toolbar and step through:

| Viewport | Check |
|---|---|
| 320 px (iPhone SE) | Hero stacks; floating cards still visible inside image; nav menu opens with all 4 links + Contact pill; no horizontal scroll. |
| 375 px (iPhone 14) | Same. |
| 768 px (iPad) | Hero still single-column (md breakpoint is 768px in Tailwind) just barely transitioning; werkwijze grid is 3 cards across. |
| 1024 px (iPad Pro) | Full Zen layout; nav links all visible. |
| 1440 px (desktop) | Hero comfortable, blobs not clipping ugly. |

Fix any regressions inline by editing the relevant component. Re-run `pnpm build` and `pnpm preview` after edits.

Stop preview.

- [ ] **Step 9.5: Docker smoke test**

```bash
docker build -t amicare-zorg-restyle:smoke .
docker run --rm -p 8080:80 amicare-zorg-restyle:smoke
```

Open http://localhost:8080 — verify the production image serves the page identically. Stop container with Ctrl-C.

```bash
docker rmi amicare-zorg-restyle:smoke
```

- [ ] **Step 9.6: Final cleanup commit**

If any fixes were made in Steps 9.4 / 9.5, commit them:

```bash
git status
git add <changed files>
git commit -m "fix(restyle): address <specific issue>"
```

If nothing changed in this task, skip.

- [ ] **Step 9.7: Confirm no orphaned files**

```bash
ls src/components/
```

Expected: `Contact.astro  Footer.astro  Hero.tsx  Nav.tsx  OverMij.tsx  Werkwijze.tsx  WatTelt.tsx` (7 entries). No `*.astro` for components that became React islands.

If any `Nav.astro / Hero.astro / Werkwijze.astro / OverMij.astro / WatTelt.astro` survived, delete and commit:

```bash
rm src/components/<file>.astro
git add -A
git commit -m "chore: remove leftover .astro stub"
```

- [ ] **Step 9.8: Push the feature branch**

```bash
git log --oneline main..feat/zen-restyle
git push -u origin feat/zen-restyle
```

The user opens the PR manually (don't `gh pr create` automatically — they may want to review the branch first).

---

## Self-review checklist (run before reporting "plan complete")

1. **Spec coverage** — the 7 sections in spec §6 each have a task (Tasks 2–8). Spec §3's 10 locked decisions are all reflected: A/V2 (Tasks 2–8 use Amicare palette/type), structural twin (all sections present), repurposed Community→OverMij (Task 5), collapsed CTA (Task 7), 3-col footer (Task 8), Caveat (Task 1), per-section islands (each component task), restrained animation (no `whileHover scale`), terracotta-only blobs (Hero+WatTelt), squiggle once (Hero only).

2. **Placeholder scan** — search for `TBD`, `TODO`, `<...>`, `// implement`, "fill in":
   - Step 9.5 has `<changed files>` as a placeholder for a `git add` argument. That's intentional — it depends on what (if anything) was modified. Leaving it as guidance is correct.
   - No other placeholders.

3. **Type consistency** — function and prop names: `Nav`, `Hero`, `Werkwijze`, `OverMij`, `WatTelt` are referenced consistently across tasks (`import X from '../components/X.tsx'`). Lucide icons used: `Menu, X, MapPin, Ear, HeartHandshake, Clock` — six total, matches §9.1's expected count. `--font-script` token defined in Task 1 and used in all kicker spans (Tasks 2, 3, 4, 5, 6, 7).

4. **Verification adapted to medium** — no test framework exists; verification is build-passes + visual + Lighthouse. Each task includes a visual checklist + `pnpm build`. The conditional Plan A/B branch in Task 6 has a measurable acceptance criterion (contrast ≥ 3:1 for large text).
