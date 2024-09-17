-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('COMPLETED', 'NOT_COMPLETED');

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "taskId" INTEGER NOT NULL,
    "projectMemberId" INTEGER NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'NOT_COMPLETED',

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_projectMemberId_fkey" FOREIGN KEY ("projectMemberId") REFERENCES "Contributor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
