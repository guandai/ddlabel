import React, { useState } from 'react';
import Papa, { ParseResult } from 'papaparse';
import { Box, Container, Select, MenuItem, Typography, Grid, FormControl, Alert } from '@mui/material';
import PackageUploadButton from './PackageUploadButton';
import { HeaderMapping, KeyOfBaseData, KeyOfCsvHeaders } from '../types';

const fields = [
  'length', 'width', 'height', 'weight', 'reference',
  'shipFromName', 'shipFromAddressStreet', 'shipFromAddressZip',
  'shipToName', 'shipToAddressStreet', 'shipToAddressZip'
] as KeyOfBaseData[];

const defaultMapping = fields.reduce((acc: HeaderMapping, field: KeyOfBaseData) => {
  acc[field] = null;
  return acc;
}, {} as HeaderMapping);

const PackageUploadMapping: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File>();

  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [headerMapping, setHeaderMapping] = useState<HeaderMapping>();

  const getAutoMapping = (headers: string[]): HeaderMapping => {
    const autoMapping: HeaderMapping = defaultMapping;
    fields.forEach(field => {
      if (!headers.includes(field)) {
        autoMapping[field] = null;
      } else {
        autoMapping[field] = field;
      }
    });
    return autoMapping;
  };

  const complete = (csvResults: ParseResult<object>) => {
    const firstRow = csvResults.data[0];
    if (!firstRow) {
      return;
    }
    const headers = Object.keys(firstRow);
    setCsvHeaders(headers);

    const initialMapping = getAutoMapping(headers);
    setHeaderMapping(initialMapping);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return
    }
    const file = event.target.files[0];
    setUploadFile(file);

    Papa.parse(file, {
      header: true,
      complete,
    });
  };

  const handleMappingChange = (requiredField: KeyOfBaseData, csvHeader: string) => {
    setHeaderMapping((prevMapping?: HeaderMapping): HeaderMapping => 
      !prevMapping ? defaultMapping : ({
      ...prevMapping,
      [requiredField]: csvHeader
    }));
  };

  const third = Math.ceil(fields.length / 3);
  const firstThird = fields.slice(0, third);
  const secondThird = fields.slice(third, third * 2);
  const lastThird = fields.slice(third * 2);

  const renderField = (fieldRows: KeyOfBaseData[][]) => fieldRows.map((fieldRow, idx) => (
    <Grid key={idx} item xs={4}>
      {fieldRow.map((field) => (
        <Box key={field} mb={2}>
          <Typography variant="body2">{field}</Typography>
          <FormControl fullWidth>
            <Select
              variant="standard"
              required
              value={headerMapping ? headerMapping[field] : null}
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
  ));

  return (
    <Container>
      <Box my={4}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        {csvHeaders.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6">Map CSV Headers</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <Grid container spacing={2}>
              {renderField([firstThird, secondThird, lastThird])}
            </Grid>
            <PackageUploadButton
              setError={setError}
              setSuccess={setSuccess}
              uploadFile={uploadFile}
              headerMapping={headerMapping}
              title="Submit File" />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default PackageUploadMapping;
