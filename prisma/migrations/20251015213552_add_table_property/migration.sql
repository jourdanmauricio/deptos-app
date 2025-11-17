-- CreateTable
CREATE TABLE "Property" (
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
    "hasParking" BOOLEAN NOT NULL,
    "squareMeters" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
