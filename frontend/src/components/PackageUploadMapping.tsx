import React, { useState } from 'react';
import Papa, { ParseResult } from 'papaparse';
import { Box, Typography, Button, Modal, Alert } from '@mui/material';
import PackageUploadButton, { RunStatus } from './PackageUploadButton';
import { MessageContent, MsgLevel } from '../types.d';
import { Upload } from '@mui/icons-material';
import CloseButton from './CloseButton';
import CsvHeaderList from './CsvHeaderList';
import { KeyOfBaseData, HeaderMapping, FIELDS } from '@ddlabel/shared';

const defaultMapping = FIELDS.reduce((acc: HeaderMapping , field: KeyOfBaseData) => {
  acc[field] = null;
  return acc;
}, {} as HeaderMapping);

const PackageUploadMapping: React.FC = () => {
  const [message, setMessage] = useState<MessageContent>(null);
  const [runStatus, setRunStatus] = useState<RunStatus>(RunStatus.ready);
  const [uploadFile, setUploadFile] = useState<File>();

  const [csvLength, setCsvLength] = useState<number>(0);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [headerMapping, setHeaderMapping] = useState<HeaderMapping>(defaultMapping);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const getAutoMapping = (headers: string[]): HeaderMapping => {
    const autoMapping: HeaderMapping = defaultMapping;
    FIELDS.forEach(field => {
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
    setMessage(null);
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
    setMessage(null);
    setHeaderMapping((prevMapping) => ({
      ...prevMapping,
      [requiredField]: csvHeader
    }));
  };

  const validateForm = () => {
    const missingFields = FIELDS.filter(field => !headerMapping[field]);
    if (missingFields.length > 0) {
      setMessage({
        level: MsgLevel.error,
        text: `The following fields are missing: ${missingFields.join(', ')}`
      });
      return false;
    }
    setMessage(null);
    return true;
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setRunStatus(RunStatus.ready);
    setMessage(null);
  };

  return (
    <>
      <Button variant="contained" disabled={runStatus === RunStatus.running} color="secondary" startIcon={<Upload />} component="label" >
        {'Upload CSV'}
        <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileChange} />
      </Button>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
      >
        <Box sx={{
          position: 'absolute', p: 4, width: 600,
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper', boxShadow: 24,
        }}>
          {csvHeaders.length > 0 && (
            <>
              <Typography variant="h6" id="modal-title">Map CSV Headers</Typography>
              {runStatus !== RunStatus.running && <CloseButton handleModalClose={handleModalClose} />}
              {message && <Alert severity={message.level}>{message.text}</Alert>}
              {runStatus === RunStatus.ready &&
                <CsvHeaderList
                  csvHeaders={csvHeaders}
                  headerMapping={headerMapping}
                  handleMappingChange={handleMappingChange}
                />
              }
              {uploadFile && <PackageUploadButton
                setMessage={setMessage}
                uploadFile={uploadFile}
                headerMapping={headerMapping}
                setRunStatus={setRunStatus}
                runStatus={runStatus}
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
