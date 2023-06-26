import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    username?: string | null;
  }
}
declare module "next-auth" {
  interface Session {
    id: UserId;
    username?: string | null;
  }
}
