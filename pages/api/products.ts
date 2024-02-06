import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import clientPromise from '../../lib/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db();

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Հարկավոր է գրանցվել' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const result = await db.collection('products').find({}).toArray();
        res.json(result);
      } catch (error) {
        res.json(error);
      }
      break;
    case 'POST':
      try {
        const result = await db.collection('products').insertOne(req.body);
        res.json(result);
      } catch (error) {
        res.json(error);
      }
      break;
    case 'DELETE':
      try {
        const result = await db.collection('products').deleteOne({ _id: new ObjectId(req.body._id) });
        res.json(result);
      } catch (error) {
        res.json(error);
      }
      break;
    default:
      res.json({ message: 'Գործողությունը հնարավոր չէ կատարել' });
      break;
  }
};
