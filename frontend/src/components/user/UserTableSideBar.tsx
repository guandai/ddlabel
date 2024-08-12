// frontend/src/components/user/UsersTableSideBar.tsx
import React from 'react';
import { StyledSideBarBox } from '../../util/styled';
import { Button, List, ListItem } from '@mui/material';
import { Link } from 'react-router-dom';

type Props = {
	setUsers: (users: any) => void;
	setMessage: React.Dispatch<React.SetStateAction<any>>;
};

const UserTableSideBar: React.FC<Props> = (prop) => {
	return (
		<StyledSideBarBox >
			<List sx={{ minHeight: '100vh' }}>
				<ListItem>
					<Button fullWidth variant="contained" color="primary" component={Link} to="/register" sx={{ mr: 2 }}>
						Register
					</Button>
				</ListItem>
			</List>
		</StyledSideBarBox>
	);
};

export default UserTableSideBar;
