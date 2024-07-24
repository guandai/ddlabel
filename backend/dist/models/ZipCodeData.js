"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZipCodeData = void 0;
// backend/src/models/ZipCodeData.ts
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class ZipCodeData extends sequelize_1.Model {
}
exports.ZipCodeData = ZipCodeData;
ZipCodeData.init({
    zip: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true,
    },
    lat: {
        type: sequelize_1.DataTypes.DECIMAL(9, 6),
        allowNull: true,
    },
    lng: {
        type: sequelize_1.DataTypes.DECIMAL(9, 6),
        allowNull: true,
    },
    city: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    state_id: {
        type: sequelize_1.DataTypes.STRING(2),
        allowNull: true,
    },
    state_name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    zcta: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
    },
    parent_zcta: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
    },
    county_fips: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
    },
    county_name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    timezone: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'zip_code_data',
    timestamps: false, // Disable timestamps
});
