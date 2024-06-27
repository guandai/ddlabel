// backend/src/config/database.ts
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a new Sequelize instance
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: console.log,
});

// Import models
import { User } from '../models/User';
import { Package } from '../models/Package';
import { Transaction } from '../models/Transaction';

// Initialize model relationships if needed
Package.belongsTo(User, { foreignKey: 'userId' });
Transaction.belongsTo(Package, { foreignKey: 'packageId' });

// Connect to the database and synchronize models
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync();
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { sequelize, connectDB };
