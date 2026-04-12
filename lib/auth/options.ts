import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthenticateStaff } from '../application/AuthenticateStaff';
import { staffRepository, userAccountRepository } from '../infrastructure/repositories';
import { verifyPassword } from './password';
import { Role } from '../domain/staff/Role';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      staffId: string;
      tenantId: string;
      email: string;
      name: string;
      roles: Role[];
    };
  }

  interface User {
    id: string;
    staffId: string;
    tenantId: string;
    email: string;
    name: string;
    roles: Role[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    staffId: string;
    tenantId: string;
    roles: Role[];
  }
}

const authenticateStaff = new AuthenticateStaff(
  staffRepository,
  userAccountRepository,
  verifyPassword
);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@school.uk' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const result = await authenticateStaff.execute({
            email: credentials.email,
            password: credentials.password,
          });

          return {
            id: result.accountId,
            staffId: result.staffId,
            tenantId: result.tenantId,
            email: result.email,
            name: result.name,
            roles: result.roles,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.staffId = user.staffId;
        token.tenantId = user.tenantId;
        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.sub ?? '',
        staffId: token.staffId,
        tenantId: token.tenantId,
        email: token.email ?? '',
        name: token.name ?? '',
        roles: token.roles,
      };
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
};
