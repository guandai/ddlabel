"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
// backend/src/models/Transaction.ts
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const Package_1 = require("./Package");
class Transaction extends sequelize_1.Model {
}
exports.Transaction = Transaction;
Transaction.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    packageId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Package_1.Package,
            key: 'id',
        },
    },
    dateAdded: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    event: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    cost: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    tracking: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'transactions',
});
