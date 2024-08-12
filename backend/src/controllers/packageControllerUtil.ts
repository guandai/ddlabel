import { AddressEnum } from "@ddlabel/shared";
import { AuthRequest } from '../types';
import { Op, WhereOptions } from "sequelize";
import { isDateValid } from "../utils/errors";
import { Transaction } from "../models/Transaction";
import { Address } from "../models/Address";
import { User } from "../models/User";

export const getQueryWhere = (req: AuthRequest): WhereOptions => {
	const startDate = req.query.startDate as string;
	const endDate = req.query.endDate as string;
	const trackingNo = req.query.trackingNo as string;
	const email = req.query.email as string;
	const name = req.query.name as string;

	const hasTrackingNo = trackingNo && trackingNo.length >= 2;
	const hasEmail = email && email.length >= 2;
	const hasName = req.query.name && name.length >= 2;
	const hasDate = isDateValid(startDate) && isDateValid(endDate);

	const whereTrackingNo = hasTrackingNo ? { trackingNo: { [Op.like]: `%${trackingNo}%` } } : {};
	const whereEmail = hasEmail ? { email: { [Op.like]: `%${email}%` } } : {};
	const whereName = hasName ? { email: { [Op.like]: `%${name}%` } } : {};
	const startDateTime = `${startDate} 00:00:00`;
	const endDateTime = `${endDate} 23:59:59`;
	const whereDate = hasDate ? { createdAt: { [Op.between]: [startDateTime, endDateTime] } } : {};
	return { ...whereTrackingNo, ...whereDate, ...whereEmail, ...whereName };
};

export const getAddressesWhere = (req: AuthRequest, addressType: AddressEnum): WhereOptions => {
	const address = req.query.address as string;
	const hasAddress = address && address.length >= 2;

	const whereAddress = hasAddress ? {
		[Op.or]: [
			{ address1: { [Op.like]: `%${address}%` } },
			{ address2: { [Op.like]: `%${address}%` } },
		]
	} : {};

	return { ...whereAddress, addressType };
};

const getInclude = (whereFrom: WhereOptions, whereTo: WhereOptions) => [
	{ model: Address, as: 'fromAddress', where: whereFrom },
	{ model: Address, as: 'toAddress', where: whereTo },
	// { model: User, as: 'user' },
	// { model: Transaction, as: 'transaction' },
];

export const getRelationQuery = (req: AuthRequest) => {
	const whereQuery = getQueryWhere(req);
	const where = { ...whereQuery, userId: req.user.id };
	const whereFrom = getAddressesWhere(req, AddressEnum.fromPackage);
	const whereTo = getAddressesWhere(req, AddressEnum.toPackage);
	const include = getInclude(whereFrom, whereTo);
	return { where, include };
};
