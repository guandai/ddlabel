export type BaseData = {
	length: number,
	width: number,
	height: number,
	weight: number,
	reference: string,
	fromName: string,
	fromAddress1: string,
	fromAddress2: string,
	fromAddressZip: string,
	toName: string,
	toAddress1: string,
	toAddress2: string,
	toAddressZip: string,
}

export type KeyOfBaseData = keyof BaseData;
export type HeaderMapping = { [k in KeyOfBaseData]: KeyOfBaseData | string | null };
