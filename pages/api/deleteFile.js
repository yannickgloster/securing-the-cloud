import jwt from "next-auth/jwt";
import axios from "axios";

const secret = process.env.SECRET;

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });
  if (token) {
    try {
      const resp = await axios.delete(
        "https://www.googleapis.com/drive/v3/files/" + req.body.id,
        {
          headers: {
            authorization: "Bearer " + token.accessToken,
          },
        }
      );
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
