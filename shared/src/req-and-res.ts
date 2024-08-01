import { AddressAttributes, UserAttributes } from "./models";

export type FullRateRsp = {
	totalCost: number;
}

export type WeightUnit = 'lbs' | 'oz';
export type VolumeUnit = 'inch' | 'mm';

export type FullRateParam = {
	weight: number;
	weightUnit: WeightUnit;
	length: number;
	width: number;
	height: number;
	volumeUnit: VolumeUnit;
	zone: number;
};

export type RegisterUserResponse = {
	success: boolean;
	userId: number;
};

export type LoginReq = Pick<UserAttributes, 'email' | 'password'>;

export type UserRegisterReq = Pick<UserAttributes, 'name' | 'email' | 'password' | 'role'> & { warehouseAddress: AddressAttributes };

export type UserUpdateReq = Pick<UserAttributes, 'name' | 'email' | 'role'> & { password?: string } & { warehouseAddress: AddressAttributes };
