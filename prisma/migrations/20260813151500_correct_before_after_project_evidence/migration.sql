-- The previous photo pairs showed unrelated work stages, which made the
-- comparison slider imply a transformation it could not prove. Replace only
-- those two seeded records with the verified same-property planting sequence.
-- Owner-created records are never touched.

UPDATE "BeforeAfterProject"
SET
  "beforeUrl" = '/assets/img/project-planting-before.jpg',
  "afterUrl" = '/assets/img/project-planting-after.jpg',
  "caption" = 'Planting Bed Renovation',
  "subtext" = 'A real Avanti planting bed before work began and after installation',
  "sortOrder" = 0
WHERE "id" = 'seed_ba_foundation_bed'
  AND "beforeUrl" = '/assets/img/project-clay-soil-prep.jpg'
  AND "afterUrl" = '/assets/img/project-clay-soil-drainage.jpg';

DELETE FROM "BeforeAfterProject"
WHERE "id" = 'seed_ba_new_lawn_marvin'
  AND "beforeUrl" = '/assets/img/project-sod-delivery.jpg'
  AND "afterUrl" = '/assets/img/project-sod-installation.jpg';

UPDATE "ContentBlock"
SET "value" = 'See the difference'
WHERE "page" = 'home'
  AND "key" = 'ba_heading'
  AND "value" = 'See the project work';

UPDATE "ContentBlock"
SET "value" = 'Drag the slider to compare the same project before and after our work.'
WHERE "page" = 'home'
  AND "key" = 'ba_paragraph'
  AND "value" = 'Drag the slider to compare real stages from recent Avanti projects.';
