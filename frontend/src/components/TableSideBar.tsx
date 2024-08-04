import React from 'react';
import { Box, TextField, List, ListItem } from '@mui/material';

type Props = {
	search: string;
	setSearch: (search: string) => void;
  	setPage: (page: number) => void;
	children: React.ReactNode;
};

const TableSideBar: React.FC<Props> = ({search, setSearch, setPage, children}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };
  
  return (
	<Box sx={{ backgroundColor: '#DDDDDD', flex: 1.5, height: '100vh', padding: 2 }}>
		<List>
			{children}
			<ListItem>
				<TextField
					label="Search"
					value={search}
					onChange={handleSearchChange}
					variant="outlined"
					fullWidth
					sx={{backgroundColor: 'white'}}
				/>
			</ListItem>			
		</List>
	</Box>
  );
};

export default TableSideBar;
