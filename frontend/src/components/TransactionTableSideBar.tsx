import React from 'react';

import TableSideBar from './TableSideBar';

type Props = {
	search: string;
	setSearch: (search: string) => void;
  	setPage: (page: number) => void;
};

const TransactionTableSideBar: React.FC<Props> = ({search, setSearch, setPage}) => {
  return (
	<TableSideBar search={search} setSearch={setSearch} setPage={setPage} >
		<></>
	</TableSideBar>
  );
};

export default TransactionTableSideBar;
