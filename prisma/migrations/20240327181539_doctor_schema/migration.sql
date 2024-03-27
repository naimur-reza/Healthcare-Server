-- AlterTable
ALTER TABLE "doctors" ALTER COLUMN "currentWorkingPlace" DROP NOT NULL,
ALTER COLUMN "isDeleted" DROP NOT NULL,
ALTER COLUMN "isDeleted" SET DEFAULT false,
ALTER COLUMN "averageRating" DROP NOT NULL,
ALTER COLUMN "averageRating" SET DEFAULT 0;
