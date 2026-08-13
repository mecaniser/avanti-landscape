# Avanti Landscaping — Property Plan

## Purpose

The homepage makes Avanti's four services feel like one accountable, local crew rather than four disconnected offerings. It opens with the property as the organizing idea, lets a visitor choose a service route, then moves into authentic project evidence and an equal-choice contact path.

The approved reference is `.impeccable/mocks/home-property-plan-guided-route.png`. The real hero video remains the live property field; it is not replaced by a fabricated aerial or synthetic project image.

## Visual direction

- **World:** A contemporary field report: deep field-green, survey-linen evidence sections, faint graphite contour marks, lichen service markers, and one stake-orange route.
- **Layout:** Use wide, deliberate panels with thin technical seams and strongly aligned edges. Prefer a service route, evidence fields, and editorial splits over a generic card grid.
- **Hero:** Put the plain-language whole-property proposition, quote/call/text choices, and owner-involved proof alongside the video and plotted four-service route.
- **Story order:** Whole-property promise → choose a service route → authentic before/after work → operating proof → coverage → local-company context → quote or call.
- **Images:** Preserve actual crew, project, service, and before/after assets. Crop for the composition, but do not use decorative stock imagery or imply unsupported types of completed work.

## Type and color

- **Display:** `Barlow Condensed` (with `Arial Narrow` fallback), semibold or bold, tightly tracked and mostly uppercase for labels, service names, and large statements.
- **Body and controls:** `Manrope` (with `Segoe UI` fallback), regular through semibold. Keep body copy short and practical.
- **Field green:** `#101c15` / `#172719` for the primary dark world.
- **Survey linen:** `#e8e3d5` / `#dfe1d4` for evidence and coverage fields.
- **Route orange:** `#ef6a3a` is reserved for the route, primary conversion, stateful details, and small directional accents.
- **Lichen accents:** muted green for service-icon discs and secondary technical detail; it must not compete with the route orange.

## Components and interaction

- The hero route contains four anchors: Lawn Care, Landscaping, Hardscaping, and Maintenance. Each anchors the visitor to the service-route section and selects the matching detail.
- `PropertyRoute` is a tab interface, not a decorative carousel. It exposes selected state, relationships between tabs and panels, arrow-key navigation, Home/End navigation, and a polite announcement for changed content.
- The before/after component remains an interactive proof mechanism, not an auto-advancing promotional effect.
- Quote, call, and text remain visible first-class contact methods. Do not hide text behind a menu or demote call beneath the quote form.

## Motion

- Motion must explain state or progression. The orange route draws once to establish the property-plan reading path; selected-service feedback is immediate and brief.
- Avoid continuous, ornamental animation, parallax, delayed reveals, or any movement that competes with contact actions.
- `prefers-reduced-motion` shows the complete static route, removes route animation and UI/image transitions, and suppresses decorative hero video. The message and all interactions must remain complete without motion.

## Responsive and accessibility conventions

- Preserve hierarchy from desktop to mobile: proposition and contact paths first, then the compact route plot, then the selected service detail.
- On small screens, stack contact choices intentionally and retain touch-friendly service rows and route markers.
- Maintain visible keyboard focus, real links for navigation and contact actions, labelled tab/panel relationships, descriptive image alt text, and contrast-safe text on dark media.
- Never make essential information dependent on hover, video playback, a pointer device, or a color-only signal.

## Content guardrails

- Supported claims: locally owned and operated; full-service lawn care, landscaping, hardscaping, and maintenance; nine listed service communities; free quotes; and **100% owner-involved crews**.
- Hardscaping language must stay within evidence on hand: edging, stone, drainage details, beds, and related outdoor improvements. Do not claim patios, walls, fire pits, awards, licensing, testimonials, review counts, customer totals, or outcome benchmarks without new verified source material.
- Pricing is not established. Do not invent prices, discounts, timelines, or guarantees.
- Keep voice direct, dependable, local, and free of pressure.
