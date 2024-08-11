import React from 'react';
import { Grid, Typography, Divider, Box } from '@mui/material';

type Prop = {
	cards: PackageCardType[];
	title: string;
}

export type PackageCardType = {
	label: string;
	value: JSX.Element[] | JSX.Element | string | number | undefined | null;
}

const DialogCard: React.FC<Prop> = ({ cards, title }) => {
	const getCardValue = (value?: JSX.Element[] | JSX.Element | string | number | null) =>
		(typeof value === 'string') ?
			<Typography variant="body1">{value}</Typography>
			:
			value

	return (
		<Box>
			<Typography variant="h6" sx={{ color: "#474747" }} gutterBottom>{title}</Typography>
			<Divider />
			<Grid container spacing={2} sx={{ marginBottom: 4 }}>
				{cards.map((card: PackageCardType, index: number) => (
					<Grid item xs={6} key={index}>
						<Typography variant="body2"><strong>{card.label}:</strong></Typography>
						{ getCardValue(card.value) }
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default DialogCard;
