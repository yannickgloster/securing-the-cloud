import axios from "axios";
import { Crypt, RSA } from "hybrid-crypto-js";

var crypt = new Crypt();
var rsa = new RSA();

export default async (req, res) => {
  var message = "Hello world!";
  rsa.generateKeyPairAsync().then((keyPair) => {
    var publicKey = keyPair.publicKey;
    var privateKey = keyPair.privateKey;

    var signature = crypt.signature(privateKey, message);
    var encrypted = crypt.encrypt(publicKey, message, signature);
    // console.log(encrypted);

    var decrypted = crypt.decrypt(privateKey, encrypted);

    console.log(decrypted);
    res.send(decrypted);
    res.end();
  });
};
