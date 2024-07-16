import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography, Box, Button,
   LinearProgress
} from '@mui/material';
import { Upload } from '@mui/icons-material';
import { io } from 'socket.io-client';

const socket = io(`${process.env.REACT_APP_SOCKET_IO_HOST}`, { path: '/api/socket.io' });

type Prop = {
	setError: (message: string) => void;
	setSuccess: (message: string) => void;
};

const PackageUploadButton: React.FC<Prop> = ({setError, setSuccess}: Prop) => {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [insertProgress, setInsertProgress] = useState<number | null>(null);

  useEffect(() => {
    socket.on('progress', (data: { processed: number; total: number }) => {
      const progressPercentage = Math.round((data.processed / data.total) * 100);
      setInsertProgress(progressPercentage);
    });

    return () => {
      socket.off('progress');
    };
  }, []);

  const handleFileUpload = async (e: any) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!userId) { return setError('Please login'); }

    try {
      const formData = new FormData();
      const packageCsvFile = e.target.files[0];
      formData.append('packageCsvFile', packageCsvFile);
      formData.append('packageUserId', userId);

      const response = await axios.post(`${process.env.REACT_APP_BE_URL}/packages/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
          'socket-id': socket.id,
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total;
          if (total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / total));
          }
        },
      });

      setSuccess(response.data.message);
      
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to import packages.');
    }
  };

  return (
	<span>
		<Button variant="contained" color="secondary" startIcon={<Upload />} component="label" >
			Upload CSV
			<input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileUpload} />
		</Button>

		{uploadProgress !== null && uploadProgress !== 100 && (
			<Box sx={{ width: '100%', mt: 2 }}>
			<LinearProgress color="success" variant="determinate" value={uploadProgress} />
			<Typography variant="body2" color="textSecondary">Upload: {`${Math.round(uploadProgress)}%`}</Typography>
			</Box>
		)}
		{insertProgress !== null && insertProgress !== 100  && (
			<Box sx={{ width: '100%', mt: 2 }}>
			<LinearProgress variant="buffer" value={insertProgress} />
			<Typography variant="body2" color="textSecondary">Insert: {`${Math.round(insertProgress)}%`}</Typography>
			</Box>
		)}
	</span>
  );
};

export default PackageUploadButton;
