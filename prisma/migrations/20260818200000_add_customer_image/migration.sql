-- Nullable, no backfill needed: most existing leads have no property photo.
ALTER TABLE "Customer" ADD COLUMN "image" TEXT;
