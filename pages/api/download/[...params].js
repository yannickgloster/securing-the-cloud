import jwt from "next-auth/jwt";
import { getSession } from "next-auth/client";
import axios from "axios";
import fs from "fs";
import path from "path";
import { Crypt, RSA } from "hybrid-crypto-js";
import { PrismaClient } from "@prisma/client";

const secret = process.env.SECRET;
const rsa = new RSA();
const crypt = new Crypt();
const prisma = new PrismaClient();

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

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

      const privateKeyDecrypted = crypt.decrypt(
        currentUser.privateKey,
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
      file.data.pipe(location);

      // Please fix this you stupid
      await sleep(1000);

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
