import express from 'express';
import db from '../utils/db.js'; // Knex instance

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await db('products');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post('/', async (req, res) => {
  const { name, sku, stock, threshold } = req.body;

  if (!name || !sku || stock == null || threshold == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [newProduct] = await db('products')
      .insert({ name, sku, stock, threshold })
      .returning('*');

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('❌ Error inserting product:', err);
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
});
export default router;
