import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import bcrypt from 'bcrypt';

// const client = await clientPromise;
// const db = client.db();

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username',
          type: 'text',
          placeholder: 'username',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { username, password } = credentials;
        if (username === 'admin' && password === 'admin') {
          const user = { id: 1, name: 'Admin', role: 'admin'};
          return user;
        } else {
          return null;
        }
        // if (user) {
        //   //   Any object returned will be saved in `user` property of the JWT
        //   //   Get user from database
        //   //   const passwordMatches = await bcrypt.compare(password, user.rows[0].password);
        //   if (passwordMatches) {
        //     return user;
        //   } else {
        //     return null;
        //   }
        // } else {
        //   // If you return null then an error will be displayed advising the user to check their details.
        //   return null;
        //   // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        // }
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);