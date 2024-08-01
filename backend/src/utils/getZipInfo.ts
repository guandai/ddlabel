import { ZipInfo } from '@ddlabel/shared';
import stateData from '../data/stateSmall.json';

interface StateData {
	zip: string;
	city: string;
	state: string;
	county?: string;
	tz?: string;
}

type DataStructure = StateData[];

const stData = stateData as DataStructure;

export const getCityState = (zip: string, city: string, state: string) => {
	let info;
	if (city && state) {
		return { city, state }
	}

	info = getZipInfo(zip);
	if (!info) {
		throw new Error('Invalid zip code to get city and state');
	}
	return info;
}

const getZipInfo = (zip: string): ZipInfo | null => {
	const entry = stData.find(it => it.zip === zip);
	return entry || null;
}

export default getZipInfo;
