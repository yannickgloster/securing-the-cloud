import jwt from "next-auth/jwt";
import axios from "axios";
import { getSession } from "next-auth/client";
import { PrismaClient } from "@prisma/client";

const secret = process.env.SECRET;

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });
  const session = await getSession({ req });

  if (token) {
    try {
      const resp = await axios.get(
        "https://www.googleapis.com/drive/v3/files?q='" +
          session.user.folderID +
          "' in parents",

        {
          headers: {
            authorization: "Bearer " + token.accessToken,
          },
        }
      );

      res.status(200).json(resp.data.files);
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
