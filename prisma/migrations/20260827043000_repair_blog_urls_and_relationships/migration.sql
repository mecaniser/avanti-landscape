-- A target already in use would make the redirect ambiguous and could hide a
-- distinct article. Stop the deploy instead of silently overwriting content.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "BlogPost" WHERE "slug" = 'spring-vs-fall-cleanup')
     AND EXISTS (SELECT 1 FROM "BlogPost" WHERE "slug" = 'rock-vs-mulch-north-carolina') THEN
    RAISE EXCEPTION 'Cannot migrate spring-vs-fall-cleanup: target slug already exists';
  END IF;

  IF EXISTS (SELECT 1 FROM "BlogPost" WHERE "slug" = 'core-aeration')
     AND EXISTS (SELECT 1 FROM "BlogPost" WHERE "slug" = 'sod-vs-seed-waxhaw-nc') THEN
    RAISE EXCEPTION 'Cannot migrate core-aeration: target slug already exists';
  END IF;
END $$;

ALTER TABLE "BlogPost" ADD COLUMN "primaryServiceSlug" TEXT;

ALTER TABLE "BlogPost"
ADD CONSTRAINT "BlogPost_primaryServiceSlug_check"
CHECK (
  "primaryServiceSlug" IS NULL
  OR "primaryServiceSlug" IN ('lawn-care', 'landscaping', 'hardscaping', 'maintenance')
);

UPDATE "BlogPost"
SET "slug" = 'rock-vs-mulch-north-carolina'
WHERE "slug" = 'spring-vs-fall-cleanup';

UPDATE "BlogPost"
SET "slug" = 'sod-vs-seed-waxhaw-nc'
WHERE "slug" = 'core-aeration';

UPDATE "BlogPost"
SET "primaryServiceSlug" = CASE "slug"
  WHEN 'full-service-lawn-maintenance-waxhaw-nc' THEN 'maintenance'
  WHEN 'low-maintenance-landscaping-ideas-waxhaw-nc' THEN 'landscaping'
  WHEN 'tall-fescue-waxhaw' THEN 'lawn-care'
  WHEN 'rock-vs-mulch-north-carolina' THEN 'landscaping'
  WHEN 'sod-vs-seed-waxhaw-nc' THEN 'landscaping'
  ELSE "primaryServiceSlug"
END;

CREATE INDEX "BlogPost_primaryServiceSlug_idx" ON "BlogPost"("primaryServiceSlug");
