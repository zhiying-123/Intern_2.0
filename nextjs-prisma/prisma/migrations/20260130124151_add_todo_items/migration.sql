/*
  Warnings:

  - You are about to drop the column `created_by` on the `CompanyEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyEvent" DROP COLUMN "created_by";

-- CreateTable
CREATE TABLE "TodoItem" (
    "todo_id" SERIAL NOT NULL,
    "u_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMP(3),
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TodoItem_pkey" PRIMARY KEY ("todo_id")
);

-- CreateIndex
CREATE INDEX "TodoItem_u_id_status_idx" ON "TodoItem"("u_id", "status");

-- CreateIndex
CREATE INDEX "TodoItem_due_date_idx" ON "TodoItem"("due_date");
