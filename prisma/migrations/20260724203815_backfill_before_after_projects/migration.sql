-- Data migration (no schema change).
--
-- "BeforeAfterProject" was created empty by 20260724195114, so on any database
-- that has already been deployed the carousel has no rows to render and both
-- the home and gallery pages hide the section entirely (projects.length > 0).
--
-- This seeds the starter projects using images that already ship in
-- public/assets/img, so it needs no Cloudinary upload. The owner manages the
-- list from the Gallery admin screen from here on.
--
-- Guarded by NOT EXISTS: it only ever fills a completely empty table. On a
-- database that already has projects (including local dev) it is a no-op, so
-- it can never duplicate rows or overwrite the owner's own content.

INSERT INTO "BeforeAfterProject" ("id", "beforeUrl", "afterUrl", "caption", "subtext", "sortOrder")
SELECT * FROM (
  VALUES
    (
      'seed_ba_foundation_bed',
      '/assets/img/project-planting-before.jpg',
      '/assets/img/project-planting-after.jpg',
      'Planting Bed Installation',
      'The same property before work began and after the new planting bed was installed',
      0
    )
) AS v ("id", "beforeUrl", "afterUrl", "caption", "subtext", "sortOrder")
WHERE NOT EXISTS (SELECT 1 FROM "BeforeAfterProject");
