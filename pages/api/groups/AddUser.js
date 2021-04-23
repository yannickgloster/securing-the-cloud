import jwt from "next-auth/jwt";
import axios from "axios";
import { getSession } from "next-auth/client";
import { PrismaClient } from "@prisma/client";

const secret = process.env.SECRET;
const prisma = new PrismaClient();

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });
  const session = await getSession({ req });

  if (token) {
    try {
      const getUser = await prisma.user.findUnique({
        where: { email: req.body.userEmail },
      });
      if (getUser != null) {
        const shareDrive = await axios.post(
          "https://www.googleapis.com/drive/v3/files/" +
            req.body.group.folderID +
            "/permissions",
          {
            role: "writer",
            type: "user",
            emailAddress: "glostery@tcd.ie",
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
                id: getUser.id,
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
