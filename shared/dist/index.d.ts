export type MyType = {
    id: string;
    name: string;
};
export declare function myFunction(): MyType;
export type FullRateRsp = {
    totalCost: number;
};
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
