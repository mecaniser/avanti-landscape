-- Backfills existing rows to the migration time, then Prisma's @updatedAt
-- keeps it current from here on: it stamps every create and update. That's a
-- reasonable start value since these rows haven't been touched since they
-- were created, as far as anything in the app can prove.
ALTER TABLE "Service" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "GalleryImage" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "BeforeAfterProject" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
