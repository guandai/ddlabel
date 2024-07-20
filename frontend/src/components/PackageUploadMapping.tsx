import React, { useState } from 'react';
import Papa, { ParseResult } from 'papaparse';
import { Box, Typography, Grid, Button, Modal, Alert } from '@mui/material';
import PackageUploadButton from './PackageUploadButton';
import { HeaderMapping, KeyOfBaseData } from '../types';
import { Upload } from '@mui/icons-material';
import CloseButton from './CloseButton';
import CsvHeaderList from './CsvHeaderList';

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
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<File>();

  const [csvLength, setCsvLength] = useState<number>(0);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [headerMapping, setHeaderMapping] = useState<HeaderMapping>(defaultMapping);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const getAutoMapping = (headers: string[]): HeaderMapping => {
    const autoMapping: HeaderMapping = defaultMapping;
    fields.forEach(field => {
      if (headers.includes(field)) { autoMapping[field] = field }
    });
    return autoMapping;
  };

  const complete = (csvResults: ParseResult<object>) => {
    const firstRow = csvResults.data[0];
    const length = csvResults.data.length;
    if (!firstRow) {
      return;
    }
    const headers = Object.keys(firstRow);
    setCsvHeaders(headers);

    const initialMapping = getAutoMapping(headers);
    setHeaderMapping(initialMapping);
    setCsvLength(length);
    setModalOpen(true); // Open the modal when the CSV is parsed
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (!event.target.files) {
      return;
    }
    const file = event.target.files[0];
    setUploadFile(file);

    Papa.parse(file, {
      header: true,
      complete,
    });
  };

  const handleMappingChange = (requiredField: KeyOfBaseData, csvHeader: string) => {
    setError('');
    setHeaderMapping((prevMapping) => ({
      ...prevMapping,
      [requiredField]: csvHeader
    }));
  };

  const validateForm = () => {
    const missingFields = fields.filter(field => !headerMapping[field]);
    if (missingFields.length > 0) {
      setError(`The following fields are missing: ${missingFields.join(', ')}`);
      return false;
    }
    setError('');
    return true;
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setProcessing(false);
    setSuccess('');
    setError('');
  };

  return (
    <>
      <Button variant="contained" disabled={processing} color="secondary" startIcon={<Upload />} component="label" >
        {'Upload CSV'}
        <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileChange} />
      </Button>
      <Modal
        open={modalOpen}
        onClose={!processing ? handleModalClose : () => { }}
      >
        <Box sx={{
          position: 'absolute', p: 4, width: 600,
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper', boxShadow: 24,
        }}>
          {csvHeaders.length > 0 && (
            <>
              <Typography variant="h6" id="modal-title">Map CSV Headers</Typography>
              {!processing && <CloseButton handleModalClose={handleModalClose} />}
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
              {!processing && <Grid container spacing={2}>
                <CsvHeaderList
                  fields={fields}
                  csvHeaders={csvHeaders}
                  headerMapping={headerMapping}
                  handleMappingChange={handleMappingChange}
                />
              </Grid>}
              {uploadFile && <PackageUploadButton
                setError={setError}
                setSuccess={setSuccess}
                uploadFile={uploadFile}
                headerMapping={headerMapping}
                setProcessing={setProcessing}
                processing={processing}
                csvLength={csvLength}
                validateForm={validateForm} // Pass the validation function to the button
              />}
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default PackageUploadMapping;
