// import { Document, InsertOneResult, ObjectID, ObjectId, UpdateResult } from 'mongodb';
// import clientPromise from '../../lib/mongodb';

// export default async (req: any, res: { json: (arg0: any) => void }) => {
//   const client = await clientPromise;
//   const db = client.db();
//   switch (req.method) {
//     case 'GET':
//       try {
//         const result = await db.collection('users').find({}).toArray();
//         res.json(result);
//       } catch (error) {
//         res.json(error);
//       }
//       break;
//     case 'POST':
//       try {
//         const result = await db.collection('users').insertOne(req.body);
//         console.log("result:", result);
//         res.json(result);
//       } catch (error) {
//         res.json(error);
//       }
//       break;
//     case 'PUT':
//       try {
//         const result = await db.collection('users').updateOne(
//           { _id: req.body._id },
//           {
//             $set: {
//               name: req.body.name,
//               description: req.body.description,
//               price: req.body.price,
//               duration: req.body.duration,
//             },
//           }
//         );
//         res.json(result);
//       } catch (error) {
//         res.json(error);
//       }
//       break;
//     case 'DELETE':
//       try {
//         console.log(req.body._id);
//         const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.body._id) });
//         res.json(result);
//       } catch (error) {
//         res.json(error);
//       }
//       break;
//     default:
//       res.json({ message: 'Method not allowed' });
//       break;
//   }
// };


import { NextApiRequest, NextApiResponse } from 'next';
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

        if ( !name || !username || !password) {
          return res.status(400).json({ error: 'Missing required fields.' });
        }

        await db.collection('users').createIndex({ 'username': 1 }, { unique: true });

        const hashedPassword = await hash(password, 10); 

        const result = await db.collection('users').insertOne({
          name,
          username,
          hashedPassword,
        });

        const user = result.ops[0];

        return res.status(201).json(user);
      } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      break;

    case 'DELETE':
      try {
        console.log(req.body._id);
        const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.body._id) });
        res.json(result);
      } catch (error) {
        res.json(error);
      }
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
      break;
  }
}

