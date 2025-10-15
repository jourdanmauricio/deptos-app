import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials || {};

        if (!email || !password) {
          throw new Error("Email y contraseña son requeridos");
        }

        const userDB = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!userDB) {
          throw new Error("Credenciales incorrectas");
        }

        const passwordMatch = await bcrypt.compare(password, userDB.password);

        if (!passwordMatch) {
          throw new Error("Credenciales incorrectas");
        }

        return {
          id: userDB.id,
          name: userDB.name,
          email: userDB.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
});

export { handler as GET, handler as POST };
