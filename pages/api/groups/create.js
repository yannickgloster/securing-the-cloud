import jwt from "next-auth/jwt";
import axios from "axios";
import { getSession } from "next-auth/client";
import { PrismaClient } from "@prisma/client";
import { Crypt, RSA } from "hybrid-crypto-js";

const secret = process.env.SECRET;
const rsa = new RSA();
const crypt = new Crypt();

const prisma = new PrismaClient();

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });
  const session = await getSession({ req });

  if (token) {
    try {
      const createFolder = await axios.post(
        "https://www.googleapis.com/drive/v3/files",
        {
          name: req.body.name,
          mimeType: "application/vnd.google-apps.folder",
          parents: [session.user.folderID],
        },
        {
          headers: {
            authorization: "Bearer " + token.accessToken,
          },
        }
      );

      rsa.generateKeyPair(async function (keyPair) {
        // Create group and store public key in group
        const createGroup = await prisma.group.create({
          data: {
            name: req.body.name,
            folderID: createFolder.data.id,
            publicKey: keyPair.publicKey,
            owner: {
              connect: {
                id: session.user.id,
              },
            },
            users: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });

        // Encrypt the group private key with the user's public key and store the group's encrypted private key with the user
        const storeGroupPrivateKey = await prisma.groupPrivateKey.create({
          data: {
            encryptedPrivateKey: crypt.encrypt(
              session.user.publicKey,
              keyPair.privateKey
            ),
            group: {
              connect: {
                id: createGroup.id,
              },
            },
            user: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });
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
