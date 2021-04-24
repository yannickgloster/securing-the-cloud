import jwt from "next-auth/jwt";
import axios from "axios";
import { getSession } from "next-auth/client";
import { PrismaClient } from "@prisma/client";

const secret = process.env.SECRET;
const prisma = new PrismaClient();

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });
  const session = await getSession({ req });
  const { groupID } = req.query;

  const group = await prisma.group.findUnique({
    where: { id: parseInt(groupID) },
    include: {
      users: true,
    },
  });

  if (token && group.users.some((e) => e.id == session.user.id)) {
    try {
      const resp = await axios.get(
        "https://www.googleapis.com/drive/v3/files?q='" +
          group.folderID +
          "' in parents",
        {
          headers: {
            authorization: "Bearer " + token.accessToken,
          },
        }
      );

      res.status(200).json({ name: group.name, files: resp.data.files });
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
