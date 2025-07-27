import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URL);
mongoose.connection.once('open', () => {
  console.log('✅ MongoDB connected successfully.');
});

export const Log = mongoose.model('Log', new mongoose.Schema({
  ts: { type: Date, default: Date.now },
  meta: Object,
  action: String,
  delta: Number,
  stockAfter: Number
}, { timeseries: { timeField: 'ts', granularity: 'seconds' } }));
