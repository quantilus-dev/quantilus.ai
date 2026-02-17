# SEO Audit Summary and To-Do

## Overall Rating
- Current SEO rating (codebase-only): **6.8/10**

## Summary
- The project has strong SEO fundamentals: crawlable static pages, `robots.txt`, `sitemap.xml`, canonical URLs, page-level meta descriptions, Open Graph/Twitter tags, and JSON-LD.
- The biggest gaps are missing referenced image assets (OG images, favicon, manifest icons), non-crawlable blog article links (`href="#"`), and schema that references a search URL not implemented in this project.
- Metadata quality is generally good, but several titles/descriptions are longer than ideal and may truncate in search results.

## Priority To-Do (High Impact First)

### 1) Fix missing SEO assets
- Add actual files for all referenced images/icons:
  - `images/favicon.ico`
  - `images/og-home.jpg`, `images/og-about.jpg`, `images/og-services.jpg`, `images/og-industries.jpg`, `images/og-work.jpg`, `images/og-staffing.jpg`, `images/og-blog.jpg`, `images/og-contact.jpg`
  - `images/icon-192.png`, `images/icon-512.png`
- Verify these URLs return `200` in production.

### 2) Make blog articles crawlable
- Replace placeholder links in `blog.html` (`href="#"`) with real article URLs.
- Create individual article pages (or a blog route) with unique:
  - `<title>`
  - `<meta name="description">`
  - canonical URL
  - OG/Twitter tags
  - `Article` JSON-LD
- Add those article URLs to `sitemap.xml`.

### 3) Correct structured data mismatch
- In `index.html`, remove or update `WebSite` `SearchAction` if `/search` does not exist.
- Keep schema aligned with real site functionality.

### 4) Tighten title and meta description lengths
- Aim for:
  - Title: ~50-60 chars
  - Meta description: ~140-160 chars
- Review pages most likely to truncate first:
  - `index.html`
  - `staffing.html`
  - `services.html`
  - `work.html`

### 5) Keep sitemap freshness accurate
- Update `sitemap.xml` `lastmod` values when content changes.
- Avoid static stale dates across all URLs.

## Secondary Improvements
- Add `BlogPosting`/`Article` schema to each real blog post page.
- Add `BreadcrumbList` schema on deeper pages where relevant.
- Ensure internal links use descriptive anchor text, especially for service/work conversion pages.
- Run a Lighthouse SEO + Performance pass on production and fix any failing audits.

## Quick Verification Checklist
- [ ] All referenced image/icon URLs exist and load.
- [ ] No `href="#"` links for primary content.
- [ ] No schema points to non-existent pages/features.
- [ ] Titles/descriptions are unique and within target lengths.
- [ ] Sitemap includes all indexable pages and accurate `lastmod`.
- [ ] Social previews (OG/Twitter) render correctly when tested.