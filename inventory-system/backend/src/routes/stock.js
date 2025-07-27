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
// ✅ PUT update product by ID
router.put('/:id', async (req, res) => {
  const { name, sku, stock, threshold } = req.body;
  const { id } = req.params;

  try {
    const updated = await db('products')
      .where({ id })
      .update({ name, sku, stock, threshold })
      .returning('*');

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE product by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await db('products').where({ id }).del();

    if (deleted === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
