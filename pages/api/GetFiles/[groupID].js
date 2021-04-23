import jwt from "next-auth/jwt";
import axios from "axios";
import { getSession } from "next-auth/client";
import { PrismaClient } from "@prisma/client";

const secret = process.env.SECRET;

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });
  const session = await getSession({ req });
  const prisma = new PrismaClient();
  const { groupID } = req.query;

  if (token) {
    try {
      const getGroup = await prisma.group.findUnique({
        where: { id: parseInt(groupID) },
      });
      const resp = await axios.get(
        "https://www.googleapis.com/drive/v3/files?q='" +
          getGroup.folderID +
          "' in parents",
        {
          headers: {
            authorization: "Bearer " + token.accessToken,
          },
        }
      );

      res.status(200).json(resp.data.files);
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
