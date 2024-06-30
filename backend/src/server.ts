// backend/src/server.ts
import express from 'express';
import cors from 'cors';

import { connectDB } from './config/database';
import userRoutes from './routes/userRoutes';
import packageRoutes from './routes/packageRoutes';
import transactionRoutes from './routes/transactionRoutes';
import shippingRateRoutes from './routes/shippingRateRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/shipping-rates', shippingRateRoutes); // Add this line

// Connect to the database and start the server
connectDB().then(() => {
  const PORT = process.env.PORT || 5100;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
