import { Router } from 'express';
import { pg } from '../models/pg.js';

const r = Router();

r.get('/', async (_req, res) => {
  const products = await pg('products').select('*');
  res.json(products);
});

r.post('/', async (req, res) => {
  const id = await pg('products').insert(req.body).returning('id');
  res.status(201).json({ id });
});

export default r;
