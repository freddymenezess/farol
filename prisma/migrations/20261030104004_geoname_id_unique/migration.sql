/*
  Warnings:

  - A unique constraint covering the columns `[geoname_id]` on the table `cities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[geoname_id]` on the table `regions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cities_geoname_id_key" ON "cities"("geoname_id");

-- CreateIndex
CREATE UNIQUE INDEX "regions_geoname_id_key" ON "regions"("geoname_id");
