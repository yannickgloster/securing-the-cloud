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
      const perms = await axios.get(
        "https://www.googleapis.com/drive/v3/files/" +
          req.body.group.folderID +
          "/permissions?fields=permissions(kind,id,emailAddress,displayName)",
        {
          headers: {
            authorization: "Bearer " + token.accessToken,
          },
        }
      );

      const permsUser = perms.data.permissions.find((perms) => {
        return perms.emailAddress === req.body.user.email;
      });

      const deletePerms = await axios.delete(
        "https://www.googleapis.com/drive/v3/files/" +
          req.body.group.folderID +
          "/permissions/" +
          permsUser.id,
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
            disconnect: {
              id: req.body.user.id,
            },
          },
        },
      });

      res.status(200);
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
