/*
  Warnings:

  - You are about to drop the `DoctorSpeacialties` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DoctorSpeacialties" DROP CONSTRAINT "DoctorSpeacialties_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorSpeacialties" DROP CONSTRAINT "DoctorSpeacialties_specialtiesId_fkey";

-- DropTable
DROP TABLE "DoctorSpeacialties";

-- CreateTable
CREATE TABLE "DoctorSpecialties" (
    "specialtiesId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,

    CONSTRAINT "DoctorSpecialties_pkey" PRIMARY KEY ("specialtiesId")
);

-- AddForeignKey
ALTER TABLE "DoctorSpecialties" ADD CONSTRAINT "DoctorSpecialties_specialtiesId_fkey" FOREIGN KEY ("specialtiesId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialties" ADD CONSTRAINT "DoctorSpecialties_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
