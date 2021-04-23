import jwt from "next-auth/jwt";
import axios from "axios";
import { getSession } from "next-auth/client";
import { PrismaClient } from "@prisma/client";
import { Crypt, RSA } from "hybrid-crypto-js";

const secret = process.env.SECRET;
const rsa = new RSA();

const generateKeyPair = () => {
  rsa.generateKeyPair(function (keyPair) {
    // Callback function receives new key pair as a first argument
    var publicKey = keyPair.publicKey;
    var privateKey = keyPair.privateKey;
  });
};

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

      const createGroup = await prisma.group.create({
        data: {
          name: req.body.name,
          folderID: createFolder.data.id,
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
