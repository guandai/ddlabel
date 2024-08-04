import React from 'react';
import { Button, ListItem } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import PackageUploadMapping from './PackageUploadMapping';
import { AddCircle } from '@mui/icons-material';
import TableSideBar from './TableSideBar';

type Props = {
	search: string;
	setSearch: (search: string) => void;
	setPage: (page: number) => void;
};

const PackageTableSideBar: React.FC<Props> = ({ search, setSearch, setPage }) => {
	const navigate = useNavigate();

	return (
		<TableSideBar search={search} setSearch={setSearch} setPage={setPage}>
			<>
				<ListItem>
					<Button variant="contained" onClick={() => navigate('/packages/create')} startIcon={<AddCircle />} fullWidth>
						Add
					</Button >
				</ListItem >
				<ListItem>
					<PackageUploadMapping />
				</ListItem>
			</>
		</TableSideBar>
	);
};

export default PackageTableSideBar;
