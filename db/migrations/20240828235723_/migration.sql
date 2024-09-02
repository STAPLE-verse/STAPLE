/*
  Warnings:

  - You are about to drop the column `invitationId` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the `Invitation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Label" DROP CONSTRAINT "Label_invitationId_fkey";

-- AlterTable
ALTER TABLE "Label" DROP COLUMN "invitationId";

-- DropTable
DROP TABLE "Invitation";

-- DropEnum
DROP TYPE "InvitationStatus";
