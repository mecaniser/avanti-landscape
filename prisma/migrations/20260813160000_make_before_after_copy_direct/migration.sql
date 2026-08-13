-- Correct the seeded comparison copy to describe the verified same-property
-- planting installation without implying that unrelated project stages are a
-- before/after result. Owner-created comparison content remains untouched.

UPDATE "BeforeAfterProject"
SET
  "caption" = 'Planting Bed Installation',
  "subtext" = 'The same property before work began and after the new planting bed was installed'
WHERE "id" = 'seed_ba_foundation_bed'
  AND "beforeUrl" = '/assets/img/project-planting-before.jpg'
  AND "afterUrl" = '/assets/img/project-planting-after.jpg'
  AND "caption" = 'Planting Bed Renovation';

UPDATE "ContentBlock"
SET "value" = 'A real before & after'
WHERE "page" = 'home'
  AND "key" = 'ba_heading'
  AND "value" = 'See the difference';

UPDATE "ContentBlock"
SET "value" = 'One Avanti project, shown before work and after installation.'
WHERE "page" = 'home'
  AND "key" = 'ba_paragraph'
  AND "value" = 'Drag the slider to compare the same project before and after our work.';
