/*
  Warnings:

  - You are about to drop the column `invitationStatus` on the `Contributor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contributor" DROP COLUMN "invitationStatus";

-- CreateTable
CREATE TABLE "Invitation" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "invitationStatus" "InvitationStatus" NOT NULL DEFAULT 'INVITED',
    "inviteCode" TEXT NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
