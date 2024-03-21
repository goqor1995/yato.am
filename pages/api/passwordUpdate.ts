import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcrypt';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ message: 'Լրացրեք բոլոր դաշտերը' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const hashedPassword = await hash(newPassword, 10);

    await db.collection('users').updateOne(
      { _id: userId },
      { $set: { hashedPassword } }
    );

    return res.status(200).json({ message: 'Գաղտնաբառը հաջողությամբ թարմացված է' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Գործողությունը հնարավոր չէ կատարել' });
  }
}
