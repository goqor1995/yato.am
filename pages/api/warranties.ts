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
    return res.status(401).json({ message: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const result = await db.collection('warranties').find({}).toArray();
        res.json(result);
      } catch (error) {
        res.json(error);
      }
      break;
    case 'POST':
      try {
        const result = await db.collection('warranties').insertOne(req.body);
        res.json(result);
      } catch (error) {
        res.json(error);
      }
      break;
    case 'PUT':
      try {
        const result = await db.collection('warranties').updateOne(
          { _id: req.body._id },
          {
            $set: {
              name: req.body.name,
              description: req.body.description,
              price: req.body.price,
              duration: req.body.duration,
            },
          }
        );
        res.json(result);
      } catch (error) {
        res.json(error);
      }
      break;
    case 'DELETE':
      try {
        const result = await db.collection('warranties').deleteOne({ _id: new ObjectId(req.body._id) });
        res.json(result);
      } catch (error) {
        res.json(error);
      }
      break;
    default:
      res.json({ message: 'Method not allowed' });
      break;
  }
};
