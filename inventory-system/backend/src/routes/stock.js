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

export default router;
