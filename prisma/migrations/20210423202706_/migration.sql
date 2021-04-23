/*
  Warnings:

  - The primary key for the `GroupPrivateKey` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `userId` on table `GroupPrivateKey` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GroupPrivateKey" (
    "encryptedPrivateKey" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("groupId", "userId"),
    FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GroupPrivateKey" ("encryptedPrivateKey", "groupId", "userId") SELECT "encryptedPrivateKey", "groupId", "userId" FROM "GroupPrivateKey";
DROP TABLE "GroupPrivateKey";
ALTER TABLE "new_GroupPrivateKey" RENAME TO "GroupPrivateKey";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
