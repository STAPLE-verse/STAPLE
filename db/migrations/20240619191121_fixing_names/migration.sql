/*
  Warnings:

  - You are about to drop the column `changedAt` on the `AssignmentStatusLog` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assignmentId,createdAt]` on the table `AssignmentStatusLog` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "AssignmentStatusLog_assignmentId_changedAt_key";

-- AlterTable
ALTER TABLE "AssignmentStatusLog" DROP COLUMN "changedAt";

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentStatusLog_assignmentId_createdAt_key" ON "AssignmentStatusLog"("assignmentId", "createdAt");
