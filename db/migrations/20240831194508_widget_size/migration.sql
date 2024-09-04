-- CreateEnum
CREATE TYPE "WidgetSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- AlterTable
ALTER TABLE "ProjectWidget" ADD COLUMN     "size" "WidgetSize" NOT NULL DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "Widget" ADD COLUMN     "size" "WidgetSize" NOT NULL DEFAULT 'MEDIUM';
