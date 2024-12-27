/*
  Warnings:

  - You are about to drop the column `projectId` on the `Form` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Form" DROP CONSTRAINT "Form_projectId_fkey";

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "projectId";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "formVersionId" INTEGER;
