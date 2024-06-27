// backend/src/models/Transaction.ts
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Package } from './Package';

interface TransactionAttributes {
  id: number;
  packageId: number;
  dateAdded: Date;
  event: string;
  cost: number;
  tracking: string;
}

interface TransactionCreationAttributes extends Optional<TransactionAttributes, 'id' | 'dateAdded'> {}

class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  public id!: number;
  public packageId!: number;
  public dateAdded!: Date;
  public event!: string;
  public cost!: number;
  public tracking!: string;
}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    packageId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Package,
        key: 'id',
      },
    },
    dateAdded: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    event: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    tracking: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'transactions',
  }
);

export { Transaction, TransactionAttributes, TransactionCreationAttributes };
