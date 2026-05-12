// src/middleware.ts
import { defineMiddleware } from "astro:middleware"

const ADMIN_ORIGIN = process.env.PUBLIC_ADMIN_ORIGIN ?? "https://admin.siteinabox.nl"

export const onRequest = defineMiddleware(async (ctx, next) => {
  // Astro 6 excludes any file in src/pages/ whose name starts with `_`
  // (rule lives in astro/dist/core/routing/create-manifest.js — checked
  // `name[0] === "_"`, no config escape hatch). That means
  // `src/pages/__preview.astro` is unbuildable; the on-disk filename
  // must be `preview.astro`. Payload's PreviewPane hard-codes the URL
  // `${tenantOrigin}/__preview?t=…`, so we internally rewrite incoming
  // /__preview requests onto the /preview handler with the query string
  // preserved. The browser-visible URL stays /__preview.
  if (ctx.url.pathname === "/__preview") {
    const target = new URL("/preview", ctx.url)
    target.search = ctx.url.search
    return ctx.rewrite(target)
  }

  const res = await next()

  // Common security headers (matches the prior nginx.conf baseline).
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  res.headers.set(
    "Permissions-Policy",
    "interest-cohort=(), camera=(), microphone=(), geolocation=(), payment=()",
  )
  res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

  const isPreview =
    ctx.url.pathname === "/preview" || ctx.url.pathname.startsWith("/preview/")

  if (isPreview) {
    // Allow framing by the admin origin only.
    res.headers.delete("X-Frame-Options")
    res.headers.set(
      "Content-Security-Policy",
      // Note: 'unsafe-inline' kept narrow; preview hydration uses no
      // dynamic eval. frame-ancestors permits ONLY admin origin.
      `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' ${ADMIN_ORIGIN}; frame-ancestors ${ADMIN_ORIGIN}`,
    )
    res.headers.set("Access-Control-Allow-Origin", ADMIN_ORIGIN)
    res.headers.set("Vary", "Origin")
  } else {
    // Strict defaults for non-preview routes — ported from the prior
    // nginx.conf baseline. 'unsafe-inline' on script-src is required so
    // Astro's island runtime + hydrator inline scripts execute (and so
    // framer-motion components don't stay invisible at initial opacity).
    res.headers.set("X-Frame-Options", "SAMEORIGIN")
    res.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'",
    )
  }

  return res
})
