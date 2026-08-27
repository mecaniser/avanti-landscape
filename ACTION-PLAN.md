# SEO Action Plan — Avanti Landscaping

- **Source audit:** [`FULL-AUDIT-REPORT.md`](FULL-AUDIT-REPORT.md)
- **Prepared:** 2026-08-19
- **Reconciled:** 2026-08-27
- **Current score:** 62/100
- **Release principle:** verify every change on the live candidate; do not treat a code commit as proof that Cloudflare, Google, or indexed snippets changed.

## Planning package

| Document | Purpose |
|---|---|
| [`FULL-AUDIT-REPORT.md`](FULL-AUDIT-REPORT.md) | Evidence, scores, findings, and limitations |
| [`SEO-STRATEGY.md`](SEO-STRATEGY.md) | Positioning, priorities, KPI framework, and risk controls |
| [`COMPETITOR-ANALYSIS.md`](COMPETITOR-ANALYSIS.md) | Qualitative market comparison and content gaps |
| [`SITE-STRUCTURE.md`](SITE-STRUCTURE.md) | Target URLs, page roles, internal linking, and expansion gates |
| [`CONTENT-CALENDAR.md`](CONTENT-CALENDAR.md) | Twelve editorial pieces plus four separate case-study targets |
| [`IMPLEMENTATION-ROADMAP.md`](IMPLEMENTATION-ROADMAP.md) | Owners, dependencies, phases, and completion evidence |
| [`GEO-ANALYSIS.md`](GEO-ANALYSIS.md) | Reconciled AI-search/crawler strategy and verification limits |
| [`CLIENT-SEO-TASKS.md`](CLIENT-SEO-TASKS.md) | Owner approvals, project evidence, and managed-account actions that the development/SEO team cannot complete alone |

Use this action plan as the execution index. When documents differ, the later reconciled statement and the stricter evidence gate control.

## Priority definitions

- **Critical:** indexing block or penalty risk; immediate.
- **High:** material ranking, relevance, or conversion impact; target within one week.
- **Medium:** meaningful optimization; target within one month.
- **Low:** useful backlog item.

No Critical defect was reproduced in this audit.

## Current delivery status

