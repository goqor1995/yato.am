import { hash } from 'bcrypt';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db();

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'POST':
      try {
        const { name, username, password } = req.body;

        if (!name || !username || !password) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        await db.collection('users').createIndex({ username: 1 }, { unique: true });

        const hashedPassword = await hash(password, 10);

        const result = await db.collection('users').insertOne({
          name,
          username,
          hashedPassword,
        });

        res.status(201).json(result);
      } catch (error: any) {
        if (error.code === 11000) {
          res.status(409).json({ error: 'User already exists' });
        } else {
          res.status(400).json({ error: error });
        }
      }
      break;

    case 'DELETE':
      try {
        await db.collection('users').deleteOne({ _id: new ObjectId(req.body._id) });
        res.json({ message: 'success' });
      } catch (error) {
        res.json(error);
      }
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}
