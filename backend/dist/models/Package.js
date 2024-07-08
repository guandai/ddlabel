"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const User_1 = require("./User");
const Address_1 = require("./Address");
class Package extends sequelize_1.Model {
}
exports.Package = Package;
Package.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: User_1.User,
            key: 'id',
        },
    },
    shipFromAddressId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Address_1.Address,
            key: 'id',
        },
    },
    shipToAddressId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Address_1.Address,
            key: 'id',
        },
    },
    length: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    width: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    height: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    weight: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    trackingNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    reference: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    warehouseZip: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'packages',
});
Package.belongsTo(Address_1.Address, { as: 'shipFromAddress', foreignKey: 'shipFromAddressId' });
Package.belongsTo(Address_1.Address, { as: 'shipToAddress', foreignKey: 'shipToAddressId' });
Package.belongsTo(User_1.User, { as: 'user', foreignKey: 'userId' }); // Ensure alias 'owner' is defined here
