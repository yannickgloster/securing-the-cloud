# Securing the Cloud

### Built for [CSU34031 Advanced Telecommunications](https://teaching.scss.tcd.ie/module/csu34031-advanced-telecommunications/)

Encrypt your files on Google Drive and share them securely!

Securing the Cloud is a secure cloud storage application which secures files stored on Google Drive. Users can log in with their Google Account. Upon login, a folder named SECURE will be created in the user's root folder of Google Drive. When a user creates a group, a folder will be in the user's SECURE folder. The user can add & remove users from these groups. Files can be uploaded and downloaded to the group. All the files are encrypted when uploaded and decrypted when downloaded. If someone were to download the file from Google Drive, they would not be able to decrypt the file.

## Local Dev Installation

1. Install [Node.js](https://nodejs.org)
2. Clone this repository
3. Rename `.env.example` to `.env.local` and fill in the config
   1. Get [Google API token and App](https://console.cloud.google.com/apis/credentials) with Scopes:
      ```
      https://www.googleapis.com/auth/userinfo.profile
      https://www.googleapis.com/auth/userinfo.email
      https://www.googleapis.com/auth/drive
      ```
4. Open up command prompt or teminal and navigate to the location of the cloned repository

5. Install the dependencies

   ```Shell Session
   npm install
   ```

6. Setup the database with [Prisma](https://www.prisma.io/)

   ```Shell Session
   npx prisma generate; npx prisma migrate dev --preview-feature
   ```

7. Running the server locally

   ```Shell Session
   npm run dev
   ```

   The server should now be hosted on [http://localhost:3000](http://localhost:3000)

## Technical Description

1. User account created

   1. Public and private Keys are created for the user.
   2. The user's private key is encrypted with AES with the user's account.
   3. The public & encrypted private user key are stored with the user's account.
   4. The SECURE folder is created on Google Drive and the ID of the folder is stored with the user.

2. Group created

   1. Public and private keys are created for the group.
   2. The group private key is encrypted with the owner's public key
   3. The group public key is stored with the group and the encrypted private key is stored with the user and links back to the group.
   4. The group folder is created in the owner's folder and the group folder ID is stored with the group.

3. User added to group

   1. The user decrypts their own private key with their session.
   2. The user decrypts the group private key with their decrypted private key.
   3. The group private key is encrypted with public key of the user that is being added.
   4. The group folder is shared with the user through Google Drive

4. User removed from group

   1. The user's connection to the group is removed and their encrypted access to the group private key is removed.
   2. The user is unshared from the Google Drive folder.

5. File Uploaded

   1. The file is encrypted with the group's public key on the upload.
   2. The file is uploaded to the group folder in Google Drive.

6. File Download
   1. The user decrypts their own private key with their session.
   2. The user decrypts the group private key with their decrypted private key.
   3. The decrypted group private key is then used decrypt the file.
   4. Decrypted file is then sent to the user.
