"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
// backend/src/models/Address.ts
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const getZipInfo_1 = require("../utils/getZipInfo");
var AddressEnum;
(function (AddressEnum) {
    AddressEnum["user"] = "user";
    AddressEnum["package"] = "package";
})(AddressEnum || (AddressEnum = {}));
;
class Address extends sequelize_1.Model {
    static createWithInfo(attr) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield (0, getZipInfo_1.getCityState)(attr.zip, attr.city, attr.state);
            return yield Address.create(Object.assign(Object.assign({}, attr), { city: info.city, state: info.state }));
        });
    }
    static updateWithInfo(attr, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield (0, getZipInfo_1.getCityState)(attr.zip, attr.city, attr.state);
            yield Address.update(Object.assign(Object.assign({}, attr), { city: info.city, state: info.state }), { where: { id } });
        });
    }
}
exports.Address = Address;
Address.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    addressType: {
        type: sequelize_1.DataTypes.ENUM('user', 'package'),
        allowNull: false,
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
    timestamps: false, // Disable timestamps if not needed
});
