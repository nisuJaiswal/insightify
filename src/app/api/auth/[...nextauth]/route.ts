
import { oathOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

const handler = NextAuth(oathOptions)

export {handler as GET, handler as POST}