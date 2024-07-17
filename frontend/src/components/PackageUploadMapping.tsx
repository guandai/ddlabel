import Papa, { ParseResult } from 'papaparse';
import React, { useState } from 'react';
import { Box, Button, Container, Select, MenuItem, Typography, Grid, FormControl } from '@mui/material';

const fields = [
  'length', 'width', 'height', 'weight', 'reference',
  'shipFromName', 'shipFromAddressStreet', 'shipFromAddressZip',
  'shipToName', 'shipToAddressStreet', 'shipToAddressZip'
];

const PackageUploadMapping: React.FC = () => {
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [headerMapping, setHeaderMapping] = useState<{ [key: string]: string }>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];

      Papa.parse(file, {
        header: true,
        complete: (results: ParseResult<object>) => {
          const firstRow = results.data[0];
          if (firstRow) {
            setCsvHeaders(Object.keys(firstRow));
          }
        },
      });
    }
  };

  const handleMappingChange = (requiredField: string, csvHeader: string) => {
    setHeaderMapping((prevMapping) => ({
      ...prevMapping,
      [requiredField]: csvHeader
    }));
  };

  const handleSubmit = () => {
    console.log('Header Mapping:', headerMapping);
    // Here you can handle the submit logic, such as sending the mapping to the backend
  };

  const third = Math.ceil(fields.length / 3);
  const firstThird = fields.slice(0, third);
  const secondThird = fields.slice(third, third * 2);
  const lastThird = fields.slice(third * 2);

  return (
    <Container sx={{width: '2000px'}}>
      <Box my={4}>
        <input type="file" onChange={handleFileChange} />
        {csvHeaders.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6">Map CSV Headers - Required fields map to csv headers:</Typography>
            <Grid container spacing={2}>
              <Grid item sx={{flexDirection: 'row'}} xs={4}>
                {firstThird.map((field) => (
                  <Box key={field} mb={2}>
                    <Typography variant="body2">{field}</Typography>
                    <FormControl fullWidth>
                      <Select
                        variant="standard"
                        value={headerMapping[field] || ''}
                        onChange={(e) => handleMappingChange(field, e.target.value as string)}
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
              <Grid item xs={4}>
                {secondThird.map((field) => (
                  <Box key={field} mb={2}>
                    <Typography variant="body2">{field}</Typography>
                    <FormControl fullWidth>
                      <Select
                        value={headerMapping[field] || ''}
                        variant="standard"
                        onChange={(e) => handleMappingChange(field, e.target.value as string)}
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
              <Grid item xs={4}>
                {lastThird.map((field) => (
                  <Box key={field} mb={2}>
                    <Typography variant="body2">{field}</Typography>
                    <FormControl fullWidth>
                      <Select
                        value={headerMapping[field] || ''}
                        variant="standard"
                        onChange={(e) => handleMappingChange(field, e.target.value as string)}
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
            </Grid>
            <Box mt={2}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit Mapping
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default PackageUploadMapping;
