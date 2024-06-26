import React from 'react';
import { Button, List, ListItem } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import PackageUploadMapping from '../upload/PackageUploadMapping';
import { AddCircle, Download, PictureAsPdfTwoTone } from '@mui/icons-material';
import { StyledSideBarBox } from '../../util/styled';
import { FilterConfig } from '../query/RecordsQuery';
import PackageApi from '../../api/PackageApi';
import { toDateTime } from '../../util/time';

type Props = {
	filter: FilterConfig;
};

const PackageTableSideBar: React.FC<Props> = (prop) => {
	const { filter } = prop;
	const navigate = useNavigate();

	const onExportCsv = async () => {
		try {
			const csv = await PackageApi.exportPackage({...filter, startDate: toDateTime(filter.startDate), endDate: toDateTime(filter.endDate)});
			// Make the CSV downloadable by creating a Blob and a temporary anchor element
			const url = window.URL.createObjectURL(new Blob([csv]))
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'packages.csv');
			document.body.appendChild(link);
			link.click();
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
				<ListItem>
					<Button
						variant="contained"
						onClick={() => navigate('/pdfs')}
						startIcon={<PictureAsPdfTwoTone />}
						fullWidth
					>
						Labels
					</Button >
				</ListItem >
			</List>
		</StyledSideBarBox>
	);
};

export default PackageTableSideBar;
