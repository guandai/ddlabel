import React from 'react';
import { Button, ListItem } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import PackageUploadMapping from './PackageUploadMapping';
import { AddCircle } from '@mui/icons-material';
import TableSideBar from './TableSideBar';
import PackageApi from '../api/PackageApi';
import { MessageContent } from '../types';

type Props = {
	setPackages: (transactions: any) => void;
	setMessage: React.Dispatch<React.SetStateAction<MessageContent>>;
};

const PackageTableSideBar: React.FC<Props> = (prop) => {
	const { setPackages, setMessage } = prop;
	const navigate = useNavigate();

	return (
		<TableSideBar
			getRecords={PackageApi.getPackages}
			setRecords={setPackages}
			setMessage={setMessage}
		>
			<ListItem>
				<Button
					variant="contained"
					onClick={() => navigate('/packages/create')}
					startIcon={<AddCircle />}
					fullWidth
				>
					Add
				</Button >
			</ListItem >
			<ListItem>
				<PackageUploadMapping />
			</ListItem>
		</TableSideBar>
	);
};

export default PackageTableSideBar;
