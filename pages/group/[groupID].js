import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import { signIn, signOut, useSession } from "next-auth/client";

import Button from "@material-ui/core/Button";

import { Crypt, RSA } from "hybrid-crypto-js";

import PageLayout from "../../src/PageLayout";
import Copyright from "../../src/Copyright";
import Files from "../../src/Files";

const GroupFiles = () => {
  const router = useRouter();
  const { groupID } = router.query;
  const [file, setFile] = useState(null);
  const [session, loading] = useSession();
  const rsa = new RSA();

  const selectFile = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("/api/UploadFiles", formData, {
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
      <Files groupID={groupID} />
    </PageLayout>
  );
};

export default GroupFiles;