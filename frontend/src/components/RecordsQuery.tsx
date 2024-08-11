import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { tryLoad } from '../util/errors';

import { GetRecordsReq, GetRecordsRes, isGetPackagesRes, isGetTransactionsRes } from '@ddlabel/shared';
import { MessageContent } from '../types';
import { formatDateToString } from '../util/time';
import RecordsQuerySearch from './RecordsQuerySearch';
import RecordsPageQuery from './RecordsPageQuery';

const PerPageList = [5, 10, 20, 40, 80];

export type FilterConfig = {
	startDate: Date | null;
	endDate: Date | null;
	tracking: string;
	address: string;
};
	
type Props = {
	perPageList?: number[];
	setFilter?: (filter: FilterConfig) => void;
	getRecords: (params: GetRecordsReq) => Promise<GetRecordsRes>;
	setRecords: (records: any) => void;
	setMessage: React.Dispatch<React.SetStateAction<MessageContent>>;
};

const RecordsQuery: React.FC<Props> = (prop) => {
	const { getRecords, setRecords, setMessage, setFilter, perPageList = PerPageList } = prop;
	const [page, setPage] = useState(1);
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [perPage, setPerPage] = useState(perPageList[0]);
	const [total, setTotal] = useState(0);
	const [maxPage, setMaxPage] = useState(1);
	const [tracking, setTracking] = useState('');
	const [address, setAddress] = useState('');

	useEffect(() => {
		setFilter && setFilter({ startDate, endDate, tracking, address });
		const getFn = async () => {
			const params: GetRecordsReq = {
				startDate: startDate ? formatDateToString(startDate) : '',
				endDate: endDate ? formatDateToString(endDate) : '',
				tracking,
				address,
				limit: perPage,
				offset: (page - 1) * perPage
			};
			const recordsRes: GetRecordsRes = await getRecords(params);

			if (isGetPackagesRes(recordsRes)) {
				setRecords(recordsRes.packages);
			} else if (isGetTransactionsRes(recordsRes)) {
				setRecords(recordsRes.transactions);
			}
			setMaxPage(Math.ceil(recordsRes.total / perPage));
			setTotal(recordsRes.total);
		}
		tryLoad(setMessage, getFn);
	}, [tracking, address, startDate, endDate, page, perPage, total, getRecords, setRecords, setMessage, setFilter]);

	return (
		<Box width='100%' sx={{ mt: 2 }}>
			<RecordsQuerySearch
				setPage={setPage}
				startDate={startDate}
				setStartDate={setStartDate}
				endDate={endDate}
				setEndDate={setEndDate}
				tracking={tracking}
				setTracking={setTracking}
				address={address}
				setAddress={setAddress}
			/>
			<RecordsPageQuery
				page={page}
				setPage={setPage}
				perPage={perPage}
				setPerPage={setPerPage}
				total={total}
				maxPage={maxPage}
				setMaxPage={setMaxPage}
				perPageList={perPageList} 
			/>
		</Box>
	);
};

export default RecordsQuery;
