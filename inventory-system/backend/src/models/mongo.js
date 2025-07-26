import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URL);

export const Log = mongoose.model('Log', new mongoose.Schema({
  ts: { type: Date, default: Date.now },
  meta: Object,
  action: String,
  delta: Number,
  stockAfter: Number
}, { timeseries: { timeField: 'ts', granularity: 'seconds' } }));
