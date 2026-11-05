-- CreateEnum
CREATE TYPE "onboarding_role" AS ENUM ('emigrant', 'host');

-- AlterTable
ALTER TABLE "onboarding_drafts" ADD COLUMN     "role" "onboarding_role";
