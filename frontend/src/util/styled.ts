

import { styled, Theme } from '@mui/material/styles';
import { Box, TableCell } from '@mui/material';
import { BeansStatus } from '@ddlabel/shared';
import { toDateTime } from './time';

export const StyledBox = styled(Box)({
	marginTop: '64px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'left',
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

export const PrintOnlyFlexBox = styled(FlexBox)`
	@media print {
		body * {
			display: none;
		}
	
		.print-only {
			display: block;
			visibility: visible;
			position: relative;
			left: 0;
			top: 0;
			width: 100%;
		}
		
		.print-only .printable-label {
			page-break-inside: avoid;
		}
	}
`;

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


type StatusLabelProps = {
	status: BeansStatus;
};
export const StatusLabel = styled('span')(({ status }: StatusLabelProps) => ({
	display: 'inline-block',
	padding: '0.25em 0.75em',
	borderRadius: '12px',
	color: 'white',
	fontWeight: 'bold',
	fontSize: '0.75em',
	...(status === 'FINISHED' && {
	  backgroundColor: '#4c9950',  // Green
	}),
	...(status === 'FAILED' && {
	  backgroundColor: '#bb2222',  // Red
	}),
	...(status === 'MISLOAD' && {
	  backgroundColor: '#dd7700',  // Orange
	}),
	...(status === 'DELETED' && {
	  backgroundColor: '#8e8e8e',  // Grey
	}),
	...(status === 'NEW' && {
	  backgroundColor: '#2177e0',  // Blue
	}),
	...(status === 'IN_PROCESS' && {
	  backgroundColor: '#CC9922',  // Yellow
	}),
	...(status === 'NOLOCATION' && {
	  backgroundColor: '#9c27b0',  // Purple
	}),
	...(status === 'N/A' && {
	  backgroundColor: '#8e8e8e',  // Grey
	}),
  }));
  
export const Line = styled('span')({
	display: 'block',
	margin: '0.5em 0',
	height: '1px',
	backgroundColor: '#ccc',
	
	fontSize: '12px',
	lineHeight: '12px',
	width: '100%',
	borderBottom: '1px solid #ccc',
});


export const toCapitalize = (inputString: string) =>{
    if (!inputString) {
        return "";
    }
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

export const spacedTitle = (title: string) => {
	return title.replace(/([A-Z-_])/g, ' $1').toLowerCase();
}

export const formatNodeValue = (key: string, value: any) => {
	const lowKey = key.toLowerCase();
	if (lowKey.includes('createdat') || lowKey.includes('updatedat')) {
		return toDateTime(new Date(value)).toLocaleString();
	}
	return value;
}


export const skipTitle = (title: string) => {
	const lowTitle = title.toLowerCase();
	return lowTitle.includes('colorset') || lowTitle.includes('display')
}
