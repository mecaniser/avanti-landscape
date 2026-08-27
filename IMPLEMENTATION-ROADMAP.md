# Landscaping and Hardscaping SEO Implementation Roadmap

Prepared: August 19, 2026

Planning horizon: Twelve months, with a six-month build cycle and six-month authority cycle

Scope: Strategy and implementation sequencing; no deployment or provider changes are authorized by this document

## Priority model

- P0: Blocks measurement, crawl quality, or core mobile experience
- P1: Directly strengthens landscaping and hardscaping conversion pages
- P2: Builds supporting proof, topical coverage, and local relevance
- P3: Scales only after measured demand and evidence exist

## Phase 1: repair and baseline

Target: Weeks 1 to 3

| Priority | Work | Owner | Completion evidence |
|---|---|---|---|
| P0 | Establish GSC, GBP, and GA4 baselines for organic landing pages and qualified leads | Marketing and analytics | Dated baseline with definitions |
| P0 | Improve homepage mobile LCP from the measured 5.33s toward 2.5s or less | Engineering | Repeat mobile lab runs; field validation when available |
| P0 | Correct the two mismatched blog slugs with one-hop 301s | Engineering and SEO | Redirect, canonical, internal-link, and sitemap checks |
| P0 | Replace request-time sitemap lastmod values with real modification timestamps | Engineering | Two fetches produce stable truthful dates |
| P1 | Rewrite overlong or generic commercial metadata | SEO | Crawl export with title and description checks |
| P1 | Verify public business facts, credentials, insurance language, service area, and review sources | Business owner | Approved fact sheet |

No production deployment, Search Console submission, GBP edit, or cache purge should occur without separate authorization.

## Phase 2: commercial foundation

Target: Weeks 3 to 10

| Priority | Work | Owner | Completion evidence |
|---|---|---|---|
| P1 | Deepen /services/landscaping | SEO, business owner, design | Content, proof, internal links, mobile review |
| P1 | Deepen /services/hardscaping | SEO, business owner, design | Content, proof, internal links, mobile review |
| P1 | Build drainage and grading page | SEO and business owner | Unique scope, project evidence, QA |
| P1 | Build sod installation page | SEO and business owner | Unique scope, project evidence, QA |
| P1 | Validate the paver-patio opportunity; build only if the business fact gate passes | SEO and business owner | Approved current scope, exclusions, original project evidence, QA |
| P1 | Validate the retaining-wall opportunity; build only if the business fact gate passes | SEO and business owner | Approved current scope, exclusions, original project evidence, QA |
| P2 | Build one evidence-rich Waxhaw page | SEO and business owner | Local proof, distinct copy, service links |
| P2 | Publish two project case studies | Content and field team | Approved facts and original media |

All new pages must be useful before schema is added. Service and BreadcrumbList markup should match the visible content and actual provider facts.

## Phase 3: content and measured expansion

Target: Months 3 to 5

| Priority | Work | Owner | Completion evidence |
|---|---|---|---|
| P2 | Publish two decision-useful articles per month | Content | Editorial QA and internal-link checks |
| P2 | Publish two additional project case studies | Content and field team | Four total case studies |
| P2 | Add consistent project context to the gallery | Design and content | Service, location, material, and outcome labels |
| P2 | Establish an ongoing review-request and response process | Operations | Policy-compliant workflow and monthly tracking |
| P3 | Evaluate lighting, fire pit, walkway, or planting pages | SEO | Demand and proof gate documented |
| P3 | Evaluate Marvin and Weddington pages | SEO and business owner | GSC, GBP, lead, or completed-job evidence |

Do not create an additional service or location page merely to satisfy a page-count goal.

## Phase 4: authority and optimization

Target: Months 5 to 6

| Priority | Work | Owner | Completion evidence |
|---|---|---|---|
| P2 | Pursue relevant local associations, suppliers, partners, and community mentions | Business development | Verified live referring pages |
| P2 | Review landing-page lead quality and conversion paths | Analytics and SEO | Page-level lead report |
| P2 | Refresh underperforming pages based on query and engagement evidence | SEO | Before-and-after change log |
| P3 | Expand to the next service or town only if its gate passes | SEO and business owner | Signed evidence review |

