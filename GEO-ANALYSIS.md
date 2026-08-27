# GEO Analysis — avantilandscapingnc.com

**Original audit:** August 18, 2026

**Reconciled:** August 26, 2026

**Site:** https://www.avantilandscapingnc.com/

**Business model:** Local service-area business; do not publish a private home or operating address

## Executive finding

Avanti's main generative-search limitation is not a universal crawler block. The live site is server-rendered, Googlebot is allowed, OAI-SearchBot is not specifically blocked, and the sitemap exposes 16 canonical public URLs. The larger constraints are thin commercial answers, limited project/entity proof, weak external authority, and an unresolved decision about which training or retrieval crawlers the business wants to permit.

The earlier version of this report incorrectly treated GPTBot as the control for ChatGPT Search and treated Google-Extended as a Google Search ranking control. Official provider guidance distinguishes these controls:

- [OpenAI crawler documentation](https://platform.openai.com/docs/bots) says OAI-SearchBot controls eligibility for ChatGPT Search, while GPTBot is used for potential model training. The settings are independent.
- [Google crawler documentation](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers#google-extended) says Google-Extended does not affect inclusion in Google Search and is not a ranking signal.

## Reconciled GEO readiness score: 49 / 100

This uses the later full-audit score so the planning package has one baseline.

| Dimension | Score | Evidence |
|---|---:|---|
| Technical retrieval | 78 | SSR HTML, valid sitemap, Googlebot allowed, OAI-SearchBot inherits wildcard access |
| Passage citability | 42 | Clear headings, but service pages are short and contain few self-contained answers |
| Entity and local trust | 48 | Consistent site phone and public GBP; limited named expertise and project context |
| Original proof and media | 55 | Strong project imagery and before/after presentation; few structured case studies |
| External authority | 22 | Backlink, citation, and third-party mention coverage remains unmeasured or limited |
| **Overall planning baseline** | **49** | Directional score, not a provider ranking metric |

## Live crawler-policy snapshot

The August 26 live `robots.txt` contains Cloudflare-managed content signals plus site-specific `/admin` and `/api` exclusions.

| Crawler or control | Live state | What can be concluded |
|---|---|---|
| Googlebot | Allowed | Ordinary Google crawling/indexing is not blocked by robots.txt |
| Google-Extended | Blocked | Google says this does not affect Google Search inclusion or ranking; treat it as a separate generative-AI use decision |
| OAI-SearchBot | Not specifically blocked | It inherits `User-agent: * / Allow: /`; this is the relevant automatic crawler for ChatGPT Search eligibility |
| GPTBot | Blocked | This expresses an OpenAI model-training opt-out; it does not by itself opt the site out of ChatGPT Search |
| ChatGPT-User | Not specifically blocked | User-initiated visits are separate from automatic search crawling and may not follow robots rules in the same way |
| ClaudeBot | Blocked | Anthropic crawler access is restricted; do not generalize this into an unverified claim that every Claude retrieval path is impossible |
| PerplexityBot | Not specifically blocked | It inherits wildcard access; actual inclusion/citation still requires provider-side discovery and authority |
| CCBot and other training crawlers | Blocked | This is a content-licensing choice, not an SEO defect by itself |

### Required decision

Do not automatically disable Cloudflare's managed policy. The owner should decide separately for:

1. Search/discovery crawlers used to surface links or answers.
2. User-initiated retrieval agents.
3. Model-training crawlers.

Record the chosen policy, change it only with provider authorization, then verify the live `robots.txt` and Cloudflare bot logs. Ranking or citation gains must not be promised from a crawler-policy change alone.

## Platform readiness

| Surface | Readiness | Next useful action |
|---|---:|---|
| Google Search / AI features | 58/100 | Deepen service/location answers, add project proof, and improve entity consistency; Googlebot is already allowed |
| ChatGPT Search | 52/100 | Keep OAI-SearchBot intentionally allowed, verify published IP access in Cloudflare, and improve source-worthy content |
| Perplexity | 50/100 | Verify actual citation behavior after stronger pages and third-party mentions exist |
| Bing Copilot | 48/100 | Confirm Bing index coverage and add IndexNow only if its operational benefit justifies it |
| Claude | Unscored | Confirm current Anthropic crawler/product documentation before changing the ClaudeBot policy |

These are planning estimates, not observed rankings or citation rates. No authenticated AI-visibility or DataForSEO dataset was available.

## Content and citability

The full audit found approximately 180–214 words on each service page and about 78 words on `/areas`. The issue is not that every paragraph must hit a fixed word count. The issue is that the pages do not yet answer enough of the decisions a homeowner makes before contacting a contractor.

For each priority service page, add concise sections that can stand on their own:

- What problem the service solves and when another solution may be more appropriate
- What Avanti's scope includes and excludes
- How diagnosis, preparation, installation, and handoff work
- Which access, drainage, grade, material, and site conditions affect scope
- What evidence the homeowner should expect from Avanti
- A direct next step tied to that service

Use question headings when they match genuine customer language, but do not mechanically rewrite every heading or force every answer into a 134–167-word block. Completeness and factual specificity matter more than a paragraph-length formula.

## Brand, reviews, and project proof

The August 26 Places API check verified Avanti Landscaping LLC at 5.0 from 49 reviews. PR #26 adds a policy-aware homepage display with Google attribution, reviewer/source links, fallbacks, and public Privacy/Terms pages. It is **pending**, not live, until merge, Railway deployment, and production verification are complete.

Use the reviews as third-party validation, while case studies carry first-party project proof. Each case study should connect:

~~~text
Local problem → diagnosis/design decision → scope/materials → work sequence → result → related service
~~~

Do not copy review text into schema or publish `AggregateRating` merely to seek a rich result. Google's [review-snippet guidance](https://developers.google.com/search/docs/appearance/structured-data/review-snippet#self-serving) restricts self-serving review features for LocalBusiness and Organization pages. Visible, attributed review content can still help users without promising a search enhancement.

## Structured content recommendations

1. Keep the existing `LandscapingBusiness`, `Service`, `BlogPosting`, and `BreadcrumbList` markup aligned with visible facts.
2. Add a truthful owner/expert `Person` only after the name, role, experience, and credentials are approved for publication.
3. Keep useful FAQs in visible page copy. FAQ schema is optional and should not be sold as a rich-result tactic for this commercial site; Google limits FAQ rich results primarily to authoritative government and health sites.
4. Add project-page structured data only when the visible page has enough real facts to support it.
5. Do not publish a partial, fabricated, virtual, or private street address for this service-area business. Use verified service areas and keep the managed GBP address hidden when customers are not served there.
6. Add `VideoObject` only after original video exists and its required visible metadata is present.

## llms.txt

`/llms.txt` currently returns `404`. Treat this as a low-priority experiment, not a prerequisite or ranking control. Add it only after the core service pages, entity facts, and project proof are stable enough to maintain a useful file. The sitemap and ordinary crawl paths remain the primary discovery mechanisms.

## Original media and external authority

Priority media work:

1. Capture before, during, and after sets for qualifying projects.
2. Record short owner or crew explanations of the problem, decision, and finished result.
3. Publish video only when rights, location privacy, and factual descriptions are approved.
4. Link any real YouTube channel in `sameAs` only after identity and ownership are confirmed.

Priority authority work:

- Supplier or manufacturer project features
- Relevant local associations and community participation
- Legitimate partner, neighborhood, or publication mentions
- Consistent profiles on Google, Nextdoor, Apple Maps, and other actually managed directories

No backlink count, domain-authority target, toxicity conclusion, or disavow action is justified without a reliable dataset.

## Six-month GEO action order

| Order | Action | Success evidence |
|---:|---|---|
| 1 | Deepen landscaping and hardscaping hubs | Complete local decision content, project proof, internal links, mobile QA |
| 2 | Publish four evidence-backed child services | Each passes the page-readiness gate and has original proof |
| 3 | Publish four structured project case studies | Approved facts, original media, service/location links |
| 4 | Launch one evidence-rich Waxhaw page | Distinct local proof and useful service relationships |
| 5 | Verify review integration from PR #26 | Live data, attribution/source links, fallbacks, privacy/terms, server-only key |
| 6 | Decide crawler policy intentionally | Written owner decision plus live robots and Cloudflare-log verification |
| 7 | Test actual AI visibility | Dated queries, geography/account context, citations, and limitations recorded |

## Verification limits

- No authenticated GSC, GA4, GBP Insights, Bing Webmaster, backlink, or DataForSEO dataset was used.
- Platform scores are directional planning estimates.
- AI answer tests are not stable ranking measurements and can vary by user, location, model, and date.
- The live homepage did not yet contain the PR #26 reviews section when checked August 26.
- Provider-policy claims above use official OpenAI and Google documentation; recheck them before future crawler-policy changes.
