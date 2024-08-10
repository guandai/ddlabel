import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TablePagination, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';

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
	perPage: number;
	setPerPage: React.Dispatch<React.SetStateAction<number>>;
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	total: number;
	setTotal: React.Dispatch<React.SetStateAction<number>>;
	maxPage: number;
	setMaxPage: React.Dispatch<React.SetStateAction<number>>;
};

const RecordsPageQuery: React.FC<Props> = (prop) => {
	const { perPageList = PerPageList, perPage, setPerPage, page, setPage, total, setTotal, maxPage, setMaxPage } = prop;
	const classes = useStyles();

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

	const getValidPage = (newPage: number) => Math.max(1, Math.min(maxPage, newPage));
	const onDisplayRows = ({ from, to, count }: { from: number; to: number; count: number }) => `${from}-${to} of ${count}`;

	return (
		<>
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
		</>
	);
};

export default RecordsPageQuery;
