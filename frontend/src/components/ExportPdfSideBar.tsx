import React from 'react';

import { Button, List, ListItem } from '@mui/material';
import { DownloadForOfflineRounded } from '@mui/icons-material';
import { StyledSideBarBox } from '../util/styled';

type Props = {
	capturePages: () => void;
};

const ExportPdfSideBar: React.FC<Props> = (prop) => {
	const { capturePages } = prop;

	return (
		<StyledSideBarBox >
			<List sx={{ minHeight: '100vh' }}>
				<ListItem>
					<Button
						fullWidth
						variant="contained"
						onClick={capturePages}><DownloadForOfflineRounded
						/>
						Export to PDF
					</Button>
				</ListItem>
			</List>
		</StyledSideBarBox>
	);
};

export default ExportPdfSideBar;
