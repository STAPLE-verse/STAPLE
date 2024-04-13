/*
  Warnings:

  - You are about to drop the column `completedAs` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `completedBy` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Assignment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "completedAs",
DROP COLUMN "completedBy",
DROP COLUMN "metadata",
DROP COLUMN "status",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "AssignmentStatusLog" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignmentId" INTEGER NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'NOT_COMPLETED',
    "metadata" JSONB,
    "completedBy" INTEGER,
    "completedAs" "CompletedAs" NOT NULL DEFAULT 'INDIVIDUAL',

    CONSTRAINT "AssignmentStatusLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "template" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserNotifications" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AssignmentStatusLog_assignmentId_changedAt_key" ON "AssignmentStatusLog"("assignmentId", "changedAt");

-- CreateIndex
CREATE UNIQUE INDEX "_UserNotifications_AB_unique" ON "_UserNotifications"("A", "B");

-- CreateIndex
CREATE INDEX "_UserNotifications_B_index" ON "_UserNotifications"("B");

-- AddForeignKey
ALTER TABLE "AssignmentStatusLog" ADD CONSTRAINT "AssignmentStatusLog_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentStatusLog" ADD CONSTRAINT "AssignmentStatusLog_completedBy_fkey" FOREIGN KEY ("completedBy") REFERENCES "Contributor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserNotifications" ADD CONSTRAINT "_UserNotifications_A_fkey" FOREIGN KEY ("A") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserNotifications" ADD CONSTRAINT "_UserNotifications_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
