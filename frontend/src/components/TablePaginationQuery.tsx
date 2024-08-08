import React, { useState, useEffect } from 'react';
import { Box, TablePagination, TextField } from '@mui/material';
import { tryLoad } from '../util/errors';
import { makeStyles } from '@mui/styles';

import { GetRecordsReq, GetRecordsRes, isGetPackagesRes, isGetTransactionsRes } from '@ddlabel/shared';
import { MessageContent } from '../types';


const useStyles = makeStyles({
    root: {
        borderRadius: '4px',
		border: '1px solid #ccc',
		margin: '8px',
		'& .MuiToolbar-root': {
			padding: 0,
			minHeight: '40px', // Set your desired min-height here
			'& div, & p': {
				margin: '0 8px', // Set your desired min-height here
			},
		},
    },
	displayedRows: {
		display: 'none',
	},
	input: {
		borderRadius: '4px',
		border: '1px solid #ccc',
	},
	actions: {
		"& button": {
			padding: '0px',
		},
		margin: '0px',
	},
});

type Props = {
	getRecords: (params: GetRecordsReq) => Promise<GetRecordsRes>;
	setRecords: (records: any) => void;
	setMessage: React.Dispatch<React.SetStateAction<MessageContent>>;
};

const TablePaginationQuery: React.FC<Props> = (prop) => {
	const { getRecords, setRecords, setMessage } = prop;
	const [page, setPage] = useState(1);
	const [startDate, setStartDate] = useState<string>('0000-00-00');
	const [endDate, setEndDate] = useState<string>('0000-00-00');
	const [perPage, setPerPage] = useState(20);
	const [total, setTotal] = useState(0);
	const [maxPage, setMaxPage] = useState(1);
	const [search, setSearch] = useState('');

	const classes = useStyles();

	useEffect(() => {
		const getFn = async () => {
			const params: GetRecordsReq = { 
				startDate: startDate, 
				endDate: endDate, 
				search,
				limit: perPage, 
				offset: (page - 1) * perPage
			};
			const recordsRes: GetRecordsRes = await getRecords(params);
			
			if (isGetPackagesRes(recordsRes)) {
				setRecords(recordsRes.packages);
			} else if (isGetTransactionsRes(recordsRes)) {
				setRecords(recordsRes.transactions);
			}

			setTotal(recordsRes.total);
		}
		tryLoad(setMessage, getFn);
	}, [search, startDate, endDate, page, perPage, getRecords, setRecords, setMessage]);

	const muiChangePage = (_event: unknown, newPage: number) => {
		setPage(newPage + 1);
	};

	const muiChangePerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newPerPage = parseInt(event.target.value, 10);
		setMaxPage(Math.ceil(total / newPerPage));
		setPerPage(newPerPage);
		setPage(1);
	};

	const onChangePage = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = getValidPage(parseInt(event.target.value, 10));
		setPage(value);
	};

	const onChangeStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = event.target.value;
		setStartDate(newDate);
		if (!endDate || new Date(endDate) < new Date(newDate)) setEndDate(newDate);
	}

	const onChangeEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newDate = (event.target.value);
		setEndDate(newDate);
		if (!startDate || new Date(startDate) > new Date(newDate)) setStartDate(newDate);
	}

	const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
	};

	const getValidPage = (newPage: number) => Math.max(1, Math.min(maxPage, Math.max(1, newPage)));
	const onDisplayRows = ({ from, to, count }: { from: number; to: number; count: number }) => `${from}-${to} of ${count}`;
		
	return (
		<Box width='100%' sx={{mt: 2}}>
			<TextField
				size="small"
				variant="outlined"
				sx={{ m: 1, width: '150px' }}
				label='Page'
				type='number'
				value={page}
				onChange={onChangePage}
				inputProps={{ min: 1, max: maxPage }}
			/>
			<TextField
				size="small"
				variant="outlined"
				sx={{ m: 1, width: '150px' }}
				label='Start Date'
				type='date'
				value={startDate}
				onChange={onChangeStartDate}
			/>
			<TextField
				size="small"
				variant="outlined"
				sx={{ m: 1, width: '150px' }}
				label='End Date'
				type='date'
				value={endDate}
				onChange={onChangeEndDate}
			/>
			<TextField
				size="small"
				variant="outlined"
				sx={{ m: 1, width: '150px' }}
				label='Search'
				type='text'
				value={search}
				onChange={onChangeSearch}
			/>
			<TablePagination
				component={'span'}
				rowsPerPageOptions={[2, 20, 40, 80]}
				count={total} // Total number of packages
				rowsPerPage={perPage}
				labelRowsPerPage="Per page:"
				labelDisplayedRows={onDisplayRows}
				page={page - 1}
				onPageChange={muiChangePage}
				onRowsPerPageChange={muiChangePerPage}
				showFirstButton
				showLastButton
				variant='head'
				sx={{display: 'inline-flex', float: "inline-end"}}
				classes={{					
					root: classes.root,
					input:	classes.input,
					actions: classes.actions,
					displayedRows: classes.displayedRows
				}}
			/>
		</Box>
	);
};

export default TablePaginationQuery;
