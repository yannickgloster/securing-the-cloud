import jwt from "next-auth/jwt";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import { getSession } from "next-auth/client";
import { PrismaClient } from "@prisma/client";

const secret = process.env.SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

const prisma = new PrismaClient();

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });
  const session = await getSession({ req });

  if (token) {
    try {
      upload.single("file")(req, {}, async (err) => {
        // Encrypt Files

        // Upload Metadata
        const metadata = await axios.post(
          "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
          {
            name: req.file.originalname,
            parents: [session.user.folderID],
          },
          {
            headers: {
              authorization: "Bearer " + token.accessToken,
              "X-Upload-Content-Type": req.file.mimetype,
              "X-Upload-Content-Length": req.file.size,
              "Content-Type": "application/json;charset=UTF-8",
            },
          }
        );

        // Upload files to the metadata location
        const resp = await axios.post(
          metadata.headers.location,
          fs.readFileSync(req.file.path),
          {
            headers: {
              authorization: "Bearer " + token.accessToken,
              "Content-Type": req.file.mimetype,
              "Content-Length": req.file.size,
            },
          }
        );

        // Test Sharing

        // const testShare = await axios.post(
        //   "https://www.googleapis.com/drive/v3/files/" +
        //     resp.data.id +
        //     "/permissions",
        //   {
        //     role: "writer",
        //     type: "user",
        //     emailAddress: "glostery@tcd.ie",
        //   },
        //   {
        //     headers: {
        //       authorization: "Bearer " + token.accessToken,
        //     },
        //   }
        // );

        // const perms = await axios.get(
        //   "https://www.googleapis.com/drive/v3/files/" +
        //     resp.data.id +
        //     "/permissions",
        //   {
        //     headers: {
        //       authorization: "Bearer " + token.accessToken,
        //     },
        //   }
        // );

        // console.log(perms.data);

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