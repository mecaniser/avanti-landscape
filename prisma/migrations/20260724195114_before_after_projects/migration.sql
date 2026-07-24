-- CreateTable
CREATE TABLE "BeforeAfterProject" (
    "id" TEXT NOT NULL,
    "beforeUrl" TEXT NOT NULL,
    "afterUrl" TEXT NOT NULL,
    "caption" TEXT NOT NULL,
    "subtext" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BeforeAfterProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BeforeAfterProject_sortOrder_idx" ON "BeforeAfterProject"("sortOrder");
