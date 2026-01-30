/*
  Warnings:

  - Made the column `grade_image` on table `student_course` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "student_course" ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "grade_image" SET NOT NULL;

-- CreateTable
CREATE TABLE "CompanyEvent" (
    "ce_id" SERIAL NOT NULL,
    "event_name" TEXT NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'COMPANY',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,

    CONSTRAINT "CompanyEvent_pkey" PRIMARY KEY ("ce_id")
);

-- CreateIndex
CREATE INDEX "CompanyEvent_event_date_idx" ON "CompanyEvent"("event_date");
