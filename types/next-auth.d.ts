import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    prompt: string;
  }
  interface Session {
    user: {
      id: string;
      prompt: string;
    } & DefaultSession["user"];
  }
}
