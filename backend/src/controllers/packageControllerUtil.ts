import { AddressEnum } from "@ddlabel/shared";
import { AuthRequest } from '../types';
import { Op, WhereOptions } from "sequelize";
import { isDateValid } from "../utils/errors";
import { Transaction } from "../models/Transaction";
import { Address } from "../models/Address";
import { User } from "../models/User";

const getPackagesWhere = (req: AuthRequest): WhereOptions => {
	const userId = req.user.id;
  
	const startDate = req.query.startDate as string;
	const endDate = req.query.endDate as string;
	const tracking = req.query.tracking as string;
  
	const hasTracking = tracking && tracking.length >= 2;
	const hasDate = isDateValid(startDate) && isDateValid(endDate);
  
	const whereTracking = hasTracking ? { trackingNo: { [Op.like]: `%${tracking}%` } } : {};
	const whereDate = hasDate ? { createdAt: { [Op.between]: [startDate, endDate] } } : {};
	return { ...whereTracking, ...whereDate, userId };
  };
  
  const getAddressesWhere = (req: AuthRequest, addressType: AddressEnum): WhereOptions => {
	const address = req.query.address as string;
	const hasAddress = address && address.length >= 2;
  
	const whereAddress = hasAddress ? {[Op.or]: [
	  { address1: { [Op.like]: `%${address}%` } },
	  { address2: { [Op.like]: `%${address}%` } },
	]} : {};
  
	return { ...whereAddress, addressType };
  };
  
  const getInclude = (whereFrom: WhereOptions, whereTo: WhereOptions ) => [
	  { model: Address, as: 'fromAddress', where: whereFrom },
	  { model: Address, as: 'toAddress', where: whereTo },
	  { model: User, as: 'user' },
	  { model: Transaction, as: 'transaction' },
  ]; 
  
  export const getRelationQuery = (req: AuthRequest) => {
	const wherePackage = getPackagesWhere(req);
	const whereFrom = getAddressesWhere(req, AddressEnum.fromPackage);
	const whereTo = getAddressesWhere(req, AddressEnum.toPackage);
	const include = getInclude(whereFrom, whereTo);
	return { wherePackage, include };
  };
