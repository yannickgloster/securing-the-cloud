import jwt from "next-auth/jwt";
import axios from "axios";
import { getSession } from "next-auth/client";
import { PrismaClient } from "@prisma/client";
import { Crypt, RSA } from "hybrid-crypto-js";

const secret = process.env.SECRET;
const prisma = new PrismaClient();
const rsa = new RSA();
const crypt = new Crypt();

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });
  const session = await getSession({ req });

  if (token) {
    try {
      const shareUser = await prisma.user.findUnique({
        where: { email: req.body.userEmail },
      });
      if (shareUser != null) {
        const shareDrive = await axios.post(
          "https://www.googleapis.com/drive/v3/files/" +
            req.body.group.folderID +
            "/permissions",
          {
            role: "writer",
            type: "user",
            emailAddress: shareUser.email,
          },
          {
            headers: {
              authorization: "Bearer " + token.accessToken,
            },
          }
        );

        await prisma.group.update({
          where: { id: req.body.group.id },
          data: {
            users: {
              connect: {
                id: shareUser.id,
              },
            },
          },
        });

        // Decrypt the group private key from the logged in user. Use the public key of the user who is given access to encrypt the group private key
        const getPrivateKey = await prisma.groupPrivateKey.findUnique({
          where: {
            groupId_userId: {
              groupId: req.body.group.id,
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

        // Encrypt the group private key with the user's public key and store the group's encrypted private key with the user
        const storeGroupPrivateKey = await prisma.groupPrivateKey.create({
          data: {
            encryptedPrivateKey: crypt.encrypt(
              shareUser.publicKey,
              privateKeyDecrypted.message
            ),
            group: {
              connect: {
                id: req.body.group.id,
              },
            },
            user: {
              connect: {
                id: shareUser.id,
              },
            },
          },
        });

        res.status(200);
      } else {
        res.status(404).send("User not found.");
      }
    } catch (e) {
      console.log(e);
      res.status(401).send("Unauthorized.");
    }
  } else {
    // Not Signed in
    res.status(401).send("You must be logged in to do this.");
  }
  res.end();
};
