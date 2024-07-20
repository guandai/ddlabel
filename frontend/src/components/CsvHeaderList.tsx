import React from 'react';
import { Box, Select, MenuItem, Typography, Grid, FormControl } from '@mui/material';
import { CsvHeaders, HeaderMapping, KeyOfBaseData } from '../types';

type Prop = {
	fields: KeyOfBaseData[];
	csvHeaders: CsvHeaders;
	headerMapping: HeaderMapping;
	handleMappingChange: (field: KeyOfBaseData, value: string) => void;
}

const CsvHeaderList: React.FC<Prop> = (prop) => {
	const { fields, csvHeaders, headerMapping, handleMappingChange } = prop;
	const third = Math.ceil(fields.length / 3);
	const firstThird = fields.slice(0, third);
	const secondThird = fields.slice(third, third * 2);
	const lastThird = fields.slice(third * 2);
	const fieldsRows = [firstThird, secondThird, lastThird];

	return (<Grid container spacing={2}>{fieldsRows.map((fieldRow, idx) => (
		<Grid key={idx} item xs={4}>
			{fieldRow.map((field) => (
				<Box key={field} mb={2}>
					<Typography variant="body2">{field}</Typography>
					<FormControl fullWidth>
						<Select
							variant="standard"
							required
							value={headerMapping ? headerMapping[field] : ""}
							onChange={e => handleMappingChange(field, String(e.target.value))}
						>
							<MenuItem value=""><em>None</em></MenuItem>
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
