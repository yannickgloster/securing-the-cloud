import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";

import Models from "../../../models";

import { Crypt, RSA } from "hybrid-crypto-js";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationUrl:
        "https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code",
      scope:
        "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.file",
    }),
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      // Add access_token to the token right after signin
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
    // Enable debug messages in the console if you are having problems
    debug: true,
  },

  events: {
    async createUser(message) {
      console.log(message);
    },
  },

  adapter: Adapters.TypeORM.Adapter(
    // The first argument should be a database connection string or TypeORM config object
    process.env.DATABASE_URL,
    // The second argument can be used to pass custom models and schemas
    {
      models: {
        Group: Models.Group,
        GroupUser: Models.GroupUser,
      },
    }
  ),

  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
  secret: process.env.SECRET,
});
