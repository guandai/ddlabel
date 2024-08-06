import { Optional } from 'sequelize';
import { AddressAttributes, PackageModel, PostalZoneAttributes, TransactionModel, UserAttributes, UserModel } from "./models";
import { SimpleRes } from './types';
import { BeansAI } from './beans';
export type RegisterUserReq = Pick<UserAttributes, 'name' | 'email' | 'password' | 'role'> & {
    warehouseAddress: AddressAttributes;
};
export type RegisterUserRes = {
    success: boolean;
    userId: number;
};
export type UpdateCurrentUserReq = Pick<UserAttributes, 'name' | 'email' | 'role'> & {
    password?: string;
} & {
    warehouseAddress: AddressAttributes;
};
export type UpdateCurrentUserRes = {
    success: boolean;
};
export type GetUsersRes = {
    users: UserModel[];
};
export type GetCurrentUserRes = {
    user: UserModel;
};
export type LoginUserReq = Pick<UserAttributes, 'email' | 'password'>;
export type LoginUserRes = {
    token: string;
    userId: number;
};
export type UpdateUserReq = Pick<UserAttributes, 'name' | 'email' | 'role'> & {
    password?: string;
} & {
    warehouseAddress: AddressAttributes;
};
export type UpdateUserRes = {
    success: boolean;
};
export type WeightUnit = 'lbs' | 'oz';
export type VolumeUnit = 'inch' | 'mm';
export type GetPackageRes = {
    package: PackageModel;
};
export type GetPackagesReq = {
    limit: number;
    offset: number;
    search: string;
};
export type GetPackagesRes = {
    packages: PackageModel[];
    total: number;
};
export type CreatePackageReq = Optional<PackageModel, 'length' | 'width' | 'height' | 'trackingNo'>;
export type CreatePackageRes = {
    success: boolean;
    packageId: number;
};
export type UpdatePackageReq = CreatePackageReq;
export type UpdatePackageRes = {
    success: boolean;
};
export type ImportPackageReq = FormData;
export type ImportPackageRes = SimpleRes;
export type GetTransactionsReq = {
    limit: number;
    offset: number;
    search: string;
};
export type GetTransactionsRes = {
    total: number;
    transactions: TransactionModel[];
};
export type GetTransactionRes = {
    transaction: TransactionModel;
};
export type GetRatesReq = {
    weight: number;
    weightUnit: WeightUnit;
    length: number;
    width: number;
    height: number;
    volumeUnit: VolumeUnit;
    zone: number;
};
export type GetRatesRes = {
    rates: number[];
};
export type FullRateReq = {
    weight: number;
    weightUnit: WeightUnit;
    length: number;
    width: number;
    height: number;
    volumeUnit: VolumeUnit;
    zone: number;
};
export type FullRateRes = {
    totalCost: number;
};
export type AuthRequest = import("express-serve-static-core").Request & {
    user: UserAttributes;
};
export type GetPostalZoneReq = {
    zip: string;
};
export type GetPostalZoneRes = {
    postalZone: PostalZoneAttributes;
};
export type GetPostalZonesRes = {
    postalZones: PostalZoneAttributes[];
};
export type GetZoneReq = {
    fromZip: string;
    toZip: string;
};
export type GetZoneRes = {
    zone: string;
};
export type GetStatusLogReq = {
    trackingNo: string;
};
export type GetStatusLogRes = {
    listItemReadableStatusLogs: BeansAI.ListItemReadableStatusLogs;
};
