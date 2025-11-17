/*
  Warnings:

  - You are about to drop the column `tipo` on the `WordTemplate` table. All the data in the column will be lost.
  - Added the required column `type` to the `WordTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WordTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "variables" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WordTemplate" ("content", "createdAt", "description", "id", "name", "updatedAt", "variables") SELECT "content", "createdAt", "description", "id", "name", "updatedAt", "variables" FROM "WordTemplate";
DROP TABLE "WordTemplate";
ALTER TABLE "new_WordTemplate" RENAME TO "WordTemplate";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
