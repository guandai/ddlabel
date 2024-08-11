"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelationQuery = void 0;
const shared_1 = require("@ddlabel/shared");
const sequelize_1 = require("sequelize");
const errors_1 = require("../utils/errors");
const Transaction_1 = require("../models/Transaction");
const Address_1 = require("../models/Address");
const User_1 = require("../models/User");
const getPackagesWhere = (req) => {
    const userId = req.user.id;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const tracking = req.query.tracking;
    const hasTracking = tracking && tracking.length >= 2;
    const hasDate = (0, errors_1.isDateValid)(startDate) && (0, errors_1.isDateValid)(endDate);
    const whereTracking = hasTracking ? { trackingNo: { [sequelize_1.Op.like]: `%${tracking}%` } } : {};
    const startDateTime = `${startDate} 00:00:00`;
    const endDateTime = `${endDate} 23:59:59`;
    const whereDate = hasDate ? { createdAt: { [sequelize_1.Op.between]: [startDateTime, endDateTime] } } : {};
    return Object.assign(Object.assign(Object.assign({}, whereTracking), whereDate), { userId });
};
const getAddressesWhere = (req, addressType) => {
    const address = req.query.address;
    const hasAddress = address && address.length >= 2;
    const whereAddress = hasAddress ? { [sequelize_1.Op.or]: [
            { address1: { [sequelize_1.Op.like]: `%${address}%` } },
            { address2: { [sequelize_1.Op.like]: `%${address}%` } },
        ] } : {};
    return Object.assign(Object.assign({}, whereAddress), { addressType });
};
const getInclude = (whereFrom, whereTo) => [
    { model: Address_1.Address, as: 'fromAddress', where: whereFrom },
    { model: Address_1.Address, as: 'toAddress', where: whereTo },
    { model: User_1.User, as: 'user' },
    { model: Transaction_1.Transaction, as: 'transaction' },
];
const getRelationQuery = (req) => {
    const where = getPackagesWhere(req);
    const whereFrom = getAddressesWhere(req, shared_1.AddressEnum.fromPackage);
    const whereTo = getAddressesWhere(req, shared_1.AddressEnum.toPackage);
    const include = getInclude(whereFrom, whereTo);
    return { where, include };
};
exports.getRelationQuery = getRelationQuery;
