/*
  Warnings:

  - You are about to drop the column `data` on the `onboarding_drafts` table. All the data in the column will be lost.
  - Added the required column `answers` to the `onboarding_drafts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "onboarding_drafts"
  RENAME COLUMN "data" TO "answers";
