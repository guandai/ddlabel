import React from 'react';

import TableSideBar from './TableSideBar';
import { Button } from '@mui/material';
import { DownloadForOfflineRounded } from '@mui/icons-material';

type Props = {
	search: string;
	setSearch: (search: string) => void;
  	setPage: (page: number) => void;
	capturePages: () => void;
};

const TransactionTableSideBar: React.FC<Props> = ({capturePages, search, setSearch, setPage}) => {
  return (
	<TableSideBar search={search} setSearch={setSearch} setPage={setPage} >
		<Button sx={{my: 2}} variant="contained" onClick={capturePages}><DownloadForOfflineRounded />Export to PDF</Button>
	</TableSideBar>
  );
};

export default TransactionTableSideBar;
