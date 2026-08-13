-- Replace the original placeholder comparison pairs with real, supplied Avanti
-- project imagery. These guards target only the two known seed records, so
-- owner-created comparisons remain untouched.

UPDATE "BeforeAfterProject"
SET
  "beforeUrl" = '/assets/img/project-clay-soil-prep.jpg',
  "afterUrl" = '/assets/img/project-clay-soil-drainage.jpg',
  "caption" = 'Clay Soil & Drainage Work',
  "subtext" = 'Compare the project stages: site preparation and drainage installation'
WHERE "id" = 'seed_ba_foundation_bed'
  AND "beforeUrl" = '/assets/img/ba-foundation-before.jpg'
  AND "afterUrl" = '/assets/img/ba-foundation-after.jpg';

UPDATE "BeforeAfterProject"
SET
  "beforeUrl" = '/assets/img/project-sod-delivery.jpg',
  "afterUrl" = '/assets/img/project-sod-installation.jpg',
  "caption" = 'Sod Installation',
  "subtext" = 'Compare the project stages: delivery and installation underway'
WHERE "id" = 'seed_ba_new_lawn_marvin'
  AND "beforeUrl" = '/assets/img/gallery-soil-prep.jpg'
  AND "afterUrl" = '/assets/img/gallery-sod-closeup.jpg';

UPDATE "ContentBlock"
SET "value" = 'See the project work'
WHERE "page" = 'home'
  AND "key" = 'ba_heading'
  AND "value" = 'See the Transformation';

UPDATE "ContentBlock"
SET "value" = 'Drag the slider to compare real stages from recent Avanti projects.'
WHERE "page" = 'home'
  AND "key" = 'ba_paragraph'
  AND "value" = 'Drag the slider to see one of our recent foundation bed renovations, start to finish.';
