import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.SKILLSWAP_DB || "skillswap_db");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  plugins: [jwt()],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "client",
      },
      skills: {
        type: "string",
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },
});
