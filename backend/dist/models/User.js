"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// backend/src/models/User.ts
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Address_1 = require("./Address");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('admin', 'worker'),
        allowNull: false,
    },
    warehouseAddressId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Address_1.Address,
            key: 'id',
        },
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'users',
});
User.belongsTo(Address_1.Address, { as: 'warehouseAddress', foreignKey: 'warehouseAddressId', onDelete: 'CASCADE' });
