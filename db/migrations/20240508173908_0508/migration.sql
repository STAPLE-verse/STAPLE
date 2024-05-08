/*
  Warnings:

  - You are about to drop the column `json` on the `Forms` table. All the data in the column will be lost.
  - Added the required column `schema` to the `Forms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Forms" DROP COLUMN "json",
ADD COLUMN     "schema" JSONB NOT NULL,
ADD COLUMN     "uiSchema" JSONB;
