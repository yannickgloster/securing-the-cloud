-- AlterTable
ALTER TABLE `groupprivatekey` MODIFY `encryptedPrivateKey` MEDIUMTEXT NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `publicKey` MEDIUMTEXT,
    MODIFY `encryptedPrivateKey` MEDIUMTEXT;
