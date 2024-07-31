import React from 'react';
import { Box, Select, MenuItem, Typography, Grid, FormControl } from '@mui/material';
import { KeyCsvRecord, HeaderMapping, CSV_KEYS, CSV_KEYS_REQUIRED } from '@ddlabel/shared';

type Prop = {
	csvHeaders: string[];
	headerMapping: HeaderMapping;
	handleMappingChange: (keys: KeyCsvRecord, value: string) => void;
}

const CsvHeaderList: React.FC<Prop> = (prop) => {
	const { csvHeaders, headerMapping, handleMappingChange } = prop;
	const third = Math.ceil(CSV_KEYS.length / 3);
	const firstThird = CSV_KEYS.slice(0, third);
	const secondThird = CSV_KEYS.slice(third, third * 2);
	const lastThird = CSV_KEYS.slice(third * 2);
	const keysRows = [firstThird, secondThird, lastThird];

	return (<Grid container spacing={2}>{keysRows.map((keysRow, idx) => (
		<Grid key={idx} item xs={4}>
			{keysRow.map((key) => (
				<Box key={key} mb={2}>
					<Typography variant="body2">{key}</Typography>
					<FormControl fullWidth>
						<Select
							variant="standard"
							required={CSV_KEYS_REQUIRED.includes(key)}
							value={headerMapping && headerMapping[key] ? headerMapping[key] : ''}
							onChange={e => handleMappingChange(key, String(e.target.value))}
						>
							<MenuItem key='empty' value=""><em>None</em></MenuItem>
							{csvHeaders.map((header) => (
								<MenuItem key={header} value={header}>
									{header}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			))}
		</Grid>
	))}
	</Grid>);
}
export default CsvHeaderList;
