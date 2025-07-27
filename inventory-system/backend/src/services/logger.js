import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = 'inventory';
const COLLECTION_NAME = 'low_stock_alerts';

const client = new MongoClient(MONGO_URI);
await client.connect(); // ensures Mongo is connected before logging

const db = client.db(DB_NAME);
const collection = db.collection(COLLECTION_NAME);

export async function logToMongo(products) {
  try {
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
