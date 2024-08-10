import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TablePagination, TextField } from '@mui/material';
import { tryLoad } from '../util/errors';
import { makeStyles } from '@mui/styles';

import { GetRecordsReq, GetRecordsRes, isGetPackagesRes, isGetTransactionsRes } from '@ddlabel/shared';
import { MessageContent } from '../types';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Import date adapter
import { formatDateToString } from '../util/time';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import { tr } from 'date-fns/locale';

const PerPageList = [2, 20, 40, 80];
const useStyles = makeStyles({
	root: {
		borderRadius: '4px',
		border: '1px solid #ccc',
		margin: '8px',
		'& .MuiToolbar-root': {
			padding: '0px',
			minHeight: '40px',
		},
		'& .MuiTablePagination-spacer': {
			margin: '0px',
		},
		'& .MuiTablePagination-displayedRows': {
			margin: '0px',
			padding: '0px 8px',
		},
		'& .MuiTablePagination-selectLabel': {
			display: 'none',
		},
		'& .MuiTablePagination-input': {
			margin: '0 4px',
			display: 'none',
		},
		'& div.MuiTablePagination-actions': {
			marginLeft: '0',
			"& button": {
				padding: '2px',
			},
		}
	},
});

type Props = {
	perPageList?: number[];
	getRecords: (params: GetRecordsReq) => Promise<GetRecordsRes>;
	setRecords: (records: any) => void;
	setMessage: React.Dispatch<React.SetStateAction<MessageContent>>;
};

const RecordsQuery: React.FC<Props> = (prop) => {
	const { getRecords, setRecords, setMessage, perPageList = PerPageList } = prop;
	const [page, setPage] = useState(1);
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [perPage, setPerPage] = useState(20);
	const [total, setTotal] = useState(0);
	const [maxPage, setMaxPage] = useState(1);
	const [tracking, setTracking] = useState('');
	const [address, setAddress] = useState('');
	const classes = useStyles();

	useEffect(() => {
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
	}, [tracking, address, startDate, endDate, page, perPage, total, getRecords, setRecords, setMessage]);

	const muiChangePage = (_event: unknown, newPage: number) => {
		setPage(newPage + 1);
	};

	const muiChangePerPage = (event: SelectChangeEvent<number>) => {
		const newPerPage = parseInt(String(event.target.value), 10);
		setMaxPage(Math.ceil(total / newPerPage));
		setPerPage(newPerPage);
		setPage(1);
	};

	const onChangePage = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = getValidPage(parseInt(event.target.value, 10)) || 1;
		setPage(value);
	};

	const onChangeStartDate = (newDate: Date | null) => {
		if (!newDate) return;
		setStartDate(newDate);
		if (!endDate || endDate < newDate) setEndDate(newDate);
		setPage(1);
	}

	const onChangeEndDate = (newDate: Date | null) => {
		if (!newDate) return;
		setEndDate(newDate);
		if (!startDate || (startDate) > (newDate)) setStartDate(newDate);
		setPage(1);
	}

	const onChangeSearchTracking = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTracking(event.target.value);
		setPage(1);
	};
	
	const onChangeSearchAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAddress(event.target.value);
		setPage(1);
	};

	const getValidPage = (newPage: number) => Math.max(1, Math.min(maxPage, newPage));
	const onDisplayRows = ({ from, to, count }: { from: number; to: number; count: number }) => `${from}-${to} of ${count}`;

	const dataPickerStyle = {
		width: '160px',
		margin: '8px',
		'& label': { fontSize: '14px', top: '-5px' },
		'& input': { width:'100px', padding: '8px 0px 8px 8px' },
	};
	
	return (
		<Box width='100%' sx={{ mt: 2 }}>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<DatePicker
					label="Start Date"
					value={startDate}
					onChange={onChangeStartDate}
					format='yyyy-MM-dd'
					sx={dataPickerStyle}
				/>
			</LocalizationProvider>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<DatePicker
					sx={dataPickerStyle}
					label="To Date"
					value={endDate}
					onChange={onChangeEndDate}
					format='yyyy-MM-dd'
				/>
			</LocalizationProvider>
			<TextField
				size="small"
				variant="outlined"
				sx={{ m: 1, width: '150px', '& label': { fontSize: '14px' } }}
				label='Search Tracking'
				type='text'
				value={tracking}
				onChange={onChangeSearchTracking}
			/>
			<TextField
				size="small"
				variant="outlined"
				sx={{ m: 1, width: '150px' }}
				label='Search Address'
				type='text'
				value={address}
				onChange={onChangeSearchAddress}
			/>
			<Box sx={{ display: 'inline-flex', float: "inline-end" }}>
				<TextField
					variant="outlined"
					size="small"
					sx={{ m: 1, width: '80px' }}
					label='Page'
					type='number'
					value={page}
					onChange={onChangePage}
				/>
				<FormControl variant="outlined" size="small" sx={{ m: 1, width: '80px' }}>
					<InputLabel id="per-page-label">Per Page</InputLabel>
					<Select
						size="small"
						variant="outlined"
						labelId='per-page-label'
						label='Per Page'
						type='number'
						value={perPage}
						onChange={muiChangePerPage}
					>
						{perPageList.map((per) => (
							<MenuItem key={per} value={per}>
								{per}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>
			<TablePagination
				component={'span'}
				count={total} // Total number of packages
				rowsPerPage={perPage}
				labelDisplayedRows={onDisplayRows}
				page={page - 1}
				onPageChange={muiChangePage}
				showFirstButton
				showLastButton
				sx={{ display: 'inline-flex', float: "inline-end" }}
				classes={{ root: classes.root }}
			/>
		</Box>
	);
};

export default RecordsQuery;
