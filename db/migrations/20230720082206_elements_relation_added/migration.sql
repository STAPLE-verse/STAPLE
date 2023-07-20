/*
  Warnings:

  - Added the required column `projectId` to the `Element` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Element" ADD COLUMN     "projectId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Element" ADD CONSTRAINT "Element_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
