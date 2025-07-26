import { Router } from 'express';
const r = Router();

// Placeholder route
r.get('/', (_req, res) => {
  res.send('Auth route working');
});

export default r;
