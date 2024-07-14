import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';
import { Address } from './Address';

interface PackageAttributes {
  id: number;
  userId: number;
  shipFromAddressId: number;
  shipToAddressId: number;
  length: number;
  width: number;
  height: number;
  weight: number;
  trackingNumber: string;
  reference?: string;
}

interface PackageCreationAttributes extends Optional<PackageAttributes, 'id'> {}

class Package extends Model<PackageAttributes, PackageCreationAttributes> implements PackageAttributes {
  public id!: number;
  public userId!: number;
  public shipFromAddressId!: number;
  public shipToAddressId!: number;
  public length!: number;
  public width!: number;
  public height!: number;
  public weight!: number;
  public trackingNumber!: string;
  public reference!: string;
  public shipFromAddress!: Address;
  public shipToAddress!: Address;
  public User!: User;
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
    shipFromAddressId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Address,
        key: 'id',
      },
    },
    shipToAddressId: {
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
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'packages',
  }
);

Package.belongsTo(Address, { as: 'shipFromAddress', foreignKey: 'shipFromAddressId', onDelete: 'CASCADE' });
Package.belongsTo(Address, { as: 'shipToAddress', foreignKey: 'shipToAddressId', onDelete: 'CASCADE' });
Package.belongsTo(User, { as: 'user', foreignKey: 'userId' }); // Ensure alias 'owner' is defined here

export { Package, PackageAttributes, PackageCreationAttributes };
