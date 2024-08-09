// backend/src/models/User.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { Address } from './Address';
import { Transaction } from './Transaction';
import { UserAttributes, UserCreationAttributes } from '@ddlabel/shared';
import { defineRelations } from '../config/relations';
import { Package } from './Package';

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: string;

  public warehouseAddress!: Address;
  public packages!: Package[];
  public transactions!: Transaction[];
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'worker'),
      allowNull: false,
    },
    // warehouseAddressId: {
    //   type: DataTypes.INTEGER.UNSIGNED,
    //   allowNull: false,
    //   references: {
    //     model: Address,
    //     key: 'id',
    //   },
    // },
  },
  {
    sequelize,
    tableName: 'users',
  }
);
defineRelations();
export { User, UserCreationAttributes };
