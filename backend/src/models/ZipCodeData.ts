// backend/src/models/ZipCodeData.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

interface ZipCodeDataAttributes {
  zip: string;
  lat: number;
  lng: number;
  city: string;
  state_id: string;
  state_name: string;
  zcta: string;
  parent_zcta: string;
  county_fips: string;
  county_name: string;
  timezone: string;
}

class ZipCodeData extends Model<ZipCodeDataAttributes> implements ZipCodeDataAttributes {
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

ZipCodeData.init(
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
    tableName: 'zip_code_data',
    timestamps: false, // Disable timestamps
  }
);

export { ZipCodeData };
