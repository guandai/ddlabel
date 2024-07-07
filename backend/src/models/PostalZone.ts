// backend/src/models/PostalZone.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

interface PostalZoneAttributes {
  ZIP_CODE: string;
  NEW_SORT_CODE: string;
  SORT_CODE: string;
  STATE: string;
  CITY: string;
  REMOTE_CODE: string;
  CODE: string;
  PROPOSAL: string;
  START_ZIP?: string;
  OPEN_DATE: string;
  LAX?: string;
  SFO?: string;
  ORD?: string;
  JFK?: string;
  ATL?: string;
  DFW?: string;
  MIA?: string;
  SEA?: string;
  BOS?: string;
  PDX?: string;
}

class PostalZone extends Model<PostalZoneAttributes> implements PostalZoneAttributes {
  public ZIP_CODE!: string;
  public NEW_SORT_CODE!: string;
  public SORT_CODE!: string;
  public STATE!: string;
  public CITY!: string;
  public REMOTE_CODE!: string;
  public CODE!: string;
  public PROPOSAL!: string;
  public START_ZIP?: string;
  public OPEN_DATE!: string;
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
    ZIP_CODE: {
      type: DataTypes.STRING(5),
      primaryKey: true,
    },
    NEW_SORT_CODE: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: '',
    },
    SORT_CODE: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    STATE: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    CITY: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    REMOTE_CODE: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    CODE: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    PROPOSAL: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    START_ZIP: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    OPEN_DATE: {
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