Backlink work should prioritize legitimate local relationships and project relevance. No disavow recommendation is justified by the currently insufficient backlink dataset.

## Phase 5: authority and selective expansion

Target: Months 7 to 12

| Priority | Work | Owner | Completion evidence |
|---|---|---|---|
| P2 | Refresh service and editorial pages using GSC queries and qualified-lead evidence | SEO and Content | Dated change log tied to query/lead findings |
| P2 | Publish at least two additional project case studies | Content and field team | Six total structured case studies with approved facts and media |
| P2 | Build legitimate local authority through suppliers, associations, projects, and community relationships | Business development | Relevant live mentions/referring pages; no paid-link scheme |
| P2 | Improve landing-page conversion paths based on call and form quality | Analytics, Design, SEO | Before/after conversion and lead-quality review |
| P3 | Launch the next service or location page only when its readiness gate passes | SEO and business owner | Written evidence review and signed approval |
| P3 | Retire, consolidate, or substantially revise pages that remain thin or attract the wrong intent | SEO and Engineering | Redirect/canonical plan plus pre/post crawl verification |

## Resource and dependency model

This plan does not assume a paid SEO-tool or media budget. Record those amounts before approving work that depends on them.

| Resource | Minimum working commitment | Dependency it unlocks |
|---|---|---|
| Business owner/expert | 1–2 hours weekly for fact review, scope boundaries, and approvals | Truthful service copy, credentials, local expertise, case studies |
| Field team | A repeatable photo and project-note handoff after qualifying jobs | Original proof, gallery context, case studies, GBP posts |
| Content/SEO | Two editorial pieces monthly plus one case study about every six weeks | Topic coverage, internal links, local authority |
| Engineering | One focused Phase-1 sprint, then planned page/schema/redirect support | Performance, redirects, sitemap fidelity, templates, tracking |
| Analytics | GSC, GA4, GBP, and lead-source definitions before growth claims | Baselines, prioritization, page-level lead quality |

Critical dependencies:

1. Owner-approved facts and project evidence precede new service or location pages.
2. Redirect and measurement work precede conclusions about content performance.
3. PR #26 must be merged, deployed, and verified before the Google Reviews display is marked live.
4. Search Console, GA4, or GBP actions require the correct managed account and explicit provider authorization.

## Page readiness gate

A proposed page is ready for production only when all are true:

- The service is genuinely offered in the stated area.
- Scope and exclusions have been approved.
- At least one original image or project example is available.
- The copy is materially different from parent and sibling pages.
- A clear internal-link path exists.
- The title, H1, canonical, robots state, and schema agree.
- Mobile visual and performance checks pass.
- Conversion tracking is defined.

## Location-page stop conditions

Pause location expansion when any of these is true:

- No completed work or operational evidence exists for the town.
- Copy would mainly substitute the town name.
- No impressions, GBP signals, leads, or strategic business reason support it.
- Photos, testimonials, or service claims cannot be attributed honestly.
- Existing commercial pages have not yet been strengthened or measured.

## Review cadence

- Weekly during Phase 1: technical blockers and factual approvals
- Biweekly during Phase 2: page readiness and project-asset review
- Monthly after launch: GSC queries, organic landing pages, lead quality, GBP activity, and CWV
- At 90 days: continue, revise, or stop each expansion track based on evidence
- At 180 days: approve the next service or geographic tranche

## Six-month completion definition

The roadmap is complete when the two service hubs are deepened, four focused services and one Waxhaw page meet the readiness gate, four case studies and twelve editorial pieces are published, the two URL mismatches and sitemap dates are corrected, mobile performance is retested, and organic lead measurement has a credible baseline.

## Twelve-month completion definition

The authority cycle is complete when Avanti has six or more structured case studies, a stable review-request and response process, page-level organic lead-quality reporting, a documented refresh history, and at least one verified local-authority track. New towns or services count as progress only when their evidence gates pass; page count alone is not a success metric.
