# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary users are homeowners in Waxhaw, North Carolina, and nearby communities who need dependable ongoing lawn care, property maintenance, or a defined outdoor improvement project. They are evaluating whether Avanti can handle the work, whether the company serves their location, and whether they can trust the crew with their property.

Secondary users are HOA representatives and business property decision-makers seeking the same services for shared or commercial properties.

## Product Purpose

The public website helps prospective customers understand Avanti Landscaping's full range of services, see authentic work, confirm local coverage, and request a free quote. A successful visit produces a qualified inquiry through either the quote form or a call/text; those conversion paths are equally important.

The owner-facing dashboard keeps public content, service descriptions, project imagery, before-and-after projects, blog posts, and customer leads manageable without editing source code.

## Positioning

Avanti is a locally owned, full-service lawn and landscape company whose owner remains involved with every crew. Its range spans lawn care, landscaping, hardscaping, and recurring property maintenance, allowing a customer to use one accountable local team for routine care and larger outdoor improvements.

Local knowledge of tall fescue, Bermuda lawns, and the Waxhaw-area transition climate supports the broader full-service position.

## Operating Context

Prospective customers commonly arrive with either an ongoing property-care need or a visible problem or project. They can review services, service areas, real project photography, before-and-after comparisons, company information, and local lawn-care guidance before contacting Avanti.

The quote workflow collects contact information, property address, requested service, and optional project details. Successful submissions create customer leads and can trigger an email notification. Call and text links remain first-class alternatives to the form.

The owner maintains the website through a protected admin dashboard. Public page copy and media are database-backed; Cloudinary stores owner-uploaded media. The application is deployed on Railway.

## Capabilities and Constraints

- Four durable service categories: Lawn Care, Landscaping, Hardscaping, and Lawn & Landscape Maintenance.
- Public routes for the homepage, services, service areas, about, gallery, contact, and blog.
- Owner-managed gallery and before-and-after projects; the before-and-after section is absent when no projects exist.
- Owner-managed hero media and page content.
- Contact leads stored as customers with lead, active, or inactive status.
- The primary service area currently covers nine named NC/SC communities centered on Waxhaw.
- Free, no-pressure quote requests are available through the form and call/text actions.
- Uploaded media depends on Cloudinary configuration; without it, admin upload controls are intentionally unavailable.
- The seed command is destructive to managed content and must never be run against production.
- Pricing is not established in the product record and must not be invented.

## Brand Commitments

- Product and legal name: Avanti Landscaping LLC.
- Locally owned and operated in Waxhaw, North Carolina.
- The claim “100% owner-involved crews” is confirmed factual.
- Voice is direct, dependable, practical, and confident without pressure or inflated promises.
- Real company logos, crew photography, project photography, and project video are the authoritative brand assets.
- The client has explicitly requested modern, motion-led ways of revealing information on the public site. The exact visual and motion system remains a later design decision.

## Evidence on Hand

- Authentic logo and hero media under `public/assets/`.
- Authentic crew, service, and project photography under `public/assets/img/` and in the owner-managed Cloudinary library.
- Two current before-and-after project pairs, with the collection managed through the Gallery admin.
- A real interactive before-and-after comparison on the homepage and gallery.
- Local service knowledge represented by published guidance about aeration, seasonal cleanup, and tall fescue in Waxhaw.
- Confirmed factual proof: locally owned operation, full-service coverage, free quotes, nine listed communities, and 100% owner-involved crews.
- No confirmed testimonials, review excerpts, awards, licenses, customer counts, or outcome benchmarks are on hand. Future work must not fabricate them.

## Product Principles

1. Make the breadth of the full-service offering understandable without making the customer decode industry categories.
2. Prefer authentic project evidence and specific local knowledge over generic marketing claims.
3. Keep form submission and call/text equally clear, accessible, and easy to use.
4. Reinforce local accountability and owner involvement at meaningful decision points.
5. Use motion to explain work, progression, or results while preserving user control, reduced-motion behavior, and fast access to core information.

## Accessibility & Inclusion

The public experience must support keyboard navigation, visible focus, screen-reader state, usable touch targets, and user-controlled motion. Reduced-motion and data-saving preferences must preserve the complete message without loading or requiring decorative video. A formal conformance target beyond these confirmed requirements remains undecided.
