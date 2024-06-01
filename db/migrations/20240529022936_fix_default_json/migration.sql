/*
  Warnings:

  - Made the column `ui` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "ui" SET NOT NULL,
ALTER COLUMN "ui" SET DEFAULT '{}';
