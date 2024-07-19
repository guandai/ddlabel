import React, { useState, useEffect } from 'react';
import axios, { AxiosProgressEvent } from 'axios';
import {
  Typography, Box, Button,
   LinearProgress
} from '@mui/material';
import { Upload } from '@mui/icons-material';
import { io } from 'socket.io-client';
import { HeaderMapping } from '../types';

const socket = io(`${process.env.REACT_APP_SOCKET_IO_HOST}`, { path: '/api/socket.io' });

type Prop = {
  setError: (message: string) => void;
  setSuccess: (message: string) => void;
  headerMapping?: HeaderMapping;
  uploadFile?: File;
  title?: string;
};

const PackageUploadButton: React.FC<Prop> = ({ setError, setSuccess, title, headerMapping, uploadFile }: Prop) => {
  const [submited, setSubmited] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [generateProgress, setGenerateProgress] = useState<number | null>(null);
  const [insertProgress, setInsertProgress] = useState<number | null>(null);

  useEffect(() => {
    setSubmited(false);
  }, [uploadFile]);
  
  useEffect(() => {
    socket.on('progress', (data: { processed: number; total: number }) => {
      const progressPercentage = Math.round((data.processed / data.total) * 100);
      setInsertProgress(progressPercentage);
    });

    socket.on('generate', (data: { processed: number; total: number }) => {
      const progressPercentage = Math.round((data.processed / data.total) * 100);
      setGenerateProgress(progressPercentage);
    });

    return () => {
      socket.off('progress');
    };
  }, []);

  const handleFileUpload = async (e: any) => {
    setSubmited(true);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!userId) { return setError('Please login'); }

    try {
      const formData = new FormData();
      const packageCsvFile = uploadFile || e.target.files[0];
      formData.append('packageCsvFile', packageCsvFile);
      formData.append('packageUserId', userId);
      formData.append('packageCsvMap', JSON.stringify(headerMapping));

      const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
        const total = progressEvent.total;
        if (total) {
          setUploadProgress(Math.round((progressEvent.loaded * 100) / total));
        }
        if (progressEvent.loaded === total) {
          setUploadProgress(100);
          setSuccess('Upload Done. Processing data...');
        }
      };

      const response = await axios.post(`${process.env.REACT_APP_BE_URL}/packages/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
          'socket-id': socket.id,
        },
        onUploadProgress,
      });
      setSuccess(response.data.message);
      
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to import packages.');
    }
  };

  // Calculate the buffer value based on some logic or placeholder value
  const valueBuffer = insertProgress !== null ? Math.min(insertProgress + 20, 100) : 0;
  return (
  <span>
    <Button variant="contained" disabled={submited} color="secondary" startIcon={<Upload />} component="label" >
     { title || 'Upload CSV'}
     { uploadFile ? 
     <button type="button" style={{ display: 'none' }} onClick={handleFileUpload} />
     :
     <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileUpload} />
     }
      
    </Button>

    {uploadProgress !== null && uploadProgress !== 100 && (
      <Box sx={{ width: '100%', mt: 2 }}>
      <LinearProgress color="success" variant="determinate" value={uploadProgress} />
      <Typography variant="body2" color="textSecondary">Uploading: {`${Math.round(uploadProgress)}%`}</Typography>
      </Box>
    )}
    {generateProgress !== null && uploadProgress !== 100 && (
      <Box sx={{ width: '100%', mt: 2 }}>
      <LinearProgress color="warning" variant="determinate" value={generateProgress} />
      <Typography variant="body2" color="textSecondary">Generating: {`${Math.round(generateProgress)}%`}</Typography>
      </Box>
    )}
    {insertProgress !== null && insertProgress !== 100  && (
      <Box sx={{ width: '100%', mt: 2 }}>
      <LinearProgress variant="buffer" value={insertProgress} valueBuffer={valueBuffer} />
      <Typography variant="body2" color="textSecondary">Inserting: {`${Math.round(insertProgress)}%`}</Typography>
      </Box>
    )}
  </span>
  );
};

export default PackageUploadButton;
