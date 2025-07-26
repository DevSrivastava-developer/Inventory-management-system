import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import productRoutes from './routes/stock.js';
import { lowStockScanner } from './services/stock.js';

const app = express();
const server = http.createServer(app);

// ✅ Setup WebSocket
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // your frontend
    methods: ['GET', 'POST'],
  },
});

global.webSocketServer = io;

io.on('connection', (socket) => {
  console.log('📡 WebSocket client connected');
});

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use('/api/products', productRoutes);

// ✅ Start low stock scanner (every 60s)
setInterval(lowStockScanner, 60000); // 60 seconds

// ✅ Start server
const PORT =process.env.PORT || 5000;
server.listen(5000, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});


