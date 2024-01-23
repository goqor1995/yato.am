import { Document, InsertOneResult, ObjectID, ObjectId, UpdateResult } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async (req: any, res: { json: (arg0: any) => void }) => {
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
