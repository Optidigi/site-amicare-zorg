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

## CMS-backed mode

This repo is shaped for the `optidigi/siab-payload-orchestrator` `/add-cms` workflow.
Editorial content (page copy, brand info) lives in `src/content/` pre-conversion, and in
the Payload tenant volume (`/data/`) post-conversion.

### One-time post-`/add-cms` restructure step

The orchestrator's payload-seeder seeds every markdown H2 section as a single
`richText` block. The site's CMS renderers, however, light up the full Zen visual
treatment only when blocks are structured (Hero, FeatureList, RichText, CTA).

After `/add-cms` completes Phase 4 (and optionally before Phase 5/6 — order doesn't
matter), the operator runs:

```bash
cd ./site-amicare-zorg
bash scripts/restructure-cms.sh <TENANT_ID>
```

This PATCHes the home page on Payload to replace the 5 seeded richText blocks
with 1×Hero + 1×FeatureList + 1×RichText + 1×CTA(quote) + 1×CTA(contact),
matching the section structure the renderers expect.

The Payload `afterChange` hook writes the updated JSON to
`/srv/data/saas/siab-payload/tenants/<TENANT_ID>/pages/index.json` on the VPS;
the next request to the SSR site renders with full Zen design.

Editor changes in Payload admin after this point flow through normally
(JSON re-projected on save, next request reads fresh).

### Runtime details (post-conversion)

This site reads editorial content from a per-tenant Payload CMS data directory mounted into the container at `/data`. Editor changes are visible on the next request — there is no rebuild on content edits.

**Required runtime env:**

- `CMS_DATA_DIR` — defaults to `/data`. Where the per-tenant data is mounted.
- `SITE_URL` — public site URL (e.g. `https://ami-care.nl`).

**Required volume:**

- Mount the per-tenant data dir at `/data:ro`. See `docker-compose.cms.yml.example`.

**Editor:**

The Payload tenant has an editor user; the operator manages account access.

**Failure modes:**

If `/data` is not mounted, or any page JSON is missing/malformed, the site renders with empty editorial fields. Pages always return 200; `/healthz` returns 200 unconditionally for container healthchecks.
