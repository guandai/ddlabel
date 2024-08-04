// backend/src/models/Address.ts
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { fixCityState } from '../utils/getZipInfo';
import { AddressAttributes, AddressEnum } from '@ddlabel/shared';
import { User } from './User';
import { Package } from './Package';

interface AddressCreationAttributes extends Optional<AddressAttributes, 'id'> { }

class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  public id!: number;
  public name!: string;
  public address1!: string;
  public address2?: string;
  public city!: string;
  public state!: string;
  public zip!: string;
  public email?: string;
  public phone?: string;
  public addressType!: AddressEnum;

  public userId?: number;
  public fromPackageId?: number;
  public toPackageId?: number;

  public user!: User;
  public fromPackage!: Package;
  public toPackage!: Package;


  public static async createWithInfo(attr: AddressCreationAttributes): Promise<Address> {
    const fixedAttr = await fixCityState(attr);
    return await Address.create(fixedAttr);
  }

  public static async updateWithInfo(attr: AddressAttributes) {
    const fixedAttr = await fixCityState(attr);
    await Address.update(fixedAttr,  { where: { id: attr.id } });
  }
}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    addressType: {
      type: DataTypes.ENUM('user', 'package'),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    fromPackageId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: Package,
        key: 'id',
      },
    },
    toPackageId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: Package,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'addresses',
    timestamps: false, // Disable timestamps if not needed
  }
);


export { Address, AddressCreationAttributes };
