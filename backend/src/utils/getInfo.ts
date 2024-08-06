import { AddressChange, CsvRecord, extractAddressZip, PortInfo, ZipInfo } from '@ddlabel/shared';
import { loadCsvData } from './loadCsv';

type PortData = {
  zip: string;
  sortCode: string;
  state: string;
  city: string;
  proposal: string;
  startZip: string;
}

type StateData = {
  zip: string;
  city: string;
  state: string;
  county?: string;
  tz?: string;
}

export const fixCityState = async <T extends AddressChange>(attr: T): Promise<T> => {
  if (attr.city && attr.state) { return attr }
  const info = await getZipInfo(attr.zip)
    || await getZipInfo(extractAddressZip(attr.address2))
    || await getZipInfo(extractAddressZip(attr.address1));
  if (!info) {
    throw new Error(`ZipInfo not found for ${attr.zip}`);
  }
  return { ...attr, city: info.city, state: info.state };
}

export const fixPort = async <T extends AddressChange>(attr: T): Promise<T> => {
  if (attr.proposal) { return attr }
  const info = await getPortInfo(attr.zip)
  if (!info) {
    throw new Error(`Port not found for ${attr.zip}`);
  }
  return { ...attr, proposal: info.proposal, sortCode: info.sortCode };
}

const loadData = async <T>(fileName: string) => loadCsvData<T>(`../data/${fileName}`)
  .then((data) => data).catch((error) => {
    console.error(`Error loading ${fileName} data:`, error);
  });

let stateSmall: StateData[];
let portSmall: PortData[];

const getZipInfo = async (zip: string): Promise<ZipInfo | undefined> => {
  stateSmall = stateSmall || await loadData<StateData>('stateSmall.csv');
  if (!zip || !stateSmall) { return }
  return stateSmall.find(x => x.zip === zip);
};

const getPortInfo = async (zip: string): Promise<PortInfo | undefined> => {
  portSmall = portSmall || await loadData<PortData>('portSmall.csv');
  if (!zip || !portSmall) { return }
  return portSmall.find(x => x.zip === zip);
};


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
