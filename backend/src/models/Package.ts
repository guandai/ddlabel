import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';
import { Address } from './Address';
import { PackageAttributes, PackageSource } from '@ddlabel/shared';
import { Transaction } from './Transaction';

interface PackageCreationAttributes extends Optional<PackageAttributes, 'id'> {}

class Package extends Model<PackageAttributes, PackageCreationAttributes> implements PackageAttributes {
  public id!: number;
  public userId!: number;
  public fromAddressId!: number;
  public toAddressId!: number;
  public length?: number;
  public width?: number;
  public height?: number;
  public trackingNo!: string;
  public weight!: number;
  public referenceNo!: string;
  public fromAddress!: Address;
  public toAddress!: Address;
  public User!: User;
  public source!: PackageSource;
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
    fromAddressId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Address,
        key: 'id',
      },
    },
    toAddressId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Address,
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
