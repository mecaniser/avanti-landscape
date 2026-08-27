# Full SEO Audit — Avanti Landscaping

- **Audited:** 2026-08-19
- **Site:** https://www.avantilandscapingnc.com/
- **Business type:** Local service-area business — landscaping, lawn care, hardscaping, and property maintenance
- **Scope:** 16 sitemap URLs plus robots, sitemap, redirects, public local signals, mobile/desktop rendering, and basic Common Crawl backlink discovery
- **Overall SEO Health Score:** **62/100 — needs focused improvement**

## Executive summary

Avanti has a sound crawlable foundation: every sitemap URL returned `200`, all reviewed pages are server-rendered, canonicalized, and indexable, and the site has useful `LandscapingBusiness`, `Service`, `BlogPosting`, and breadcrumb schema. The homepage is visually strong, mobile-responsive, and gives visitors clear quote, call, and text actions.

The site is not suffering from an indexing emergency. The largest losses are downstream of crawlability: poor mobile LCP, two blog URLs whose slugs no longer match their content, thin commercial pages, weak contextual linking, overlong search snippets, and limited external/entity proof. The brand also competes with unrelated Canadian businesses named “Avanti Landscaping,” increasing the importance of consistently reinforcing “Avanti Landscaping LLC — Waxhaw, NC.”

The automated baseline scored the site `61/100` but incorrectly classified it as a publisher and marked non-blocking recommendations as Critical. This report corrects the business type and applies the skill’s stated severity rules. **No Critical issue was confirmed.**

### Post-audit status — August 26, 2026

