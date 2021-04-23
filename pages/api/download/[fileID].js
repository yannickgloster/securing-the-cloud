import jwt from "next-auth/jwt";
import axios from "axios";
import fs from "fs";
import { Crypt, RSA } from "hybrid-crypto-js";

const secret = process.env.SECRET;
const rsa = new RSA();
const crypt = new Crypt();

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });
  const { fileID } = req.query;
  if (token) {
    try {
      const fileInfo = await axios.get(
        "https://www.googleapis.com/drive/v3/files/" + fileID,
        {
          headers: {
            authorization: "Bearer " + token.accessToken,
          },
        }
      );
      const location = fs.createWriteStream("downloads/" + fileInfo.data.name);
      const file = await axios.get(
        "https://www.googleapis.com/drive/v3/files/" + fileID + "?alt=media",

        {
          headers: {
            authorization: "Bearer " + token.accessToken,
          },
          responseType: "stream",
        }
      );
      file.data.pipe(location);

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
