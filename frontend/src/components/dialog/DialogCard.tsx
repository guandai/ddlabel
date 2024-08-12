import React from 'react';
import { Grid, Typography, Divider, Box } from '@mui/material';

type Prop = {
	gridNodes: GridNode[];
	title: string;
}

export type GridNode = {
	label: string;
	value: JSX.Element[] | JSX.Element | string | number | undefined | null;
}

const DialogCard: React.FC<Prop> = ({ gridNodes, title }) => {
	const getGridNodesValue = (value?: JSX.Element[] | JSX.Element | string | number | null) =>
		(typeof value === 'string') ?
			<Typography variant="body1">{value}</Typography>
			:
			value

	return (
		<Box>
			<Typography variant="h6" sx={{ fontSize: '1em' , textTransform: 'uppercase', color: 'primary.main' }} gutterBottom>{title}</Typography>
			<Divider />
			<Grid container spacing={2} sx={{ marginBottom: 4 }}>
				{gridNodes.map((gridNode: GridNode, index: number) => (
					<Grid item xs={6} key={index}>
						<Typography variant="body2"><strong>{gridNode.label}:</strong></Typography>
						{ getGridNodesValue(gridNode.value) }
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default DialogCard;
