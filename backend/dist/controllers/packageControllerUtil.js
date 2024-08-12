"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelationQuery = exports.getAddressesWhere = exports.getQueryWhere = void 0;
const shared_1 = require("@ddlabel/shared");
const sequelize_1 = require("sequelize");
const errors_1 = require("../utils/errors");
const Transaction_1 = require("../models/Transaction");
const Address_1 = require("../models/Address");
const User_1 = require("../models/User");
const getQueryWhere = (req) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const trackingNo = req.query.trackingNo;
    const email = req.query.email;
    const name = req.query.name;
    const hasTrackingNo = trackingNo && trackingNo.length >= 2;
    const hasEmail = email && email.length >= 2;
    const hasName = req.query.name && name.length >= 2;
    const hasDate = (0, errors_1.isDateValid)(startDate) && (0, errors_1.isDateValid)(endDate);
    const whereTrackingNo = hasTrackingNo ? { trackingNo: { [sequelize_1.Op.like]: `%${trackingNo}%` } } : {};
    const whereEmail = hasEmail ? { email: { [sequelize_1.Op.like]: `%${email}%` } } : {};
    const whereName = hasName ? { email: { [sequelize_1.Op.like]: `%${name}%` } } : {};
    const startDateTime = `${startDate} 00:00:00`;
    const endDateTime = `${endDate} 23:59:59`;
    const whereDate = hasDate ? { createdAt: { [sequelize_1.Op.between]: [startDateTime, endDateTime] } } : {};
    return Object.assign(Object.assign(Object.assign(Object.assign({}, whereTrackingNo), whereDate), whereEmail), whereName);
};
exports.getQueryWhere = getQueryWhere;
const getAddressesWhere = (req, addressType) => {
    const address = req.query.address;
    const hasAddress = address && address.length >= 2;
    const whereAddress = hasAddress ? {
        [sequelize_1.Op.or]: [
            { address1: { [sequelize_1.Op.like]: `%${address}%` } },
            { address2: { [sequelize_1.Op.like]: `%${address}%` } },
        ]
    } : {};
    return Object.assign(Object.assign({}, whereAddress), { addressType });
};
exports.getAddressesWhere = getAddressesWhere;
const getInclude = (whereFrom, whereTo) => [
    { model: Address_1.Address, as: 'fromAddress', where: whereFrom },
    { model: Address_1.Address, as: 'toAddress', where: whereTo },
    { model: User_1.User, as: 'user' },
    { model: Transaction_1.Transaction, as: 'transaction' },
];
const getRelationQuery = (req) => {
    const whereQuery = (0, exports.getQueryWhere)(req);
    const where = Object.assign(Object.assign({}, whereQuery), { userId: req.user.id });
    const whereFrom = (0, exports.getAddressesWhere)(req, shared_1.AddressEnum.fromPackage);
    const whereTo = (0, exports.getAddressesWhere)(req, shared_1.AddressEnum.toPackage);
    const include = getInclude(whereFrom, whereTo);
    return { where, include };
};
exports.getRelationQuery = getRelationQuery;
