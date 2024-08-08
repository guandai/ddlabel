import React from 'react';
import { StyledSideBarBox } from '../util/styled';
import { List, ListItem } from '@mui/material';

type Props = {
	setTransactions: (transactions: any) => void;
	setMessage: React.Dispatch<React.SetStateAction<any>>;
};

const TransactionTableSideBar: React.FC<Props> = (prop) => {
	return (
		<StyledSideBarBox >
			<List sx={{ minHeight: '100vh' }}>
				<ListItem>{''}</ListItem>
			</List>
		</StyledSideBarBox>
	);
};

export default TransactionTableSideBar;
