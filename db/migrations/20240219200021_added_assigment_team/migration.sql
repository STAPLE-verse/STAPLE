-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_projectMemberId_fkey";

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "teamId" INTEGER,
ALTER COLUMN "projectMemberId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_projectMemberId_fkey" FOREIGN KEY ("projectMemberId") REFERENCES "Contributor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
