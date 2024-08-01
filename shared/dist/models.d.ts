export declare enum PackageSource {
    manual = "manual",
    csv = "csv",
    api = "api"
}
export type PackageAttributes = {
    id: number;
    userId: number;
    // fromAddressId: number;
    // toAddressId: number;
    length: number;
    width: number;
    height: number;
    weight: number;
    trackingNo: string;
    referenceNo?: string;
    source: PackageSource;
};
export declare enum AddressEnum {
    user = "user",
    toPackage = "toPackage",
    fromPackage = "fromPackage"
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
    userId?: number;
    fromPackageId?: number;
    toPackageId?: number;
};
export type UserAttributes = {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    // warehouseAddressId: number;
};
export type PostalZoneAttributes = {
    zip_code: string;
    new_sort_code: string;
    sort_code: string;
    state: string;
    city: string;
    remote_code: string;
    code: string;
    proposal: KeyZones;
    start_zip?: string;
    open_date: string;
    LAX?: string;
    SFO?: string;
    ORD?: string;
    JFK?: string;
    ATL?: string;
    DFW?: string;
    MIA?: string;
    SEA?: string;
    BOS?: string;
    PDX?: string;
};
export type Zones = Pick<PostalZoneAttributes, 'LAX' | 'SFO' | 'ORD' | 'JFK' | 'ATL' | 'DFW' | 'MIA' | 'SEA' | 'BOS' | 'PDX'>;
export type KeyZones = keyof Zones;
