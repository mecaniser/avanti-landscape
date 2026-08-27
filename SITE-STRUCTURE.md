# Landscaping and Hardscaping Site Structure

Prepared: August 19, 2026

## Architecture objective

Create a shallow service-led structure in which landscaping and hardscaping are durable hubs, focused child pages answer high-intent needs, projects provide proof, and location pages exist only where Avanti can demonstrate local relevance.

## Current commercial structure

~~~text
/
├── services/
│   ├── lawn-care/
│   ├── landscaping/
│   ├── hardscaping/
│   └── maintenance/
├── areas/
├── gallery/
├── about/
├── contact/
└── blog/
~~~

The structure is crawlable and its sitemap URLs are internally linked. The main architectural weakness is that landscaping and hardscaping each cover several distinct services on one short page.

## Target structure

The paver-patio and retaining-wall nodes below are proposed opportunities. They remain out of production until the owner confirms current service scope and original project proof.

~~~text
/
├── services/
│   ├── landscaping/
│   │   ├── drainage-grading/
│   │   └── sod-installation/
│   ├── hardscaping/
│   │   ├── paver-patios/
│   │   └── retaining-walls/
│   ├── lawn-care/
│   └── maintenance/
├── areas/
│   └── waxhaw-nc/
├── projects/
│   ├── waxhaw-drainage-project/
│   ├── waxhaw-paver-patio-project/
│   ├── retaining-wall-project/
│   └── sod-installation-project/
├── gallery/
├── about/
├── contact/
├── privacy/
├── terms/
└── blog/
~~~

Marvin and Weddington should remain proposed, not launched, until the demand and evidence gate is met. The same rule applies to future service children such as landscape lighting, plantings, rock installation, fire pits, walkways, and outdoor steps.

The live Google Reviews integration is intentionally a homepage proof section, not a thin standalone `/reviews` page. Create a dedicated reviews page only if it can add useful categorization, project context, and original first-party explanation beyond reproducing Google content.

## Page roles

### Parent service hubs

/services/landscaping and /services/hardscaping should:

- Define the complete service category
- Help visitors choose the right subtype
- Summarize process and local considerations
- Feature selected projects
- Link to every valid child service
- Link to related maintenance where appropriate
- Convert visitors who need a broader scope

### Child service pages

Each child page should:

- Target one clear commercial need
- Explain what is and is not included
- Describe diagnosis, planning, construction, or establishment steps
- Address meaningful cost and schedule variables without false precision
- Show original project proof
- Link back to its parent and across to closely related services
- Provide a direct estimate path

### Location pages

A location page should organize service relevance for a real market, not duplicate service copy. It should include:

- Services genuinely available in the town
- Local projects and original media
- Verifiable local conditions or operating context
- Privacy-safe neighborhood or area references where appropriate
- Links to relevant child services and projects
- Clear service-area boundaries

### Project pages

Project pages are evidence nodes. They should link to the service performed, the relevant location page, and one useful supporting article. They must use real project facts and media.

## Internal linking

The core relationship is:

~~~text
Parent service
    ↕
Focused child service ↔ Supporting article
    ↕                       ↕
Project case study ↔ Qualified location page
~~~

Rules:

1. Every child service links to its parent.
2. Every parent links to all live children with descriptive anchor text.
3. Every article links to the most relevant commercial page.
4. Every project links to its service and, when applicable, its location.
5. Every location page links to services actually available there.
6. Keep important commercial pages within three clicks of the homepage.
7. Do not create orphan pages or repetitive exact-match footer links.

## URL and migration rules

- Use lowercase, descriptive, hyphenated slugs.
- Avoid dates and marketing phrases in durable service URLs.
- Preserve existing parent service URLs.
- For the two mismatched articles, choose descriptive replacement slugs and use permanent one-hop redirects.
- Update canonical tags, internal links, breadcrumbs, sitemap entries, and structured data after any move.
- Retain redirects long term and verify that they do not chain.

## Indexation and sitemap rules

- Include only canonical, indexable, 200-status pages in the XML sitemap.
- Generate lastmod from a real content or deploy event, not request time.
- Do not add proposed pages to navigation or sitemap until they pass the readiness gate.
- Keep thin drafts noindexed or out of production.
- Remove changefreq and priority if they complicate maintenance; Google does not use them as ranking controls.

## Structured data plan

| Page type | Primary structured data |
|---|---|
| Homepage and core business pages | LandscapingBusiness with verified facts |
| Service hub or child service | Service plus BreadcrumbList |
| Project case study | Article or CreativeWork only when the visible page supports it; BreadcrumbList |
| Blog article | BlogPosting plus BreadcrumbList |
| Location page | Local business and service relationships only when facts and visible content support them |

FAQPage is not a priority for commercial rich results. Visible FAQs can still help visitors, but markup must not be treated as a substitute for useful content.

## Expansion gate

Before adding a service or location node, confirm:

- Search or lead demand
- Genuine service availability
- Unique approved copy
- Original proof
- A clear parent-child relationship
- A conversion goal
- Factual schema inputs
- Mobile and crawl QA

If those inputs are missing, improve an existing page instead of creating a new one.
