-- CreateEnum
CREATE TYPE "role" AS ENUM ('user', 'admin', 'super_admin');

-- CreateEnum
CREATE TYPE "emigrant_purpose" AS ENUM ('work', 'study');

-- CreateEnum
CREATE TYPE "emigrant_state" AS ENUM ('established', 'on_the_way');

-- CreateEnum
CREATE TYPE "host_status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "document_types" AS ENUM ('national_id', 'passport');

-- CreateTable
CREATE TABLE "countries" (
    "iso_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("iso_code")
);

-- CreateTable
CREATE TABLE "regions" (
    "id" UUID NOT NULL,
    "country_code" TEXT NOT NULL,
    "geoname_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" UUID NOT NULL,
    "region_id" UUID NOT NULL,
    "geoname_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "population" INTEGER,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "middle_names" TEXT,
    "last_name" TEXT,
    "nickname" TEXT,
    "role" "role" NOT NULL DEFAULT 'user',
    "adult_confirmed_at" TIMESTAMP(3),
    "privacy_consent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboarding_drafts" (
    "user_id" UUID NOT NULL,
    "step" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_drafts_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "emigrant_profiles" (
    "user_id" UUID NOT NULL,
    "destination_city_id" UUID NOT NULL,
    "current_city_id" UUID NOT NULL,
    "purpose" "emigrant_purpose" NOT NULL,
    "expected_date" DATE,
    "state" "emigrant_state" NOT NULL DEFAULT 'on_the_way',

    CONSTRAINT "emigrant_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "host_profiles" (
    "user_id" UUID NOT NULL,
    "city_id" UUID NOT NULL,

    CONSTRAINT "host_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "host_verifications" (
    "host_id" UUID NOT NULL,
    "status" "host_status" NOT NULL DEFAULT 'pending',
    "document_type" "document_types" NOT NULL,
    "issuing_country" TEXT NOT NULL,
    "document_number" TEXT,
    "document_image_path" TEXT,
    "residence_proof_path" TEXT,
    "document_hash" TEXT,
    "rejection_reason" TEXT,
    "selfie_path" TEXT,
    "verified_at" TIMESTAMP(3),
    "reviewed_by" UUID,

    CONSTRAINT "host_verifications_pkey" PRIMARY KEY ("host_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "regions" ADD CONSTRAINT "regions_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "countries"("iso_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_drafts" ADD CONSTRAINT "onboarding_drafts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emigrant_profiles" ADD CONSTRAINT "emigrant_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emigrant_profiles" ADD CONSTRAINT "emigrant_profiles_destination_city_id_fkey" FOREIGN KEY ("destination_city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emigrant_profiles" ADD CONSTRAINT "emigrant_profiles_current_city_id_fkey" FOREIGN KEY ("current_city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "host_profiles" ADD CONSTRAINT "host_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "host_profiles" ADD CONSTRAINT "host_profiles_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "host_verifications" ADD CONSTRAINT "host_verifications_issuing_country_fkey" FOREIGN KEY ("issuing_country") REFERENCES "countries"("iso_code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "host_verifications" ADD CONSTRAINT "host_verifications_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "host_profiles"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "host_verifications" ADD CONSTRAINT "host_verifications_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
