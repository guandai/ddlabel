import React, { useState } from 'react';
import axios from 'axios';
import { Box, LinearProgress, Typography, Button, Container, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import Papa from 'papaparse';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5100', { path: '/api/socket.io/' });

const requiredHeaders = [
  'length', 'width', 'height', 'weight', 'reference',
  'shipFromName', 'shipFromAddressStreet', 'shipFromAddressCity', 'shipFromAddressState', 'shipFromAddressZip',
  'shipToName', 'shipToAddressStreet', 'shipToAddressCity', 'shipToAddressState', 'shipToAddressZip'
];

const UploadCsv: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [headerMapping, setHeaderMapping] = useState<{ [key: string]: string }>({});
  const [progress, setProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setSelectedFile(file);

      Papa.parse(file, {
        header: true,
        complete: (results: any) => {
          setCsvHeaders(Object.keys(results.data[0]));
        }
      });
    }
  };

  const handleMappingChange = (requiredHeader: string, selectedHeader: string) => {
    setHeaderMapping((prevMapping) => ({
      ...prevMapping,
      [requiredHeader]: selectedHeader
    }));
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('packageCsvFile', selectedFile);
    formData.append('headerMapping', JSON.stringify(headerMapping));

    axios.post('http://localhost:5100/api/packages/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'socket-id': socket.id,
      },
      onUploadProgress: (progressEvent) => {
        const total = progressEvent.total;
        if (total) {
          setUploadProgress(Math.round((progressEvent.loaded * 100) / total));
        }
      },
    })
    .then(response => {
      console.log(response.data);
      setUploadProgress(100);
    })
    .catch(error => {
      console.error(error);
    });
  };

  React.useEffect(() => {
    socket.on('progress', (data: { processed: number; total: number }) => {
      const progressPercentage = Math.round((data.processed / data.total) * 100);
      setProgress(progressPercentage);
    });

    return () => {
      socket.off('progress');
    };
  }, []);

  return (
    <Container>
      <Box my={4}>
        <input type="file" onChange={handleFileChange} />
        <Button variant="contained" color="primary" onClick={handleUpload} disabled={!selectedFile || Object.keys(headerMapping).length !== requiredHeaders.length}>
          Upload
        </Button>
        {selectedFile && (
          <Box mt={4}>
            <Typography variant="h6">Map CSV Headers</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Required Header</TableCell>
                  <TableCell>CSV Header</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requiredHeaders.map((requiredHeader) => (
                  <TableRow key={requiredHeader}>
                    <TableCell>{requiredHeader}</TableCell>
                    <TableCell>
                      <Select
                        value={headerMapping[requiredHeader] || ''}
                        onChange={(e) => handleMappingChange(requiredHeader, e.target.value)}
                        fullWidth
                      >
                        {csvHeaders.map((csvHeader) => (
                          <MenuItem key={csvHeader} value={csvHeader}>
                            {csvHeader}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
        {selectedFile && (
          <>
            <Box display="flex" alignItems="center" mt={2}>
              <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" value={uploadProgress} />
              </Box>
              <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${uploadProgress}% Uploaded`}</Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" mt={2}>
              <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
              <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${progress}% Processed`}</Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default UploadCsv;