- A Places API check verified the correct Avanti Landscaping LLC profile at 5.0 from 49 reviews.
- [PR #26](https://github.com/mecaniser/avanti-landscape/pull/26) contains the isolated Google Reviews homepage integration plus Privacy/Terms support. It is pending merge, deployment, and live verification; this report does not treat it as production-complete.
- `GEO-ANALYSIS.md` was reconciled to official OpenAI and Google crawler guidance. GPTBot and OAI-SearchBot are separate controls, and Google-Extended does not control Google Search inclusion or ranking.
- The 62/100 audit baseline remains unchanged until the live site is recrawled and rescored with the same methodology.

## Scorecard

| Category | Weight | Score | Weighted contribution | Verdict |
|---|---:|---:|---:|---|
| Technical SEO | 22% | 76 | 16.72 | Healthy crawl/index foundation; freshness and policy cleanup needed |
| Content quality | 23% | 46 | 10.58 | Commercial pages lack decision-useful depth and proof |
| On-page SEO | 20% | 55 | 11.00 | Clean H1/canonical basics; titles, snippets, slugs, and linking need work |
| Schema / structured data | 10% | 78 | 7.80 | Valid useful coverage; entity relationships can be strengthened |
| Performance / CWV | 10% | 75 | 7.50 | Desktop strong; mobile LCP poor in lab evidence |
| AI search readiness | 10% | 49 | 4.90 | Crawl paths exist, but citability and authority are weak |
| Images | 5% | 72 | 3.60 | Strong markup and alt coverage; several oversized candidates |
| **Overall** | **100%** |  | **62.10 → 62** | **Needs focused improvement** |

Backlink health is **not scored** because only basic Common Crawl discovery was available and the domain was not observed in the selected release. That does not prove the site has zero backlinks.

## Top five High-priority issues

1. **Mobile LCP measured 5.33 seconds.** A real Chrome Lighthouse mobile run scored 75, with the homepage hero as the LCP element. About 75% of its LCP time was render delay. Desktop scored 96 with a 1.36-second LCP, so the problem is mobile-specific.
2. **Two blog URLs serve unrelated replacement topics.** `/blog/spring-vs-fall-cleanup` now serves “Rock vs. Mulch,” and `/blog/core-aeration` now serves “Sod vs. Seed.” Their titles, H1s, schema, and canonicals describe the new articles, but the stale slugs send contradictory relevance signals.
3. **Commercial pages are materially underdeveloped.** Main-content counts were roughly 180–214 words on the four service pages and about 78 words on `/areas`. They list offerings but provide little process, suitability, local-climate knowledge, project evidence, timelines, or objection handling.
4. **Local trust and entity proof are weak.** A public Google Maps profile resolves with a matching site and phone and shows a 5.0 rating, but review count/recency and owner-response behavior were not visible in the limited public view. The site does not visibly feature permissioned reviews, named credentials, or detailed case studies. Search results also contain many unrelated Canadian “Avanti Landscaping” entities.
5. **Search snippets are broadly overlong.** Fourteen of 16 unique page titles exceed the audit guideline of 60 characters, and nine meta descriptions exceed 160 characters. A search result for the contact page also still displayed an old incorrect number, `(980) 338-7141`, even though live HTML and schema correctly show `(980) 328-7141`.

## Top five quick wins

1. Rename the two mismatched blog URLs and add one-hop permanent redirects; update internal links, sitemap, canonicals, breadcrumbs, and schema IDs.
2. Rewrite the 14 overlong titles and nine overlong descriptions without removing the primary service and Waxhaw intent.
3. Add contextual links from every blog post to the relevant service page and two or three related articles; replace “Read More” with descriptive article-title anchors.
4. Request re-indexing for `/contact` after confirming the correct phone in Search Console and the Google Business Profile.
5. Increase the `TEXT US` and Lawn Care route controls to at least 44px high on mobile.

## Crawlability and indexability

### What is working

- `robots.txt` and `sitemap.xml` return `200`.
- All 16 unique sitemap URLs return `200`; no sitemap URL redirects or carries a detected `noindex`.
- Every reviewed page has a self-referencing canonical and one semantic H1.
- Core titles, text, links, and JSON-LD are present in initial server-rendered HTML.
- HTTP and apex-domain requests normalize to the HTTPS `www` host.
- A nonexistent test URL returned a proper `404`.
- Googlebot is allowed. `/admin` and `/api` are intentionally disallowed.

### Issues

**Medium — sitemap `lastmod` is not trustworthy.** Eleven core URLs receive the request timestamp as `lastmod`. Re-fetching the sitemap changed those timestamps even though the pages had not been edited. Search engines may ignore the signal. Emit real content/deploy modification timestamps instead. `priority` and `changefreq` can be removed because Google ignores them.

**Medium — page responses disable caching.** The homepage returned `cache-control: private, no-cache, no-store, max-age=0, must-revalidate`. This may contribute to repeat-render cost and should be reviewed against the site’s data-freshness requirements.

**Low — no CSP header.** HSTS, `X-Content-Type-Options`, `X-Frame-Options`, Referrer Policy, and Permissions Policy are present. A tested Content Security Policy is a security hardening improvement, not a direct ranking fix.

**Low — IndexNow is absent.** This is optional and primarily useful for Bing; it is not relevant to Google discovery.

## Performance and Core Web Vitals

| Test | Performance | LCP | FCP | CLS | TBT | Notes |
|---|---:|---:|---:|---:|---:|---|
| Mobile lab | 75 | **5.33s** | 2.28s | 0 | 43ms | LCP fails the 2.5s “Good” threshold |
| Desktop lab | 96 | 1.36s | 0.50s | 0 | 0ms | Strong desktop result |

The LCP element is the homepage hero image. The run transferred about 923KB across 29 requests. Diagnostics estimated avoidable image bytes on two before/after images and the hero, plus about 98.8KB of unused JavaScript. Server response was fast enough that origin latency is not the primary bottleneck.

Recommended order:

1. Profile the hero’s element render delay on a throttled mobile trace.
2. Verify the hero is not waiting on entrance animation state, competing image preloads, or late CSS/font work.
3. Cap actual requested image widths to rendered dimensions; avoid requesting 3840px variants for card/gallery contexts.
4. Re-run three mobile Lighthouse samples and use the median.
5. Validate with CrUX/Search Console field data when credentials are available. Lighthouse does not provide ranking-grade field INP, so heuristic INP values were excluded.

## Content quality and E-E-A-T

### Strengths

- Strong local relevance to Waxhaw and nearby service areas.
- Original-looking project photography and a useful before/after presentation.
- Local grass and climate references.
- Visible phone, email, hours, social profiles, owner-involved messaging, and clear service descriptions.
- Two current long-form posts approach or exceed 1,500 words.

### Gaps

| Page | Approx. main-content words | Main gap |
|---|---:|---|
| Homepage | 302 | Thin proof and expertise for broad service scope |
| `/services` | 390 | Primarily navigation/listing copy |
| `/services/lawn-care` | 212 | Little process, timing, suitability, or proof |
| `/services/landscaping` | 198 | Little process, materials, local detail, or proof |
| `/services/hardscaping` | 180 | Insufficient detail for a high-consideration purchase |
| `/services/maintenance` | 214 | Thin scope, schedule, and expectation setting |
| `/areas` | 78 | Too thin to establish location expertise |
| `/about` | 178 | Limited named expertise and credentials |

Word-count floors are diagnostic—not ranking factors—but these pages do not yet answer the decisions a local homeowner makes before requesting a quote. Add truthful process, scope, constraints, local soil/climate guidance, service boundaries, project examples, and FAQs. Do not pad pages with generic prose.

E-E-A-T estimate: Experience 14/20, Expertise 9/25, Authority 6/25, Trust 18/30. The site would benefit from a named owner/expert profile, verifiable years of experience, licenses/certifications only when actually held, visible updated dates, and authoritative citations for horticultural claims (for example, NC State Extension).

## On-page SEO and information architecture

### Confirmed positives

- All reviewed pages have a single H1 and self-canonical.
- No substantive body-copy duplicate exceeded the audit similarity threshold.
- Navigation reaches every sitemap page.
- Primary service pages use relevant local-intent headings.

### High-priority URL mismatch

| Existing URL | Current content | Required handling |
|---|---|---|
| `/blog/spring-vs-fall-cleanup` | Rock vs. Mulch | Publish on a descriptive slug; 301 old URL; update every reference |
| `/blog/core-aeration` | Sod vs. Seed | Publish on a descriptive slug; 301 old URL; update every reference |

Do not merely change the slugs without redirects. Preserve accumulated signals with one-hop permanent redirects and verify old URL → new URL → `200`, with the new URL self-canonical.

### Internal linking

Each blog post has only three main-content links: Home, Blog, and Contact. None contextually links to a relevant service page or peer article. Build four clusters:

- Waxhaw Lawn Care Guide: tall fescue calendar, aeration/overseeding, sod vs. seed, brown patch, weeds, clay soil/drainage.
- Landscaping and Outdoor Improvements: low-maintenance ideas, rock vs. mulch, plant selection, drainage/grading, lighting.
- Hardscaping in Waxhaw: paver patios, retaining walls, fire pits, materials, maintenance.
- Property Maintenance: full-service maintenance, spring/fall cleanup, leaf removal, mowing frequency.

Each article should link to its service page, pillar, and two or three closely related posts. Service pages should reciprocate with their best supporting articles.

## Schema and structured data

All JSON-LD blocks parsed successfully.

| Type | Coverage |
|---|---|
| `LandscapingBusiness` | All reviewed pages |
| `BreadcrumbList` | All reviewed non-home pages |
| `Service` | All four service-detail pages |
| `BlogPosting` | All five posts |

Strengths include absolute URLs, valid active types, connected provider `@id` references, and complete BlogPosting dates/images/main-entity fields. No deprecated HowTo schema was found.

Recommended improvements:

- Add a truthful owner `Person`/profile entity and connect it to the business and reviewed content.
- Add `ContactPage`, `ImageGallery`/`ImageObject`, `Blog`/`CollectionPage`, and relevant page-level types where they add clarity.
- Add GBP and matching Nextdoor URLs to `sameAs` only after confirming the exact profiles.
- Add truthful `priceRange` and offer-catalog detail where appropriate.
- Do not expose or fabricate a private street address for this service-area business solely to satisfy a schema recommendation.
- Do not prioritize FAQPage markup for Google rich results: commercial sites are generally not eligible. Useful FAQ content can still help users and AI extraction without promising a rich result.

## Images

Across reviewed HTML, all 80 image occurrences had an `alt` attribute. The only empty alt was appropriate for a decorative hero. Images expose responsive `srcset`/`sizes`, most below-fold assets are lazy-loaded, and compatible browser requests negotiate AVIF.

The largest 3840-width gallery candidates were roughly 416–553KB, and ten candidates exceeded 200KB. Many Next.js `fill` images lack literal width/height attributes, but aspect-ratio containers can still prevent CLS; this should not be treated as an automatic failure. Actual rendered screenshots showed no horizontal overflow, and the measured Lighthouse run had CLS `0`.

Actions:

- Cap maximum requested widths to actual display sizes.
- Review the ten largest gallery candidates and hero compression.
- Improve generic alts such as “Sod install” when more specific, truthful context is available.
- Prefer descriptive Cloudinary public IDs/filenames when assets are next reprocessed.

## Local SEO

**Local SEO score: 61/100.**

Public evidence indicates a Google Maps profile for “Avanti Landscaping LLC” with a matching website and `(980) 328-7141`, category “Landscaper,” and a visible 5.0 rating. The limited public view did not expose review count, review recency, replies, secondary categories, posts, or Insights. A matching Nextdoor listing uses the correct phone and shows 18 Faves. No matching Waxhaw Yelp or BBB result was verified.

The current live site consistently uses `(980) 328-7141`, but a search result for `/contact` still showed the old `(980) 338-7141`. Treat this as index/snippet drift and confirm the old number does not remain in GBP, Search Console indexed HTML, directory listings, or cached content.

Priorities:

1. Confirm the exact GBP profile and all profile fields in the managed account.
2. Request a recrawl of `/contact`; inspect the rendered/indexed version in Search Console.
3. Reinforce the full entity name and location consistently: “Avanti Landscaping LLC — Waxhaw, NC.”
4. Publish real permissioned customer proof with source links, dates, project/service context, and no invented aggregate rating.
5. Deepen Waxhaw-specific proof before creating many city pages. Avoid thin city-swap doorway pages.

## AI search / GEO readiness

`robots.txt` allows ordinary search crawling and explicitly blocks several AI agents, including GPTBot, ClaudeBot, CCBot, and Google-Extended. OAI-SearchBot, ChatGPT-User, and PerplexityBot are not specifically blocked and inherit wildcard access. Blocking GPTBot is not the same as blocking OpenAI’s search crawler; crawler access should be treated as an explicit licensing/business decision, not blindly changed.

`/llms.txt` returns `404`. This is a low-cost optional addition, but it is not a substitute for crawl access, strong content, or external authority, and major search engines do not guarantee ranking benefit.

The main GEO gaps are low authority/entity clarity, limited source-backed local answers, thin service/location pages, no dated case-study narratives, and little visible review proof. The unrelated Canadian businesses with the same brand name materially increase entity-resolution risk.

## Visual and search experience

**Visual score: 86/100. SXO score: 65/100.**

The homepage has a strong first viewport on desktop and mobile: clear local proposition, visible H1, and three conversion paths. No horizontal overflow was detected, base text is 16px, and normal scrolling reveals the route section correctly. The large blank area in one automated full-page mobile capture was caused by scroll-triggered content not activating during instant capture; it was not reproduced during sequential scrolling.

Two mobile targets are undersized: `TEXT US` at about 24px high and the Lawn Care route control at about 30px. Increase them to at least 44px.

The animated H1 exposes duplicate DOM text to the parser even though it renders once. Keep one semantic H1 and hide animation-only duplicates from assistive/search text. Consider making the semantic H1 explicitly local-intent focused while retaining the visual headline.

## Backlinks and authority

Backlink status is **insufficient data**. Moz, Bing Webmaster, DataForSEO, and GSC link data were unavailable. The selected Common Crawl Web Graph release did not observe the domain; because CCBot is also blocked, that result has limited diagnostic value and does not establish zero links.

Do not create a disavow file or make toxicity claims from this evidence. Configure Moz/Bing or DataForSEO and verify Search Console links before scoring authority or recommending cleanup.

## Evidence and limitations

Evidence used:

- Fresh live HTTP fetches of all 16 sitemap URLs, robots, sitemap, redirect variants, headers, and a 404.
- Server-rendered HTML parsing across technical, content, schema, and image analyzers.
- Chrome Lighthouse mobile and desktop lab runs.
- Desktop, laptop, tablet, and mobile full-page screenshots in [`screenshots/`](screenshots/).
- Limited public Google Maps, Nextdoor, and web-search evidence.
- Basic Common Crawl Web Graph lookup.

Limitations:

- No authenticated Google Search Console, GA4, GBP Insights, CrUX API, or PageSpeed API data.
- No DataForSEO, Moz, Bing Webmaster, or comprehensive backlink database.
- Google organic extraction encountered an unusual-traffic interstitial; exact rankings, ads, AI Overviews, PAA, and geo-grid positions were not verified.
- Public GBP review count, recency, owner responses, categories, and posts were not visible.
- Lighthouse is lab evidence from one run per device and should be repeated; field CWV determines real-user status.
- This audit changed no live site, Cloudflare, Google profile, or provider setting.
