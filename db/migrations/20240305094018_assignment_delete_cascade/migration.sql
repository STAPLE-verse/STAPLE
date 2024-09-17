-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_projectMemberId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_projectId_fkey";

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_projectMemberId_fkey" FOREIGN KEY ("projectMemberId") REFERENCES "Contributor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
