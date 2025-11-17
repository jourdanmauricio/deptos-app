-- CreateTable
CREATE TABLE "Party" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "documentFront" TEXT,
    "documentBack" TEXT,
    "bank" TEXT,
    "accountNumber" TEXT,
    "cbu" TEXT,
    "alias" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rentalId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "penalty" REAL,
    "total" REAL,
    "concept" TEXT NOT NULL DEFAULT 'RENT',
    "paidDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT NOT NULL DEFAULT 'CASH',
    "referenceNumber" TEXT,
    "receiptUrl" TEXT,
    "notes" TEXT,
    "periodStart" DATETIME,
    "periodEnd" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Rental" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rental" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "propertyId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "contractDurationYears" INTEGER NOT NULL DEFAULT 2,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "signedDate" DATETIME,
    "terminationDate" DATETIME,
    "initialRent" REAL NOT NULL,
    "rentUpdateMonths" INTEGER DEFAULT 3,
    "penaltyRate" REAL,
    "currency" TEXT NOT NULL DEFAULT 'ARS',
    "indexationType" TEXT NOT NULL DEFAULT 'IPC',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "deposit" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT 'CASH',
    "billing" BOOLEAN NOT NULL DEFAULT false,
    "observation" TEXT,
    "contractUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "wordTemplateId" TEXT,
    CONSTRAINT "Rental_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rental_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Party" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rental_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Party" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rental_wordTemplateId_fkey" FOREIGN KEY ("wordTemplateId") REFERENCES "WordTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WordTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "variables" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_Guarantor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_Guarantor_A_fkey" FOREIGN KEY ("A") REFERENCES "Party" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_Guarantor_B_fkey" FOREIGN KEY ("B") REFERENCES "Rental" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
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
INSERT INTO "new_Property" ("abl", "absa", "address", "bathrooms", "bedrooms", "createdAt", "description", "gas", "hasExpenses", "hasGarage", "hasGarden", "hasKitchen", "hasPool", "id", "name", "nisElektrik", "owner", "parcelId", "refaccionYear", "squareMeters", "updatedAt") SELECT "abl", "absa", "address", "bathrooms", "bedrooms", "createdAt", "description", "gas", "hasExpenses", "hasGarage", "hasGarden", "hasKitchen", "hasPool", "id", "name", "nisElektrik", "owner", "parcelId", "refaccionYear", "squareMeters", "updatedAt" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Payment_rentalId_idx" ON "Payment"("rentalId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "_Guarantor_AB_unique" ON "_Guarantor"("A", "B");

-- CreateIndex
CREATE INDEX "_Guarantor_B_index" ON "_Guarantor"("B");
