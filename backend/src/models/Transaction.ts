// backend/src/models/Transaction.ts
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Package } from './Package';
import { User } from './User';
import { TransactionAttributes } from '@ddlabel/shared';


interface TransactionCreationAttributes extends Optional<TransactionAttributes, 'id' | 'dateAdded'> {}

class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  public id!: number;
  public dateAdded!: Date;
  public event!: string;
  public cost!: number;
  public tracking!: string;
  
  public packageId!: number;
  public userId!: number;

  public package!: Package;
  public user!: User;
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
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
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
