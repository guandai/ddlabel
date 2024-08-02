import { Optional } from 'sequelize';
import { AddressAttributes, KeyZones, PackageAttributes, PackageType, PostalZoneAttributes, TransactionType, UserAttributes, ZipCodeAttributes } from "./models";
import { SimpleRes } from './types';
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
type UserClean = Omit<UserAttributes, 'password'> & {
    warehouseAddress: AddressAttributes;
};
export type GetUsersRes = {
    users: UserClean[];
};
export type GetCurrentUserRes = {
    user: UserClean;
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
export type GetAddressRes = {
    address: AddressAttributes;
};
export type UpdateAddressReq = {
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    email: string;
    phone: string;
};
export type UpdateAddressRes = {
    success: boolean;
};
export type WeightUnit = 'lbs' | 'oz';
export type VolumeUnit = 'inch' | 'mm';
export type GetPackageRes = {
    package: PackageAttributes & {
        fromAddress: AddressAttributes;
        toAddress: AddressAttributes;
        user: UserAttributes;
    };
};
export type GetPackagesReq = {
    limit: number;
    offset: number;
    search: string;
};
export type GetPackagesRes = {
    packages: PackageType[];
    total: number;
};
type PackageClean = Omit<PackageAttributes, 'id' | 'userId'> & {
    fromAddress: AddressAttributes;
    toAddress: AddressAttributes;
};
export type CreatePackageReq = Optional<PackageClean, 'length' | 'width' | 'height' | 'trackingNo'>;
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
    transactions: TransactionType[];
};
export type GetTransactionRes = {
    transaction: TransactionType;
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
export type GetZipCodesRes = {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    data: ZipCodeAttributes[];
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
    zip: string;
    proposal: KeyZones;
};
export type GetZoneRes = {
    zone: string;
};
export {};
