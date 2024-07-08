"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
// backend/src/models/Address.ts
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Address extends sequelize_1.Model {
}
exports.Address = Address;
Address.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    addressLine1: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    addressLine2: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    zip: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'addresses',
});
