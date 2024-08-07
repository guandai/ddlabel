import React, { useEffect, useState } from 'react';
import { Box, TextField, List, ListItem } from '@mui/material';
import { GetRecordsReq, GetRecordsRes, Model } from '@ddlabel/shared';
import { MessageContent } from '../types';
import { tryLoad } from '../util/errors';

type Props = {
	children: React.ReactNode;
	getRecords: (params?: GetRecordsReq) => Promise<GetRecordsRes>;
	setRecords: (records: any) => void;
	setMessage: React.Dispatch<React.SetStateAction<MessageContent>>;
};

const TableSideBar: React.FC<Props> = (prop) => {
	const { setMessage, setRecords, getRecords, children } = prop;
	const [search, setSearch] = useState('');

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
	};

	useEffect(() => {
		const getPackages = async () => {
			const params: GetRecordsReq = { search};
			const recordsRes: GetRecordsRes = await getRecords(params);
			const records = 'packages' in recordsRes ? recordsRes.packages : recordsRes.transactions;
			setRecords(records);
		}
		tryLoad(setMessage, getPackages);
	}, [search, setRecords, setMessage]);

	return (
		<Box sx={{ backgroundColor: '#DDDDDD', width: "200px", height: '100hv', overflowY: "auto", padding: 2 }}>
			<List sx={{minHeight: '100vh'}}>
				{children}
				<ListItem>
					<TextField
						label="Search Tracking"
						value={search}
						onChange={handleSearchChange}
						variant="outlined"
						fullWidth
						sx={{backgroundColor: 'white',   borderRadius: '5px' }}
					/>
				</ListItem>
			</List>
		</Box>
	);
};

export default TableSideBar;
