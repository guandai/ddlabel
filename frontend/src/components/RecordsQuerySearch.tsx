import React from 'react';
import { TextField } from '@mui/material';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Import date adapter


type Props = {
	setPage: React.Dispatch<React.SetStateAction<number>>;
	endDate: Date | null;
	setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
	startDate: Date | null;
	setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
	tracking: string;
	setTracking: React.Dispatch<React.SetStateAction<string>>;
	address: string;
	setAddress: React.Dispatch<React.SetStateAction<string>>;
};

const RecordsQuerySearch: React.FC<Props> = (prop) => {
	const { setPage, startDate, setStartDate, endDate, setEndDate, tracking, setTracking, address, setAddress } = prop

	const onChangeStartDate = (newDate: Date | null) => {
		if (!newDate) return;
		setStartDate(newDate);
		if (!endDate || endDate < newDate) setEndDate(newDate);
		setPage(1);
	}

	const onChangeEndDate = (newDate: Date | null) => {
		if (!newDate) return;
		setEndDate(newDate);
		if (!startDate || (startDate) > (newDate)) setStartDate(newDate);
		setPage(1);
	}

	const onChangeSearchTracking = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTracking(event.target.value);
		setPage(1);
	};
	
	const onChangeSearchAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAddress(event.target.value);
		setPage(1);
	};

	const dataPickerStyle = {
		width: '140px',
		margin: '8px',
		'& label': { fontSize: '14px', top: '-5px' },
		'& input': { width:'90px', padding: '8px 0px 8px 8px' },
		'& .MuiInputAdornment-root': { margin: '0px' }
	};
	const textSearchStyle = { m: 1, width: '130px', '& label': { fontSize: '14px' } };
	
	return (
		<>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<DatePicker
					label="Start Date"
					value={startDate}
					onChange={onChangeStartDate}
					format='yyyy-MM-dd'
					sx={dataPickerStyle}
				/>
			</LocalizationProvider>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<DatePicker
					sx={dataPickerStyle}
					label="To Date"
					value={endDate}
					onChange={onChangeEndDate}
					format='yyyy-MM-dd'
				/>
			</LocalizationProvider>
			<TextField
				size="small"
				variant="outlined"
				sx={textSearchStyle}
				label='Search Tracking'
				type='text'
				value={tracking}
				onChange={onChangeSearchTracking}
			/>
			<TextField
				size="small"
				variant="outlined"
				sx={textSearchStyle}
				label='Search Address'
				type='text'
				value={address}
				onChange={onChangeSearchAddress}
			/>
		</>
	);
};

export default RecordsQuerySearch;
