import jwt from "next-auth/jwt";
import axios from "axios";
import { Crypt, RSA } from "hybrid-crypto-js";

const secret = process.env.SECRET;
const rsa = new RSA();
const crypt = new Crypt();

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret });

  var rsa = new RSA();

  rsa.generateKeyPair(function (keyPair) {
    // Callback function receives new key pair as a first argument
    var publicKey1 = keyPair.publicKey;
    var privateKey1 = keyPair.privateKey;
    rsa.generateKeyPair(function (keyPair) {
      // Callback function receives new key pair as a first argument
      var publicKey2 = keyPair.publicKey;
      var privateKey2 = keyPair.privateKey;
      var message = "Hello world!";
      var encrypted = crypt.encrypt([publicKey1, publicKey2], message);
      console.log(encrypted);
      var decrypted = crypt.decrypt(privateKey1, encrypted);

      console.log(decrypted);
    });
  });

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
