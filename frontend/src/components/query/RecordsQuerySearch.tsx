import React from 'react';
import { TextField } from '@mui/material';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Import date adapter
import { SearchOptions } from '../../types';

type Props = {
	setPage: React.Dispatch<React.SetStateAction<number>>;
	endDate: Date | null;
	setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
	startDate: Date | null;
	setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
	trackingNo: string;
	setTrackingNo: React.Dispatch<React.SetStateAction<string>>;
	address: string;
	setAddress: React.Dispatch<React.SetStateAction<string>>;
	email: string;
	setEmail: React.Dispatch<React.SetStateAction<string>>;
	searchList: SearchOptions[];

};

const RecordsQuerySearch: React.FC<Props> = (prop) => {
	const {
		setPage,
		startDate,
		setStartDate,
		endDate,
		setEndDate,
		trackingNo,
		setTrackingNo,
		address,
		setAddress,
		email,
		setEmail,
		searchList,
	} = prop

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
		setTrackingNo(event.target.value);
		setPage(1);
	};

	const onChangeSearchAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAddress(event.target.value);
		setPage(1);
	};

	const onChangeSearchEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
		setPage(1);
	};

	const dataPickerStyle = {
		width: '140px',
		margin: '8px',
		'& label': { fontSize: '14px', top: '-6px' },
		'& input': { fontSize: '14px', width: '90px', padding: '10px 0px 10px 8px' },
		'& .MuiInputAdornment-root': { margin: '0px' },
		'& .MuiInputLabel-formControl.Mui-focused': { top: '0px', transform: 'translate(14px, -9px) scale(0.75)' },
		"& .MuiFormLabel-filled": { top: '0px' },
	};
	const textSearchStyle = { m: 1, width: '130px', '& label': { fontSize: '14px' } };

	return (
		<>
			{searchList.includes('date') && (<><LocalizationProvider dateAdapter={AdapterDateFns}>
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
				</LocalizationProvider></>)}
			{searchList.includes('trackingNo') && <TextField
				size="small"
				variant="outlined"
				sx={textSearchStyle}
				label='Search Tracking'
				type='text'
				value={trackingNo}
				onChange={onChangeSearchTracking}
			/>}
			{searchList.includes('address') && <TextField
				size="small"
				variant="outlined"
				sx={textSearchStyle}
				label='Search Address'
				type='text'
				value={address}
				onChange={onChangeSearchAddress}
			/>}
			{searchList.includes('email') && <TextField
				size="small"
				variant="outlined"
				sx={textSearchStyle}
				label='Search Email'
				type='text'
				value={email}
				onChange={onChangeSearchEmail}
			/>}
		</>
	);
};

export default RecordsQuerySearch;
