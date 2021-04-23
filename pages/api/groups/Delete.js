import jwt from "next-auth/jwt";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const secret = process.env.SECRET;
const prisma = new PrismaClient();

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });

  if (token) {
    try {
      const deleteFolder = await axios.delete(
        "https://www.googleapis.com/drive/v3/files/" + req.body.folderID,
        {
          headers: {
            authorization: "Bearer " + token.accessToken,
          },
        }
      );

      const deleteGroup = await prisma.group.delete({
        where: {
          id: req.body.id,
        },
      });

      res.status(200);
    } catch (e) {
      // console.log(e);
      res.status(401);
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
};
