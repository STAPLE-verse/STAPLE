-- AlterTable
ALTER TABLE "Widget" ADD COLUMN     "show" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "UserWidgets" (
    "userId" INTEGER NOT NULL,
    "widgetId" INTEGER NOT NULL,

    CONSTRAINT "UserWidgets_pkey" PRIMARY KEY ("userId","widgetId")
);

-- AddForeignKey
ALTER TABLE "UserWidgets" ADD CONSTRAINT "UserWidgets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWidgets" ADD CONSTRAINT "UserWidgets_widgetId_fkey" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
