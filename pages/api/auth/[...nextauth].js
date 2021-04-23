import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";

import axios from "axios";

import { PrismaClient } from "@prisma/client";

import { Crypt, RSA } from "hybrid-crypto-js";

const prisma = new PrismaClient();
const rsa = new RSA();

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // authorizationUrl:
      //   "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code",
      scope:
        "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive",
    }),
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      if (isNewUser) {
        try {
          const folder = await axios.post(
            "https://www.googleapis.com/drive/v3/files",
            {
              name: "SECURE",
              mimeType: "application/vnd.google-apps.folder",
            },
            {
              headers: {
                authorization: "Bearer " + account.accessToken,
              },
            }
          );
          rsa.generateKeyPair(async function (keyPair) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                folderID: folder.data.id,
                publicKey: keyPair.publicKey,
                privateKey: keyPair.privateKey,
              },
            });
          });
        } catch (error) {
          console.log(error);
          console.log("Couldn't create folder");
        }
      }

      // Add access_token to the token right after signin
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }

      return token;
    },
    session: async (session, user) => {
      const customSession = session;
      const getUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      customSession.user.folderID = getUser.folderID;
      customSession.user.publicKey = getUser.publicKey;
      customSession.user.id = Number(user.sub);
      return customSession;
    },
  },

  events: {
    async createUser(message) {},
  },

  adapter: Adapters.Prisma.Adapter({
    prisma,
    modelMapping: {
      User: "user",
      Account: "account",
      Session: "session",
      VerificationRequest: "verificationRequest",
    },
  }),

  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
  secret: process.env.SECRET,

  // Enable debug messages in the console if you are having problems
  debug: false,
});
