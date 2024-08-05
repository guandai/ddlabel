import { CsvRecord, extractAddressZip, PortEnum, ZipInfo } from '@ddlabel/shared';
import { AddressCreationAttributes } from '../models/Address';
import { loadCsvData } from './loadCsv';

type StateData ={
  zip: string;
  city: string;
  state: string;
  county?: string;
  tz?: string;
}


const loadData = async () => {
  return loadCsvData<StateData>('../data/stateSmall.csv').then((data) => data).catch((error) => {
    console.error('Error loading CSV data:', error);
  });
};

export const fixCityState = async (attr: AddressCreationAttributes): Promise< AddressCreationAttributes> => {
  if (attr.city && attr.state) { return attr }

  const info = await getZipInfo(attr.zip) 
    || await getZipInfo(extractAddressZip(attr.address2)) 
    || await getZipInfo(extractAddressZip(attr.address1));

  if (!info) {
    throw new Error('Zip code not found');
  }
  return { ...attr, city: info.city, state: info.state };
}

export const getPort = (zip: string): PortEnum => {
  return PortEnum.LAX;
}

const getZipInfo = async (zip: string): Promise< ZipInfo | null> => {
  if (!zip) { return null }
  const stData = await loadData();
  if (!stData) { return null }
  const entry = await stData.find(it => it.zip === zip);
  return entry || null;
}

export const getFromZip = (mappedData: CsvRecord): string =>
  mappedData['fromAddressZip'] && mappedData['fromAddressZip']
  || mappedData['fromAddress2'] && extractAddressZip(mappedData['fromAddress2'])
  || extractAddressZip(mappedData['fromAddress1'])
  || '';

export const getToZip = (mappedData: CsvRecord): string =>
  mappedData['toAddressZip'] && mappedData['toAddressZip']
  || mappedData['toAddress2'] && extractAddressZip(mappedData['toAddress2'])
  || extractAddressZip(mappedData['toAddress1'])
  || '';

export default getZipInfo;
