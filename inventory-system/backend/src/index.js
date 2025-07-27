import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import db from './utils/db.js'; // ✅ PostgreSQL instance
import productRoutes from './routes/stock.js';
import { lowStockScanner } from './services/stock.js';

const app = express();
const server = http.createServer(app);

// ✅ WebSocket setup
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://inventory-management-system-wine-seven.vercel.app',
    ],
    methods: ['GET', 'POST'],
  },
});

global.webSocketServer = io;

io.on('connection', (socket) => {
  console.log('📡 WebSocket client connected');
});

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Fix: Pass db to productRoutes
app.use('/api/products', productRoutes(db));

// ✅ Scanner
setInterval(lowStockScanner, 60000);

// ✅ Server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});