| Track | Status on August 27, 2026 | Next proof required |
|---|---|---|
| Crawl/index foundation | Verified in the August 19 audit | Recheck the exact live release after each deployment |
| Google review integration | **Verified live.** [PR #26](https://github.com/mecaniser/avanti-landscape/pull/26) and build correction [PR #27](https://github.com/mecaniser/avanti-landscape/pull/27) are merged; Railway deployment `aded189c-f9fe-4528-bc6c-7cfd96dc6bf3` succeeded from SHA `653333354859b661239913621d43a4d9a9f47278`; production rendered the 5.0/49 summary and three written cards, and `/privacy` plus `/terms` returned `200` | Monitor API failures and Google attribution/link integrity; establish managed GBP review-velocity and response baseline |
| SEO planning package | **Complete on `codex/seo-planning`** | Review/approve priorities, owners, and capacity before implementation |
| GSC/GA4/GBP baselines | Not established in this evidence set | Dated exports or screenshots from the correct managed accounts |
| Phase-1 engineering fixes | Not started by this planning branch | Separate scoped implementation PRs with candidate and live verification |

Planning status is not production status. A PR, environment variable, recrawl request, and changed Google index are four separate states.

## High — first seven days

| # | Action | Owner | Effort | Acceptance evidence |
|---:|---|---|---:|---|
| 1 | Fix `/blog/spring-vs-fall-cleanup` and `/blog/core-aeration` by publishing descriptive replacement slugs with one-hop 301 redirects | Engineering + Content | M | Old URL returns one 301 to new URL; new URL returns 200 and self-canonical; sitemap, breadcrumbs, cards, internal links, and JSON-LD use new URL |
| 2 | Re-profile and improve homepage mobile LCP | Engineering | M | Median of three mobile Lighthouse runs is <3.5s initially, with a documented path to ≤2.5s; desktop does not regress; hero remains visually correct |
| 3 | Expand all four service pages with locally specific, decision-useful content | Product/Content + owner expert | L | Each page covers process, fit, timing, constraints, local conditions, service area, real project proof, and FAQs; no generic filler or unsupported claim |
| 4 | Add contextual blog-to-service and related-post links | Content | S | Every post links to the relevant service page and 2–3 related posts with descriptive anchors; service pages reciprocate to their strongest article |
| 5 | Confirm GBP data and resolve old-phone index drift | Local SEO owner | S | Managed GBP uses `980-328-7141`; Search Console live/indexed checks documented; `/contact` re-index request submitted; no external listing under control uses `980-338-7141` |
| 6 | Add visible permissioned customer/project proof | Owner + Content | M | Review display from PR #26 is merged and verified live with source attribution; larger projects include scope, material, timeframe, constraint, and outcome |
| 7 | Rewrite overlong titles and descriptions | SEO + Content | M | 14 titles and nine descriptions reviewed; primary service/local intent retained; no duplicates; live rendered metadata verified |

### Suggested URL replacements

- `/blog/spring-vs-fall-cleanup` → `/blog/rock-vs-mulch-north-carolina`
- `/blog/core-aeration` → `/blog/sod-vs-seed-waxhaw-nc`

Confirm the final slugs against Search Console query/history before release. Never delete the old URLs without redirects.

## Medium — next 30 days

| # | Action | Owner | Effort | Acceptance evidence |
|---:|---|---|---:|---|
| 8 | Repair sitemap modification dates | Engineering | S | Stable pages keep stable `lastmod`; content edits update it; request-time timestamps eliminated; optional `priority`/`changefreq` removed |
| 9 | Deepen `/areas` around Waxhaw authority before scaling | Content + owner expert | M | Real neighborhoods/projects/local conditions and unique proof; no thin city-swap pages |
| 10 | Add named owner/expert attribution and credentials where verifiable | Owner + Content | S | Visible profile, experience, and truthful credentials; blog byline/reviewer and visible modified date connected to schema |
| 11 | Strengthen entity graph | Engineering + Local SEO | M | Confirmed GBP/Nextdoor links in `sameAs`; truthful owner `Person`; page-specific schema; private SAB address remains private |
| 12 | Optimize largest image candidates | Engineering/Media | M | Ten >200KB candidates reviewed at actual display sizes; responsive selection verified; visual quality and CLS preserved |
| 13 | Fix mobile touch targets and semantic H1 duplication | Design/Engineering | S | Interactive targets ≥44px; one semantic H1 in accessibility tree; visual animation unchanged; keyboard/mobile checks pass |
| 14 | Build two content pillars and hardscaping cluster | Content strategy | L | Pillars link to services and supporting posts; planned topics are based on real query evidence where available |
| 15 | Add authoritative sources to factual horticultural content | Content | M | Claims cite primary/authoritative local sources such as NC State Extension; citations are contextual and current |

## Low / conditional backlog

| Action | Condition |
|---|---|
| Add `/llms.txt` | Only after core content/entity work; keep expectations modest |
| Change AI crawler policy | Explicit owner decision balancing citation visibility and content licensing; distinguish OAI-SearchBot from GPTBot |
| Add IndexNow | If faster Bing discovery is valuable |
| Add FAQ content | When questions are real and helpful; do not promise Google FAQ rich results for a commercial site |
| Add more city pages | Only after base service and Waxhaw pages pass quality gates and query data supports expansion |
| Configure Moz/Bing/DataForSEO | Required before backlink health, toxicity, velocity, or competitor-gap scoring |
| Add CSP | After testing required Next.js, Cloudinary, Cloudflare, analytics, and form origins |

## Measurement plan

| Metric | Baseline | Next gate | Source |
|---|---:|---:|---|
| SEO Health Score | 62 | ≥75 after High actions | Repeat this audit with same weights |
| Mobile lab LCP | 5.33s | <3.5s first, then ≤2.5s | Median of 3 Lighthouse runs |
| Desktop lab LCP | 1.36s | No regression | Median of 3 Lighthouse runs |
| Sitemap URLs | 16/16 return 200 | Maintain 100% | Sitemap crawl |
| Wrong slug/content pairs | 2 | 0 | Crawl + redirect verification |
| Posts with contextual service links | 0/5 | 5/5 | Main-content link audit |
| Overlong titles | 14/16 | 0–2 justified exceptions | Metadata crawl |
| Overlong descriptions | 9/16 | 0–2 justified exceptions | Metadata crawl |
| Search snippet with old phone | Observed for `/contact` | Correct number visible after recrawl | Search Console + public search |
| Field CWV | Unavailable | Establish baseline | CrUX/Search Console |
| GBP reviews/velocity | Unavailable | Establish verified baseline | Managed GBP Insights/profile |

## Release gates

1. Validate all redirects and canonical targets in staging/local candidate.
2. Run `npm run lint` and `npm run build` for code changes.
3. Crawl the exact candidate and compare titles, canonicals, schema, sitemap, and internal links.
4. Run mobile and desktop browser acceptance, including sequential scrolling and touch targets.
5. Deploy only with explicit authorization.
6. Verify live URLs, headers, metadata, schema, and redirects after deployment.
7. Submit sitemap/URLs in Search Console only with provider authorization.
8. Report code-live, provider-applied, recrawl-requested, and index-updated as separate states.
