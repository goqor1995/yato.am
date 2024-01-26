import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { hash } from 'bcrypt';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db();

  switch (req.method) {
    case 'GET':
      try {
        const result = await db.collection('users').find({}).toArray();
        res.json(result);
      } catch (error) {
        res.json(error);
      }
      break;

    case 'POST':
      try {
        const { name, username, password } = req.body;

        if (!name || !username || !password) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const exists = await db.collection('users').findOne({ username });

        if (exists) {
          return;
        }

        await db.collection('users').createIndex({ username: 1 }, { unique: true });

        const hashedPassword = await hash(password, 10);

        const result = await db.collection('users').insertOne({
          name,
          username,
          hashedPassword,
        });

        return res.status(201).json(result);
      } catch (error) {
        console.error('Error registering user:', error);
        return res.status(400).json({ error: error });
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
