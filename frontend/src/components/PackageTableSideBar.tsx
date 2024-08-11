import React from 'react';
import { Button, List, ListItem } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import PackageUploadMapping from './PackageUploadMapping';
import { AddCircle, Download } from '@mui/icons-material';
import { StyledSideBarBox } from '../util/styled';
import { FilterConfig } from './RecordsQuery';
import PackageApi from '../api/PackageApi';

type Props = {
	filter: FilterConfig;
};

const PackageTableSideBar: React.FC<Props> = (prop) => {
	const { filter } = prop;
	const navigate = useNavigate();

	const onExportCsv = async () => {
		try {
			// Make the GET request to your API endpoint
			const csv = await PackageApi.exportPackage({...filter, startDate: filter.startDate?.toISOString() || "", endDate: filter.endDate?.toISOString() || ""});

			// Convert the response to a Blob
			const url = window.URL.createObjectURL(new Blob([csv]));

			// Create a link element and set its href to the Blob URL
			const link = document.createElement('a');
			link.href = url;

			// Set the download attribute to specify the filename
			link.setAttribute('download', 'packages.csv');

			// Append the link to the document body
			document.body.appendChild(link);

			// Programmatically click the link to trigger the download
			link.click();

			// Remove the link from the document
			link.parentNode?.removeChild(link);

		} catch (error) {
			// Handle errors
			console.error('Error downloading the CSV:', error);
		}
	}

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
				<ListItem>
					<Button variant="contained"
						onClick={onExportCsv}
						startIcon={<Download />}
						fullWidth>Export Csv</Button>
				</ListItem>
			</List>
		</StyledSideBarBox>
	);
};

export default PackageTableSideBar;
