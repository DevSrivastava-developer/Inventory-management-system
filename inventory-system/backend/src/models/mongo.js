import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Optional MongoDB setup
if (process.env.MONGO_URL) {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.once('open', () => {
    console.log('✅ MongoDB connected successfully.');
  });

  // Example model
  export const Log = mongoose.model('Log', new mongoose.Schema({
    ts: { type: Date, default: Date.now },
    message: String,
  }));
} else {
  console.log('⚠️ MONGO_URL not set — skipping MongoDB connection.');
  
  // Export a dummy Log model to avoid crashing other parts of the app
  export const Log = {
    create: async () => {
      console.log('⚠️ Log.create() called, but MongoDB is not connected.');
    },
  };
}

