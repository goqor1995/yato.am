import { WithId, Document } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async (_req: any, res: { json: (arg0: WithId<Document>[]) => void }) => {
  try {
    const client = await clientPromise;
    const db = client.db('yatoam');

    const products = await db.collection('products').find({}).limit(10).toArray();

    res.json(products);
  } catch (e) {
    console.error(e);
  }
};
