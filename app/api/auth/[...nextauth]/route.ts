import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      avatar: string; // Agregar esta línea
    };
  }

  interface User {
    id: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials || {};

        if (!email || !password) {
          throw new Error('Email y contraseña son requeridos');
        }

        const userDB = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!userDB) {
          throw new Error('Credenciales incorrectas');
        }

        const passwordMatch = await bcrypt.compare(password, userDB.password);

        if (!passwordMatch) {
          throw new Error('Credenciales incorrectas');
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
    signIn: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        // Obtener datos actualizados del usuario desde la base de datos
        const userDB = await prisma.user.findUnique({
          where: {
            email: session.user.email,
          },
          include: {
            userDetails: true,
          },
        });

        if (userDB) {
          session.user = {
            id: userDB.id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.userDetails?.avatar || '',
          };
        }
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
