/*
  Warnings:

  - You are about to drop the column `userId` on the `Invitation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_userId_fkey";

-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "userId",
ADD COLUMN     "addedBy" INTEGER,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "privilege" "ContributorPrivileges" NOT NULL DEFAULT 'CONTRIBUTOR';
