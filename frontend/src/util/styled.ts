

import { styled, Theme } from '@mui/material/styles';
import { Box, TableCell } from '@mui/material';

export const StyledBox = styled(Box)({
	marginTop: '64px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	width: '100%',
	flex: 8,
	padding: '0 2em',
});

export const FlexBox = styled(Box)({
	display: 'flex',
	justifyContent: 'space-between',
	maxWidth: '100%',
	margin: 0,
	padding: 0,
});

export const scaleStyle = (cssSize: string, scale: number) => {
	const parts = cssSize.match(/(\d+)(\w+)/);
	if (!parts) return cssSize;
	const [, size, unit] = parts;
	return `${parseFloat(size) * scale}${unit}`;
};


export const StyledSideBarBox = styled(Box)(
	{
		backgroundColor: '#DDDDDD',
		width: "200px",
		height: '100hv',
		overflowY: "auto",
		padding: 2
	}
);

export const backDropStyle = { color: '#fff', zIndex: (theme: Theme) => theme.zIndex.drawer + 1 }

export const StyledTabelCell = styled(TableCell)`
	padding: 2px 8px;
`;
