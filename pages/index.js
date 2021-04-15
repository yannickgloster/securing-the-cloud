import React, { useState } from "react";
import axios from "axios";

import { signIn, signOut, useSession } from "next-auth/client";

import Button from "@material-ui/core/Button";

import { Crypt, RSA } from "hybrid-crypto-js";

import PageLayout from "../src/PageLayout";
import Copyright from "../src/Copyright";
import Files from "../src/Files";

export default function Index() {
  const [file, setFile] = useState(null);
  const [session, loading] = useSession();
  const rsa = new RSA();

  const selectFile = (event) => {
    console.log("hi");
    setFile(event.target.files[0]);
    console.log(event.target.files[0]);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("http://localhost:3000/api/FileUpload", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const generateKeyPair = () => {
    rsa.generateKeyPair(function (keyPair) {
      // Callback function receives new key pair as a first argument
      var publicKey = keyPair.publicKey;
      var privateKey = keyPair.privateKey;
    });
  };

  return (
    <PageLayout>
      <input
        style={{ display: "none" }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={selectFile}
      />
      <label htmlFor="raised-button-file">
        <Button color="secondary" component="span" variant="contained">
          Select
        </Button>
      </label>
      <Button
        color="secondary"
        component="span"
        variant="contained"
        onClick={uploadFile}
      >
        Test Upload
      </Button>
      <Files />
    </PageLayout>
  );
}
