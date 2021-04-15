import jwt from "next-auth/jwt";
import axios from "axios";

const secret = process.env.SECRET;

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });
  if (token) {
    // Signed in
    console.log("JSON Web Token", JSON.stringify(token, null, 2));
    try {
      const res = await axios.post(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=media",
        "test",
        {
          headers: {
            authorization: "Bearer " + token.accessToken,
            "Content-Type": "text/plain",
          },
        }
      );
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
};
