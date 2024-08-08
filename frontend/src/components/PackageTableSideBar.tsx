import React from 'react';
import { Button, List, ListItem } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import PackageUploadMapping from './PackageUploadMapping';
import { AddCircle } from '@mui/icons-material';
import { MessageContent } from '../types';
import { StyledSideBarBox } from '../util/styled';

type Props = {
	setPackages: (transactions: any) => void;
	setMessage: React.Dispatch<React.SetStateAction<MessageContent>>;
};

const PackageTableSideBar: React.FC<Props> = (prop) => {
	const navigate = useNavigate();

	return (
		<StyledSideBarBox >
			<List sx={{ minHeight: '100vh' }}>
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
			</List>
		</StyledSideBarBox>
	);
};

export default PackageTableSideBar;
