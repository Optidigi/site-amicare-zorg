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

Push to `main`. GitHub Actions (`.github/workflows/build.yml`) builds
the Docker image and pushes it to
`ghcr.io/optidigi/site-amicare-zorg:latest`.

On the VPS (`/srv/prod/infra/stacks/ami-care/`):

```bash
docker compose pull
docker compose up -d
```

Public traffic is routed by Nginx Proxy Manager. NPM and this container
share an external docker network (configured via `PROXY_NETWORK` in
`.env`).

## Design

See [`docs/superpowers/specs/2026-05-01-amicare-zorg-design.md`](docs/superpowers/specs/2026-05-01-amicare-zorg-design.md)
for the design spec and content. See `docs/superpowers/plans/` for the
implementation plan.
