import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database'; // Import your database configuration

class SortCode extends Model {}

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
