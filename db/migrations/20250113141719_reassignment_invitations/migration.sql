-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "reassignmentFor" INTEGER;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_reassignmentFor_fkey" FOREIGN KEY ("reassignmentFor") REFERENCES "ProjectMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
