-- AlterTable
ALTER TABLE "Label" ADD COLUMN     "invitationId" INTEGER;

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
