/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Destination` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Destination_name_key" ON "Destination"("name");
