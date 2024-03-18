-- AlterTable
ALTER TABLE "User" ALTER COLUMN "needPasswordChange" SET DEFAULT true;

-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "profilePhoto" DROP NOT NULL;
