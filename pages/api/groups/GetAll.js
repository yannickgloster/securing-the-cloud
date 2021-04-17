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
      const allGroups = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          groups: { include: { users: true } },
        },
      });

      res.status(200).json(allGroups.groups);
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
