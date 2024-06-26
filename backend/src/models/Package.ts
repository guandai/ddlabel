import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';
import { Address } from './Address';
import { PackageAttributes, PackageCreationAttributes, PackageSource } from '@ddlabel/shared';
import { Transaction } from './Transaction';

class Package extends Model<PackageAttributes, PackageCreationAttributes> implements PackageAttributes {
  public id!: number;
  public length!: number;
  public width!: number;
  public height!: number;
  public trackingNo!: string;
  public weight!: number;
  public referenceNo!: string;
  public source!: PackageSource;
  public userId!: number;

  public fromAddress!: Address;
  public toAddress!: Address;
  public user!: User;
  public transaction!: Transaction;
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
    trackingNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    referenceNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source: {
      type: DataTypes.ENUM('manual', 'api'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'packages',
  }
);

export { Package, PackageCreationAttributes };
