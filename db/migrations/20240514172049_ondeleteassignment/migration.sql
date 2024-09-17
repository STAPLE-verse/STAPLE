-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_projectMemberId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_teamId_fkey";

-- DropForeignKey
ALTER TABLE "AssignmentStatusLog" DROP CONSTRAINT "AssignmentStatusLog_assignmentId_fkey";

-- AddForeignKey
ALTER TABLE "AssignmentStatusLog" ADD CONSTRAINT "AssignmentStatusLog_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_projectMemberId_fkey" FOREIGN KEY ("projectMemberId") REFERENCES "Contributor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
