import React, { useEffect, useState } from 'react';

import TableSideBar from './TableSideBar';
import { Button, ListItem, TextField } from '@mui/material';
import { DownloadForOfflineRounded } from '@mui/icons-material';
import { PackageModel } from '@ddlabel/shared';
import PackageApi from '../api/PackageApi';
import { MessageContent } from '../types';

type Props = {
	capturePages: () => void;
	setPackages: (packages: PackageModel[]) => void;
	setMessage: React.Dispatch<React.SetStateAction<MessageContent>>;
};

const ExportPdfSideBar: React.FC<Props> = (prop) => {
	const { capturePages, setPackages, setMessage } = prop;

	return (
		<TableSideBar
			setRecords={setPackages}
			setMessage={setMessage}
			getRecords={PackageApi.getPackages}
		>
			<ListItem>
				<Button
					sx={{ my: 2 }}
					fullWidth
					variant="contained"
					onClick={capturePages}><DownloadForOfflineRounded
					/>
					Export to PDF
				</Button>
			</ListItem>
		</TableSideBar>
	);
};

export default ExportPdfSideBar;
