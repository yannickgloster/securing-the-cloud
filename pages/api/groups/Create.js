import jwt from "next-auth/jwt";
import axios from "axios";
import { getSession } from "next-auth/client";
import { PrismaClient } from "@prisma/client";

const secret = process.env.SECRET;

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });
  const session = await getSession({ req });
  const prisma = new PrismaClient();

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
