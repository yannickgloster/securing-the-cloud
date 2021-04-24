import jwt from "next-auth/jwt";
import { getSession } from "next-auth/client";
import axios from "axios";
import fs from "fs";
import path from "path";
import { Crypt } from "hybrid-crypto-js";
import { PrismaClient } from "@prisma/client";
import aes from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

const secret = process.env.SECRET;
const crypt = new Crypt();
const prisma = new PrismaClient();

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });
  const session = await getSession({ req });
  const groupID = req.query.params[0];
  const fileID = req.query.params[1];

  if (token) {
    try {
      // Decrypt the group private key from the logged in user. Use the public key of the user who is given access to encrypt the group private key
      const getPrivateKey = await prisma.groupPrivateKey.findUnique({
        where: {
          groupId_userId: {
            groupId: parseInt(groupID),
            userId: session.user.id,
          },
        },
      });

      const currentUser = await prisma.user.findUnique({
        where: { id: session.user.id },
      });

      // Decrypt user Private Key
      const userAccount = await prisma.account.findFirst({
        where: { userId: session.user.id, providerId: "google" },
      });

      const bytes = aes.decrypt(
        currentUser.encryptedPrivateKey,
        userAccount.accessToken
      );
      const decryptedUserPrivateKey = bytes.toString(Utf8);

      const privateKeyDecrypted = crypt.decrypt(
        decryptedUserPrivateKey,
        getPrivateKey.encryptedPrivateKey
      );

      const fileInfo = await axios.get(
        "https://www.googleapis.com/drive/v3/files/" + fileID,
        {
          headers: {
            authorization: "Bearer " + token.accessToken,
          },
        }
      );
      const downloadPath = path.join(
        process.cwd(),
        "downloads",
        fileInfo.data.name + ".encrypted"
      );
      const location = fs.createWriteStream(downloadPath);
      const file = await axios.get(
        "https://www.googleapis.com/drive/v3/files/" + fileID + "?alt=media",

        {
          headers: {
            authorization: "Bearer " + token.accessToken,
          },
          responseType: "stream",
        }
      );
      await new Promise(function (resolve) {
        file.data.pipe(location);
        file.data.on("end", resolve);
      });

      const encryptedFile = fs.readFileSync(downloadPath);

      const fileDecrypted = crypt.decrypt(
        privateKeyDecrypted.message,
        encryptedFile.toString()
      );

      const decryptedFilePath = path.join(
        process.cwd(),
        "downloads",
        fileInfo.data.name
      );

      fs.writeFileSync(decryptedFilePath, fileDecrypted.message, "hex");

      res.setHeader("Content-Type", fileInfo.data.mimeType);
      res.setHeader("Name", fileInfo.data.name);
      const decryptedBuffer = fs.readFileSync(decryptedFilePath);
      res.send(decryptedBuffer);

      // Delete File
      fs.unlink(downloadPath, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        // File removed
      });

      // Delete File
      fs.unlink(decryptedFilePath, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        // File removed
      });

      res.status(200);
    } catch (e) {
      console.log(e);
      res.status(401);
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
};
