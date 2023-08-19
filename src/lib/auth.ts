import { NextAuthOptions, getServerSession } from "next-auth";
import { db } from "./db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { nanoid } from "nanoid";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        console.log("-------------------Token: ", token);
        console.log("-------------------Session: ", session);
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.name = token.name;
        // @ts-ignore
        session.user.email = token.email;
        // @ts-ignore
        session.user.image = token.picture;
        // @ts-ignore
        session.user.username = token.username;
      }

      return session;
    },

    async jwt({ token, user }) {
      const foundUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!foundUser) {
        token.id = user!.id;
        return token;
      }

      if (!foundUser.username) {
        await db.user.update({
          where: {
            id: foundUser!.id,
          },
          data: {
            username: nanoid(19),
          },
        });
      }

      return {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        picture: foundUser.image,
        username: foundUser.username,
      };
    },

    redirect() {
      return "/";
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
