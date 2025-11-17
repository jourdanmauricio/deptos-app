/*
  Warnings:

  - Added the required column `hasExpenses` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parcelId" TEXT NOT NULL,
    "nisElektrik" TEXT NOT NULL,
    "gas" TEXT NOT NULL,
    "abl" TEXT NOT NULL,
    "absa" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "hasPool" BOOLEAN NOT NULL,
    "hasGarage" BOOLEAN NOT NULL,
    "hasGarden" BOOLEAN NOT NULL,
    "hasKitchen" BOOLEAN NOT NULL,
    "hasExpenses" BOOLEAN NOT NULL,
    "squareMeters" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "refaccionYear" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Property" ("abl", "absa", "address", "bathrooms", "bedrooms", "createdAt", "description", "gas", "hasGarage", "hasGarden", "hasKitchen", "hasPool", "id", "name", "nisElektrik", "owner", "parcelId", "refaccionYear", "squareMeters", "updatedAt") SELECT "abl", "absa", "address", "bathrooms", "bedrooms", "createdAt", "description", "gas", "hasGarage", "hasGarden", "hasKitchen", "hasPool", "id", "name", "nisElektrik", "owner", "parcelId", "refaccionYear", "squareMeters", "updatedAt" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
