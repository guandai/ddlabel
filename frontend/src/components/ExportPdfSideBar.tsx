import React, { useEffect, useState } from 'react';

import TableSideBar from './TableSideBar';
import { Button, ListItem, TextField } from '@mui/material';
import { DownloadForOfflineRounded } from '@mui/icons-material';
import { GetPackagesReq } from '@ddlabel/shared';
import PackageApi from '../api/PackageApi';
import { tryLoad } from '../util/errors';

type Props = {
	capturePages: () => void;
	setPackages: (packages: any) => void;
	setMessage: (message: any) => void;
};

const ExportPdfSideBar: React.FC<Props> = (prop) => {
	const { capturePages, setPackages, setMessage } = prop;
	const [page, setPage] = useState(0);
	const [perPage, setPerPage] = useState(50);
	const [search, setSearch] = useState('');
	
	const [total, setTotal] = useState(0);

	useEffect(() => {
		const getPackages = async () => {
		const params: GetPackagesReq = { limit: perPage, offset: page * perPage, search };
		const packagesRes = await PackageApi.getPackages(params);
			setPackages(packagesRes.packages);
			setTotal(packagesRes.total);
		}
		tryLoad(setMessage, getPackages);
	}, [page, perPage, search]);
	
	const changePerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPerPage(parseInt(event.target.value, 10));
		setPage(0);
	  };
	const changePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};
	
	return (
		<TableSideBar search={search} setSearch={setSearch} setPage={setPage} >
			<ListItem>
				<Button sx={{ my: 2 }} fullWidth variant="contained" onClick={capturePages}><DownloadForOfflineRounded />Export to PDF</Button>
			</ListItem>
			<ListItem>
				<TextField
					fullWidth
					label="Rows per page"
					type="number"
					value={perPage}
					onChange={changePerPage}
					variant="outlined"
					sx={{backgroundColor: 'white'}}
				/>
			</ListItem>
			<ListItem>
				<TextField
					fullWidth
					label="Page"
					type="number"
					value={page + 1} // Displaying 1-indexed page number
					onChange={(e) => changePage(null, Math.max(0, parseInt(e.target.value, 10) - 1))}
					variant="outlined"
					sx={{backgroundColor: 'white'}}
				/>
			</ListItem>
			
		</TableSideBar>
	);
};

export default ExportPdfSideBar;
