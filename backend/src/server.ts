// backend/src/server.ts
import express from 'express';
import cors from 'cors';

import { connectDB } from './config/database';
import userRoutes from './routes/userRoutes';
import packageRoutes from './routes/packageRoutes';
import transactionRoutes from './routes/transactionRoutes';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ // Configure CORS options
  origin: 'http://localhost:3000', // Allow only this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow these HTTP methods
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/transactions', transactionRoutes);

// Connect to the database and start the server
connectDB().then(() => {
  const PORT = process.env.PORT || 5100;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

