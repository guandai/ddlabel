import stateData from '../data/state.json';

interface StateData {
	zip_code: string;
	city_name: string;
	state_name: string;
	county_name: string;
	timezone: string;
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

export type ZipInfo = {
	city: string;
	state: string;
	county: string;
}

const getZipInfo = (zip: string): ZipInfo | null => {
	const entry = stData.find(it => it.zip_code === zip);
	if (entry) {
		const { city_name, state_name, county_name } = entry
		return { city: city_name, state: state_name, county: county_name };
	}
	return null
}

export default getZipInfo;
