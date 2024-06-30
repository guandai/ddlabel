// backend/src/models/ShippingRate.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

interface ShippingRateAttributes {
  weightRange: string;
  unit: string;
  zone1: number;
  zone2: number;
  zone3: number;
  zone4: number;
  zone5: number;
  zone6: number;
  zone7: number;
  zone8: number;
}

class ShippingRate extends Model<ShippingRateAttributes> implements ShippingRateAttributes {
  public weightRange!: string;
  public unit!: string;
  public zone1!: number;
  public zone2!: number;
  public zone3!: number;
  public zone4!: number;
  public zone5!: number;
  public zone6!: number;
  public zone7!: number;
  public zone8!: number;
}

ShippingRate.init(
  {
    weightRange: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zone1: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    zone2: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    zone3: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    zone4: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    zone5: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    zone6: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    zone7: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    zone8: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'shipping_rates',
  }
);

export { ShippingRate };
