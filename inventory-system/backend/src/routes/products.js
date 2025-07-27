import { Router } from 'express';
const r = Router();

export default function (pg) {
  r.get('/', async (_req, res) => {
    try {
      const products = await pg('products').select('*');
      res.json(products);
    } catch (err) {
      console.error('❌ Error fetching products:', err); // ✅ Log full error to backend logs
      res.status(500).send('DB error: ' + err.message);
    }
  });

  return r;
}
