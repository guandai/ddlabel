// backend/src/models/User.ts
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Address } from './Address';
import { UserAttributes } from '@ddlabel/shared/dist/models';

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public warehouseAddressId!: number;
  public warehouseAddress!: Address;
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
    warehouseAddressId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Address,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'users',
  }
);


User.belongsTo(Address, { as: 'warehouseAddress', foreignKey: 'warehouseAddressId', onDelete: 'CASCADE' });

export { User, UserCreationAttributes };
