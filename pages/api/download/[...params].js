import jwt from "next-auth/jwt";
import { getSession } from "next-auth/client";
import axios from "axios";
import fs from "fs";
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
      const path = "./downloads/" + fileInfo.data.name + ".encrypted";
      const location = fs.createWriteStream(path);
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

      console.log(path);

      // Please fix this you stupid
      await sleep(1000);

      const encryptedFile = fs.readFileSync(path);

      const fileDecrypted = crypt.decrypt(
        privateKeyDecrypted.message,
        encryptedFile.toString()
      );

      fs.writeFileSync(
        "./downloads/" + fileInfo.data.name,
        fileDecrypted.message,
        "hex"
      );

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
