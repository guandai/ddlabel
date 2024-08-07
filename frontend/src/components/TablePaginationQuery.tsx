import React, { useState, useEffect } from 'react';
import { Box, styled, TablePagination, TablePaginationProps, TextField } from '@mui/material';
import { tryLoad } from '../util/errors';

import { GetRecordsReq, GetRecordsRes } from '@ddlabel/shared';
import { MessageContent } from '../types';
import { Padding } from '@mui/icons-material';
import { display } from 'html2canvas/dist/types/css/property-descriptors/display';

const StyledTablePagination = styled((props: TablePaginationProps) => (
	<TablePagination {...props} />
))(({ theme }) => ({
	'& .MuiToolbar-root p': {
		marginTop: '0px',
	},
	'& .MuiToolbar-root': {
		padding: '0px',
		display: 'block',
	},
	'& .MuiTablePagination-selectLabel': {
		display: 'inline-flex',
		
	},
	'& .MuiInputBase-root ': {
		display: 'inline-flex',
		marginLeft: '4px',
		marginRight: '0px',
	},
	'& .MuiTablePagination-displayedRows': {
		display: 'block',
		width: 'fit-content',
		margin: 'auto',
		marginLeft: '0px',
	},
	'.MuiTablePagination-actions': {
		margin: 'auto',
		width: 'fit-content',
	},
}));



type Props = {
	getRecords: (params?: GetRecordsReq) => Promise<GetRecordsRes>;
	setRecords: (records: any) => void;
	setMessage: React.Dispatch<React.SetStateAction<MessageContent>>;
};

const TablePaginationQuery: React.FC<Props> = (prop) => {
	const { getRecords, setRecords, setMessage } = prop;
	const [page, setPage] = useState(1);
	const [startPage, setStartPage] = useState(1);
	const [endPage, setEndPage] = useState(1);
	const [perPage, setPerPage] = useState(20);
	const [total, setTotal] = useState(0);
	const [maxPage, setMaxPage] = useState(1);

	useEffect(() => {
		const getPackages = async () => {
			const params: GetRecordsReq = { startPage, endPage, limit: perPage, offset: (page - 1) * perPage };
			const recordsRes: GetRecordsRes = await getRecords(params);
			const records = 'packages' in recordsRes ? recordsRes.packages : recordsRes.transactions;
			setRecords(records);
			setTotal(recordsRes.total);
		}
		tryLoad(setMessage, getPackages);
	}, [page, perPage, setRecords, setMessage]);

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
		setStartPage(value);
		setEndPage(value);
	};

	const onChangeStartPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = getValidPage(parseInt(event.target.value, 10));
		setStartPage(value);
		if (!endPage || endPage < value) setEndPage(value);
		setPage(value);
	}

	const onChangeEndPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = getValidPage(parseInt(event.target.value, 10));
		setEndPage(value);
		if (!startPage || startPage > value) setStartPage(value);
		setPage(value);
	}

	const getValidPage = (newPage: number) => Math.max(1, Math.min(maxPage, Math.max(1, newPage)));

	const onDisplayRows = ({ from, to, count }: { from: number; to: number; count: number }) => `Page: ${from}-${to} of ${count}`;

	const numberBox = (label: string, value: number | undefined, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void) =>
		<Box sx={{ mt: 2 }}>
			<TextField
				fullWidth
				label={label}
				type="number"
				value={value} // Displaying 1-indexed page number
				onChange={onChange}
				variant="outlined"
				sx={{ mb: 2 }}
				inputProps={{ style: { height: 8 }, min: 1, max: maxPage }}
			/>
		</Box>
	return (
		<Box sx={{margin: 0, padding: 0}}>
			<StyledTablePagination
				component="div"
				rowsPerPageOptions={[20, 40, 80]}
				count={total} // Total number of packages
				rowsPerPage={perPage}
				labelRowsPerPage="Per page:"
				labelDisplayedRows={onDisplayRows}
				page={page - 1}
				onPageChange={muiChangePage}
				onRowsPerPageChange={muiChangePerPage}
				showFirstButton
				showLastButton
			/>
			{numberBox('Current Page', page, onChangePage)}
			{numberBox('Start Page', startPage, onChangeStartPage)}
			{numberBox('End Page', endPage, onChangeEndPage)}
		</Box>
	);
};

export default TablePaginationQuery;
