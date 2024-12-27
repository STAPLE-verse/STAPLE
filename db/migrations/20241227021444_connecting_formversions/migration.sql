/*
  Warnings:

  - You are about to drop the column `projectId` on the `FormVersion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FormVersion" DROP CONSTRAINT "FormVersion_projectId_fkey";

-- AlterTable
ALTER TABLE "FormVersion" DROP COLUMN "projectId";

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_formVersionId_fkey" FOREIGN KEY ("formVersionId") REFERENCES "FormVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
