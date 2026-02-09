import { NextAuthOptions } from "next-auth";
import connectDB from "./db";
import UserModel, { IUser } from "@/models/user.model";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider === "google") {
        await connectDB();

        let exitUser = await UserModel.findOne<IUser>({ email: user.email });

        if (!exitUser) {
          const userData = {
            userName: user.name,
            email: user.email,
            image_url: user.image,
          };

          exitUser = await UserModel.create(userData);
        }

        user.id = exitUser?._id as string;
        user.prompt = exitUser?.personalizationPrompt as string;
      }
      return true;
    },
    jwt({ user, token, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.prompt = user.prompt;
      }

      if (trigger === "update" && session.prompt !== "") {
        token.prompt = session.prompt;
      }

      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image as string;
        session.user.prompt = (token.prompt as string) || "";
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 * 1000,
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
