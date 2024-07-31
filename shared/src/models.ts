export enum PackageSource {
	manual = 'manual',
	csv = 'csv',
}

export type PackageAttributes = {
	id: number;
	userId: number;
	fromAddressId: number;
	toAddressId: number;
	length: number;
	width: number;
	height: number;
	weight: number;
	trackingNo: string;
	referenceNo?: string;
	source: PackageSource;
}

export enum AddressEnum {
	user = 'user',
	package = 'package'
}

export type AddressAttributes = {
	id: number;
	name: string;
	address1: string;
	address2?: string;
	city: string;
	state: string;
	zip: string;
	email?: string;
	phone?: string;
	addressType?: AddressEnum;
}


export type UserAttributes = {
	id: number;
	name: string;
	email: string;
	password: string;
	role: string;
	warehouseAddressId: number;
}
