// frontend/src/components/beans/BeansTableSideBar.tsx
import React from 'react';
import { StyledSideBarBox } from '../../util/styled';
import { Button, List, ListItem } from '@mui/material';
import { Link } from 'react-router-dom';

const BeansTableSideBar: React.FC = () => {
	return (
		<StyledSideBarBox >
			<List sx={{ minHeight: '100vh' }}>
				<ListItem>
					<Button fullWidth variant="contained" color="primary" component={Link} to="/beans/routes" sx={{ mr: 2 }}>
						View Routes
					</Button>
				</ListItem>
				<ListItem>
					<Button fullWidth variant="contained" color="primary" component={Link} to="/beans/items" sx={{ mr: 2 }}>
						View Stops
					</Button>
				</ListItem>
			</List>
		</StyledSideBarBox>
	);
};

export default BeansTableSideBar;
