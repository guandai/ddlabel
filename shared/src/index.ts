export const FIELDS: KeyOfBaseData[] = [
	'length', 'width', 'height', 'weight', 'reference',
	'shipFromName', 'shipFromAddressStreet', 'shipFromAddressZip',
	'shipToName', 'shipToAddressStreet', 'shipToAddressZip'
];

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

export type BaseData = {
	length: number,
	width: number,
	height: number,
	weight: number,
	reference: string,
	shipFromName: string,
	shipFromAddressStreet: string,
	shipFromAddressZip: string,
	shipToName: string,
	shipToAddressStreet: string,
	shipToAddressZip: string,
}

export type KeyOfBaseData = keyof BaseData;
export type HeaderMapping = { [k in KeyOfBaseData]: KeyOfBaseData | string | null };
