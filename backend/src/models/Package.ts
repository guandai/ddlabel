import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

interface PackageAttributes {
  id: number;
  userId: number;
  shipFromAddress: string;
  shipToAddress: string;
  phone: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  postCode: string;
  email: string;
  state: string;
  name: string;
  trackingNumber: string; // Add trackingNumber attribute
}

interface PackageCreationAttributes extends Optional<PackageAttributes, 'id'> {}

class Package extends Model<PackageAttributes, PackageCreationAttributes> implements PackageAttributes {
  public id!: number;
  public userId!: number;
  public shipFromAddress!: string;
  public shipToAddress!: string;
  public phone!: string;
  public length!: number;
  public width!: number;
  public height!: number;
  public weight!: number;
  public postCode!: string;
  public email!: string;
  public state!: string;
  public name!: string;
  public trackingNumber!: string; // Add trackingNumber attribute
}

Package.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    shipFromAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shipToAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    length: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    width: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    height: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    postCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure the tracking number is unique
    },
  },
  {
    sequelize,
    tableName: 'packages',
  }
);

export { Package, PackageAttributes, PackageCreationAttributes };
