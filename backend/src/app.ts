// backend/src/app.ts
import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import packageRoutes from './routes/packageRoutes';
import transactionRoutes from './routes/transactionRoutes';

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/transactions', transactionRoutes);

export default app;
