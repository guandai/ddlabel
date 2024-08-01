// backend/src/models/PostalZone.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { PostalZoneAttributes } from '@ddlabel/shared';

class PostalZone extends Model<PostalZoneAttributes> implements PostalZoneAttributes {
  public zip_code!: string;
  public new_sort_code!: string;
  public sort_code!: string;
  public state!: string;
  public city!: string;
  public remote_code!: string;
  public code!: string;
  public proposal!: string;
  public start_zip?: string;
  public open_date!: string;
  public LAX?: string;
  public SFO?: string;
  public ORD?: string;
  public JFK?: string;
  public ATL?: string;
  public DFW?: string;
  public MIA?: string;
  public SEA?: string;
  public BOS?: string;
  public PDX?: string;
}

PostalZone.init(
  {
    zip_code: {
      type: DataTypes.STRING(5),
      primaryKey: true,
    },
    new_sort_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: '',
    },
    sort_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    remote_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    proposal: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    start_zip: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    open_date: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    LAX: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    SFO: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    ORD: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    JFK: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    ATL: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    DFW: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    MIA: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    SEA: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    BOS: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    PDX: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'postal_zones',
  }
);

export { PostalZone, PostalZoneAttributes };
