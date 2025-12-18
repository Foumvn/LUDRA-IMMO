// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { mockUsers, testAccounts } from '@/data/users';

const authOptions = {
  providers: [
    {
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Vérification des identifiants
        const userAccount = testAccounts.find(
          account => account.email === credentials.email
        );

        if (!userAccount) {
          return null;
        }

        // Vérifier le mot de passe
        if (userAccount.password !== credentials.password) {
          return null;
        }

        // Trouver les détails complets de l'utilisateur
        const user = mockUsers.find(u => u.email === credentials.email);
        
        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified,
        };
      }
    }
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Au premier sign-in, user est défini
      if (user) {
        token.role = user.role;
        token.phone = user.phone;
        token.emailVerified = user.emailVerified;
        token.phoneVerified = user.phoneVerified;
      }
      return token;
    },
    async session({ session, token }) {
      // Envoyer les propriétés au client
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.phone = token.phone as string;
        session.user.emailVerified = token.emailVerified as boolean;
        session.user.phoneVerified = token.phoneVerified as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  secret: process.env.NEXTAUTH_SECRET || 'votre-secret-de-fallback-pour-developpement',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };