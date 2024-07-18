import stateData from '../data/stateData.json';

interface StateData {
  zip: string;
  city: string;
  state_name: string;
  county_name: string;
  timezone: string;
}

interface DataStructure {
	data: StateData[];
}

const stData = stateData as DataStructure;

const getZipInfo = (zip: string): { city: string; state: string } | null => {
	const entry = stData.data.find(it => it.zip === zip);
	if (entry) {
		return { city: entry.city, state: entry.state_name };
	}
	return null; // or throw an error, or return a default value
}

export default getZipInfo;
