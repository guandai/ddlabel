// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/database';
import userRoutes from './routes/userRoutes';
import packageRoutes from './routes/packageRoutes';
import transactionRoutes from './routes/transactionRoutes';
import shippingRateRoutes from './routes/shippingRateRoutes';
import postalZoneRoutes from './routes/postalZoneRoutes';

import dotenv from 'dotenv';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      io: import('socket.io').Server;
    }
  }
}

// Load environment variables from .env file
const env = process.env.NODE_ENV || 'development';
if (env === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.development' });
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: '/api/socket.io/',
  cors: {
    origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization', 'socket-id'],
  },
});


// Middleware
app.use(express.json());
app.use(cors()); // Allow all requests

// Routes
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/shipping_rates', shippingRateRoutes);
app.use('/api/postal_zones', postalZoneRoutes);
app.use('/api/packages', (req: Request, _res, next) => {
  req.io = io;
  next();
}, packageRoutes);


// Connect to the database and start the server
connectDB().then(() => {
  const PORT = process.env.PORT || 5100;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
