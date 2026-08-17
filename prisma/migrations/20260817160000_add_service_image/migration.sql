-- Optional photo of the specific work a service describes. Nullable: existing
-- rows keep their text-only card until the owner uploads a real photo.
ALTER TABLE "Service" ADD COLUMN "image" TEXT;
