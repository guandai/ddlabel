// backend/src/models/Address.ts
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

enum AddressEnum {
  user = 'user',
  package = 'package',
};

interface AddressAttributes {
  id: number;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  email?: string;
  phone?: string;
  addressType?: AddressEnum;
}

interface AddressCreationAttributes extends Optional<AddressAttributes, 'id'> {}

class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  public id!: number;
  public name!: string;
  public addressLine1!: string;
  public addressLine2?: string;
  public city!: string;
  public state!: string;
  public zip!: string;
  public email?: string;
  public phone?: string;
  public addressType?: AddressEnum;
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
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressLine2: {
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
  },
  {
    sequelize,
    tableName: 'addresses',
  }
);

export { Address, AddressAttributes, AddressCreationAttributes };
