# site-amicare-zorg

One-pager for Amicare-Zorg. Static site, deployed to https://ami-care.nl
via Coolify (Docker, Traefik) on the Optidigi VPS.

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # → dist/
pnpm preview      # serves dist/ for sanity check
pnpm og           # regenerate public/og.png
```

## Deploy

Push to `main`. Coolify pulls, builds the Docker image (`Dockerfile`),
and runs the container behind Traefik using `compose.yml`.

## Design

See [`docs/superpowers/specs/2026-05-01-amicare-zorg-design.md`](docs/superpowers/specs/2026-05-01-amicare-zorg-design.md)
for the design spec and content. See `docs/superpowers/plans/` for the
implementation plan.
