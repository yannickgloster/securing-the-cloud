import React, { useState } from "react";

import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import PageLayout from "../src/PageLayout";
import Footer from "../src/Footer";

export default function Index() {
  return (
    <PageLayout>
      <Typography variant="h3" gutterBottom>
        Securing the Cloud
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Encrypt your files on Google Drive and share them securely!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Securing the Cloud is a secure cloud storage application which secures
        files stored on Google Drive. Users can log in with their Google
        Account. Upon login, a folder named SECURE will be created in the user's
        root folder of Google Drive. When a user creates a group, a folder will
        be in the user's SECURE folder. The user can add & remove users from
        these groups. Files can be uploaded and downloaded to the group. All the
        files are encrypted when uploaded and decrypted when downloaded. If
        someone were to download the file from Google Drive, they would not be
        able to decrypt the file.
      </Typography>
      <Typography variant="h4" gutterBottom>
        Technical Description
      </Typography>
      <Typography variant="body1" gutterBottom>
        1. User account created
      </Typography>
      <Box ml={10}>
        <Typography variant="body1" gutterBottom>
          1.1. Public and private Keys are created for the user.
        </Typography>
        <Typography variant="body1" gutterBottom>
          1.2. The user's private key is encrypted with AES with the user's
          account.
        </Typography>
        <Typography variant="body1" gutterBottom>
          1.3. The Public & encrypted private user key are stored with the
          user's account.
        </Typography>
        <Typography variant="body1" gutterBottom>
          1.4. The SECURE folder is created on Google Drive and the ID of the
          folder is stored with the user.
        </Typography>
      </Box>
      <Typography variant="body1" gutterBottom>
        2. Group created
      </Typography>
      <Box ml={10}>
        <Typography variant="body1" gutterBottom>
          2.1. Public and private Keys are created for the group.
        </Typography>
        <Typography variant="body1" gutterBottom>
          2.2. The group private key is encrypted with the owner's public key
        </Typography>
        <Typography variant="body1" gutterBottom>
          2.3. The group public key is stored with the group and the encrypted
          private key is stored with the user and links back to the group.
        </Typography>
        <Typography variant="body1" gutterBottom>
          2.3. The group folder is created in the owner's folder and the group
          folder ID is stored with the group.
        </Typography>
      </Box>
      <Typography variant="body1" gutterBottom>
        3. User added to group
      </Typography>
      <Box ml={10}>
        <Typography variant="body1" gutterBottom>
          3.1. The user decrypts their own private key with their session.
        </Typography>

        <Typography variant="body1" gutterBottom>
          3.2. The user decrypts the group private key with their decrypted
          private key.
        </Typography>
        <Typography variant="body1" gutterBottom>
          3.3. The group private key is encrypted with public key of the user
          that is being added.
        </Typography>
        <Typography variant="body1" gutterBottom>
          3.3. The group folder is shared with the user through Google Drive
        </Typography>
      </Box>
      <Typography variant="body1" gutterBottom>
        4. User removed from group
      </Typography>
      <Box ml={10}>
        <Typography variant="body1" gutterBottom>
          4.1. The user's connection to the group is removed and their encrypted
          access to the group private key is removed.
        </Typography>
        <Typography variant="body1" gutterBottom>
          4.2. The user is unshared from the Google Drive folder.
        </Typography>
      </Box>
      <Typography variant="body1" gutterBottom>
        5. File Uploaded
      </Typography>
      <Box ml={10}>
        <Typography variant="body1" gutterBottom>
          5.1. The file is encrypted with the group's public key on the upload.
        </Typography>
        <Typography variant="body1" gutterBottom>
          5.2. The file is uploaded to the group folder in Google Drive.
        </Typography>
      </Box>
      <Typography variant="body1" gutterBottom>
        6. File Download
      </Typography>
      <Box ml={10}>
        <Typography variant="body1" gutterBottom>
          6.1. The user decrypts their own private key with their session.
        </Typography>
        <Typography variant="body1" gutterBottom>
          6.2. The user decrypts the group private key with their decrypted
          private key.
        </Typography>
        <Typography variant="body1" gutterBottom>
          6.3. The decrypted group private key is then used decrypt the file.
        </Typography>
        <Typography variant="body1" gutterBottom>
          6.4. Decrypted file is then sent to the user.
        </Typography>
      </Box>
      <br />
      <Footer />
    </PageLayout>
  );
}
