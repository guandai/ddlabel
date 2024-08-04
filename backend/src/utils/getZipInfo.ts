import { ZipInfo } from '@ddlabel/shared';
import stateData from '../data/stateSmall.json';
import { AddressCreationAttributes } from '../models/Address';

interface StateData {
	zip: string;
	city: string;
	state: string;
	county?: string;
	tz?: string;
}

type DataStructure = StateData[];

const stData = stateData as DataStructure;

export const fixCityState = (attr: AddressCreationAttributes): AddressCreationAttributes => {
	if (attr.city && attr.state) {
		return attr;
	}

	const info = getZipInfo(attr.zip) 
		|| getZipInfo(getZipFromAddress(attr.address2 || '')) 
		|| getZipInfo(getZipFromAddress(attr.address1));

	if (!info) {
		throw new Error('Zip code not found')
	}
	return { ...attr, city: info.city, state: info.state };
}

const getZipFromAddress = (address: string): string => {
	const zip = address.match(/\b\d{5}\b/);
	return zip ? zip[0] : '';
}

const getZipInfo = (zip: string): ZipInfo | null => {
	if (!zip) {
		return null;
	}
	const entry = stData.find(it => it.zip === zip);
	return entry || null;
}

export default getZipInfo;
