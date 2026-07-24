-- Data migration (no schema change).
--
-- The Before & After comparison used to be a single hardcoded pair of
-- ContentBlock rows per page. It is now a set of rows in "BeforeAfterProject",
-- managed from the Gallery admin screen. These blocks are no longer read by any
-- page, are hidden from the content editor, and no server action writes them.
--
-- Scoped to exactly four keys on two pages. "ba_heading" and "ba_paragraph" on
-- the home page are still rendered above the carousel and are deliberately NOT
-- included here.

DELETE FROM "ContentBlock"
WHERE "page" IN ('home', 'gallery')
  AND "key" IN (
    'ba_before_image',
    'ba_after_image',
    'ba_caption_title',
    'ba_caption_sub'
  );
