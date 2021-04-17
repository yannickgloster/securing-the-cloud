import jwt from "next-auth/jwt";
import axios from "axios";

const secret = process.env.SECRET;

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });
  if (token) {
    try {
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
