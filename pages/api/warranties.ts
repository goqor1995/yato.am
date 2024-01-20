import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';
// import { getServerSession } from 'next-auth';
// import { authOptions } from './auth/[...nextauth]';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // const session = await getServerSession(req, res, authOptions);
  console.log(req);

  const client = await clientPromise;
  const db = client.db();
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
        // if (user.role !== 'admin') {
        //   res.json({ message: 'You are not authorized to add a warranty' });
        //   return;
        // }
        const result = await db.collection('warranties').insertOne(req.body);
        console.log('inserted', result);
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
        console.log(req);
        const result = await db.collection('warranties').deleteOne({ _id: new ObjectId(req.body._id) });
        console.log('deleted', result);
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
