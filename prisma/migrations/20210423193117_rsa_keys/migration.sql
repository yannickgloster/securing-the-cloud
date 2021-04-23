/*
  Warnings:

  - Added the required column `publicKey` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN "publicKey" TEXT;
ALTER TABLE "users" ADD COLUMN "privateKey" TEXT;

-- CreateTable
CREATE TABLE "GroupPrivateKey" (
    "encryptedPrivateKey" TEXT NOT NULL PRIMARY KEY,
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER,
    FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "folder_id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Group" ("id", "name", "folder_id", "ownerId") SELECT "id", "name", "folder_id", "ownerId" FROM "Group";
DROP TABLE "Group";
ALTER TABLE "new_Group" RENAME TO "Group";
CREATE UNIQUE INDEX "Group.folder_id_unique" ON "Group"("folder_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
