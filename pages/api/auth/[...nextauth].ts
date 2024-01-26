import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import clientPromise from '../../../lib/mongodb';

const client = await clientPromise;
const db = client.db();

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
      async authorize(credentials) {
        if(!credentials) {
          throw new Error('Missing credentials');
        }
        const { name,  username, password } = credentials;
        try {
          const user = await db.collection('users').findOne({username});

          if(user) {
            const passwordMatches = await compare(password, user.hashedPassword)
            if (passwordMatches) {
              return {
                id: user._id,
                name: user.name,
                username: user.username
              };
            } else {
              throw new Error('Invalid password');
            }
          } else {
            throw new Error('User not found');
          }
        } 
        catch (error) {
          console.error('Authorization error:', error);
          throw new Error('Authorization failed');
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      await console.log("user:", user,"token", token);
      session.user = {...session.user, ...user};
      return session;
    },
  },
};

export default NextAuth(authOptions);


// import { AuthOptions } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import { compare } from 'bcrypt'; // Import the compare function from bcrypt

// export const authOptions: AuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         username: {
//           label: 'Username',
//           type: 'text',
//           placeholder: 'username',
//         },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         const { username, password } = credentials;

        
//         const user = 

//         if (!user) {
//           return null; // User not found
//         }

//         // Compare the provided password with the hashed password from the database
//         const passwordMatches = await compare(password, user.hashedPassword);

//         if (passwordMatches) {
//           return user; // Return the user if the passwords match
//         } else {
//           return null; // Return null if passwords do not match
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, token, user }) {
//       session.accessToken = token.accessToken;
//       return session;
//     },
//   },
// };

// export default NextAuth(authOptions);
