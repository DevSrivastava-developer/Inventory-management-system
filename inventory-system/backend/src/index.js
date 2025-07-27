import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import productRoutes from './routes/stock.js';
import { lowStockScanner } from './services/stock.js';

const app = express();
const server = http.createServer(app);

// ✅ Setup WebSocket for both local + deployed frontend
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173', // local dev
      'https://inventory-management-system-wine-seven.vercel.app', // vercel deployed frontend
    ],
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
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});

