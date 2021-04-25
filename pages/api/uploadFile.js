import jwt from "next-auth/jwt";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import { getSession } from "next-auth/client";
import { PrismaClient } from "@prisma/client";
import { Crypt, RSA } from "hybrid-crypto-js";
import aes from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import os from "os";

const secret = process.env.SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir());
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

const prisma = new PrismaClient();
const rsa = new RSA();
const crypt = new Crypt();

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });
  const session = await getSession({ req });

  const group = await prisma.group.findUnique({
    where: { id: parseInt(req.headers.groupid) },
    include: {
      users: true,
    },
  });

  if (token && group.users.some((e) => e.id == session.user.id)) {
    try {
      upload.single("file")(req, {}, async (err) => {
        // Encrypt Files
        // Decrypt the group private key from the logged in user. Use the public key of the user who is given access to encrypt the group private key
        const getPrivateKey = await prisma.groupPrivateKey.findUnique({
          where: {
            groupId_userId: {
              groupId: parseInt(req.headers.groupid),
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

        const file = await fs.promises.readFile(req.file.path);
        const hexFile = file.toString("hex");
        const signature = crypt.signature(privateKeyDecrypted.message, hexFile);
        const encryptedFile = crypt.encrypt(
          group.publicKey,
          hexFile,
          signature
        );

        const encryptedFileBuffer = Buffer.from(encryptedFile);

        // Upload Metadata
        const metadata = await axios.post(
          "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
          {
            name: req.file.originalname,
            parents: [group.folderID],
          },
          {
            headers: {
              authorization: "Bearer " + token.accessToken,
              "X-Upload-Content-Type": "application/octet-stream",
              "X-Upload-Content-Length": encryptedFileBuffer.byteLength,
              "Content-Type": "application/json;charset=UTF-8",
            },
          }
        );

        // Upload files to the metadata location
        const resp = await axios.post(
          metadata.headers.location,
          encryptedFileBuffer,
          {
            headers: {
              authorization: "Bearer " + token.accessToken,
              "Content-Type": "application/octet-stream",
              "Content-Length": encryptedFileBuffer.byteLength,
            },
          }
        );

        // Delete File
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          // File removed
        });
      });
      res.status(201);
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
