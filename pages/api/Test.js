import jwt from "next-auth/jwt";
import axios from "axios";
import aes from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

const secret = process.env.SECRET;

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });

  // Encrypt
  var ciphertext = aes.encrypt("my message", "secret key 123").toString();
  console.log(ciphertext);

  // Decrypt
  var bytes = aes.decrypt(ciphertext, "secret key 123");
  var originalText = bytes.toString(Utf8);

  console.log(originalText); // 'my message'

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
