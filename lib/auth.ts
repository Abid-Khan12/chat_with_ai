import { NextAuthOptions } from "next-auth";
import connectDB from "./db";
import UserModel, { IUser } from "@/models/user.model";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Username/Email",
          type: "text",
          placeholder: "Jhon or Jhon@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "***********",
        },
      },
      async authorize(credentials, req) {
        const identifier = credentials?.identifier;
        const password = credentials?.password;

        if (!identifier || !password) {
          throw new Error("Missing credentials");
        }

        try {
          await connectDB();

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          const isEmail = emailRegex.test(identifier);

          const user = await UserModel.findOne<IUser>(
            isEmail
              ? { email: identifier.toLowerCase() }
              : { userName: identifier.toLowerCase() },
          ).select("+password");

          if (!user) {
            throw new Error("User not found");
          }

          const isPassCorrect = await user.comparePassword(password);

          if (!isPassCorrect) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.userName,
            image: user.image_url,
          };
        } catch (error: any) {
          console.error("Login api error", error);
          throw new Error(error.message || "Login failed");
        }
      },
    }),
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
      }
      return true;
    },
    jwt({ user, token }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image as string;
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
