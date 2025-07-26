import { Router } from 'express';
const r = Router();

export default function (pg) {
  r.get('/', async (_req, res) => {
    try {
      const products = await pg('products').select('*');
      res.json(products);
    } catch (err) {
      res.status(500).send('DB error: ' + err.message);
    }
  });

  return r;
}
