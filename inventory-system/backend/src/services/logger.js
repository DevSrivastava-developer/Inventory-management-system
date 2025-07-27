import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URL ||
const DB_NAME = 'inventory';
const COLLECTION_NAME = 'low_stock_alerts';

let collection;

async function connectToMongo() {
  const client = new MongoClient(MONGO_URI);
  await client.connect(); // ✅ Safe now
  const db = client.db(DB_NAME);
  collection = db.collection(COLLECTION_NAME);
  console.log('✅ MongoDB connected');
}

export async function logToMongo(products) {
  try {
    if (!collection) {
      await connectToMongo(); // ensure connected
    }

    const timestamp = new Date();
    const entries = products.map(p => ({
      productId: p.id,
      name: p.name,
      stock: p.stock,
      threshold: p.threshold,
      alertAt: timestamp,
    }));

    await collection.insertMany(entries);
    console.log('✅ Logged to MongoDB');
  } catch (err) {
    console.error('❌ Mongo log failed:', err.message);
  }
}
