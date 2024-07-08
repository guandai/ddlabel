import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database'; // Import your database configuration

interface SortCodeAttributes {
  id: number;
  port: string;
  zipCode: string;
  sortCode: string;
  createdAt: Date;
  updatedAt: Date;
}
export class SortCode extends Model<SortCodeAttributes> implements SortCodeAttributes{
  public id!: number;
  public port!: string;
  public zipCode!: string;
  public sortCode!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

SortCode.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  port: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  zipCode: {
    type: DataTypes.STRING(5),
    allowNull: false
  },
  sortCode: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'SortCode',
  tableName: 'sort_code'
});

module.exports = SortCode;
