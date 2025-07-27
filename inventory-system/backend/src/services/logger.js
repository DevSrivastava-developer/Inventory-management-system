import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = 'inventory';
const COLLECTION_NAME = 'low_stock_alerts';

let collection; // declared globally for reuse
let connected = false;

// Initialize Mongo lazily
async function initMongo() {
  if (connected) return;
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  collection = db.collection(COLLECTION_NAME);
  connected = true;
  console.log('✅ MongoDB connected');
}

// Main export
export async function logToMongo(products) {
  try {
    await initMongo(); // ensures safe connection

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
