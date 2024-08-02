// backend/src/models/ZipCode.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { ZipCodeAttributes } from '@ddlabel/shared';

class ZipCode extends Model<ZipCodeAttributes> implements ZipCodeAttributes {
  public zip!: string;
  public lat!: number;
  public lng!: number;
  public city!: string;
  public state_id!: string;
  public state_name!: string;
  public zcta!: string;
  public parent_zcta!: string;
  public county_fips!: string;
  public county_name!: string;
  public timezone!: string;
}

ZipCode.init(
  {
    zip: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
    },
    lat: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
    },
    lng: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state_id: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    state_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    zcta: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    parent_zcta: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    county_fips: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    county_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    timezone: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'zip_codes',
    timestamps: false, // Disable timestamps
  }
);

export { ZipCode };
