import NextAuth, { AuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import clientPromise from '../../../lib/mongodb';

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: {
          label: 'Name',
          type: 'text',
          placeholder: 'name',
        },
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'username',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        const client = await clientPromise;
        const db = client.db();
        if (!credentials) {
          throw new Error('Missing credentials');
        }
        const { username, password } = credentials;
        try {
          const user = await db.collection('users').findOne({ username });
          if (user) {
            const passwordMatches = await compare(password, user.hashedPassword);
            if (passwordMatches) {
              return {
                id: user._id.toString(),
                name: user.name,
                username: user.username,
              } as User;
            } else {
              throw new Error('Invalid password');
            }
          } else {
            throw new Error('User not found');
          }
        } catch (error) {
          console.error('Authorization error:', error);
          throw new Error('Authorization failed');
        }
      },
    }),
  ],
  session: {
    // Set it as jwt instead of database
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (user) {
        token.accessToken = user.access_token;
        token.username = user.username;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken;
      session.user.username = token.username;
      session.user.id = token.id;

      return session;
    },
  },
};

export default NextAuth(authOptions);
