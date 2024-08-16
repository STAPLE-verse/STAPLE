/*
  Warnings:

  - You are about to drop the column `schema` on the `Forms` table. All the data in the column will be lost.
  - You are about to drop the column `uiSchema` on the `Forms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Forms" DROP COLUMN "schema",
DROP COLUMN "uiSchema";

-- CreateTable
CREATE TABLE "FormVersion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "formId" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "schema" JSONB NOT NULL,
    "uiSchema" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "formVersionIndex" ON "FormVersion"("formId", "version");

-- AddForeignKey
ALTER TABLE "FormVersion" ADD CONSTRAINT "FormVersion_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
