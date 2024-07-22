import stateData from '../data/stateData.json';

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


const getZipInfo = (zip: string): { city: string; state: string } | null => {
	const entry = stData.find(it => it.zip_code === zip);
	if (entry) {
		return { city: entry.city_name, state: entry.state_name };
	}
	return null
}

export default getZipInfo;
