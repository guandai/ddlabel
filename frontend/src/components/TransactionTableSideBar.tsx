import React from 'react';

import TableSideBar from './TableSideBar';
import TransactionApi from '../api/TransectionApi';
import { ListItem } from '@mui/material';
import TablePaginationQuery from './TablePaginationQuery';

type Props = {
	setTransactions: (transactions: any) => void;
	setMessage: React.Dispatch<React.SetStateAction<any>>;
};

const TransactionTableSideBar: React.FC<Props> = (prop) => {
	const { setTransactions, setMessage } = prop;
	return (
		<TableSideBar getRecords={TransactionApi.getTransactions} setRecords={setTransactions} setMessage={setMessage} >
			<ListItem>
				<TablePaginationQuery getRecords={TransactionApi.getTransactions} setRecords={setTransactions} setMessage={setMessage} />
			</ListItem>
		</TableSideBar>
	);
};

export default TransactionTableSideBar;
