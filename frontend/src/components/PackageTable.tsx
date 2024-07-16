import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Alert, Typography, Box, Container, Button,
  TablePagination, LinearProgress
} from '@mui/material';
import { Upload, Visibility, Edit, Delete, PictureAsPdf, Label, AddCircle } from '@mui/icons-material';
import { PackageType } from './PackageForm';
import { tryLoad } from '../util/errors';
import { generatePDF } from './generatePDF';
import PackageDialog from './PackageDialog';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

// const socket = io(`${process.env.REACT_APP_BE_URL}` || `http://localhost:5100/api`);
const socket = io('http://localhost:5100', {
  path: '/api/socket.io'
});

const PackageTable: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalPackages, setTotalPackages] = useState(0); // Track the total number of packages
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [open, setOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('progress', (data: { processed: number; total: number }) => {
      const progressPercentage = Math.round((data.processed / data.total) * 100);
      setUploadProgress(progressPercentage);
    });

    return () => {
      socket.off('progress');
    };
  }, []);


  useEffect(() => {
    const fetchPackages = async () => {
      const token = localStorage.getItem('token');
      const offset = page * rowsPerPage;

      tryLoad(setError, async () => {
        const response = await axios.get(`${process.env.REACT_APP_BE_URL}/packages`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            limit: rowsPerPage,
            offset,
          }
        });
        setPackages(response.data.packages);
        setTotalPackages(response.data.total); // Set the total number of packages
      });
    };
    fetchPackages();
  }, [page, rowsPerPage]);

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

      setUploadProgress(100);
      setSuccess(response.data.message);
      
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to import packages.');
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    tryLoad(setError, async () => {
      await axios.delete(`${process.env.REACT_APP_BE_URL}/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPackages(packages.filter(pkg => pkg.id !== id));
      setSuccess('Package deleted successfully.');
    });
  };

  const handleEdit = (pkg: PackageType) => {
    navigate(`/packages/edit/${pkg.id}`);
  };

  const handleViewDetails = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPackage(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Packages
          <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={() => navigate('/packages/create')} startIcon={<AddCircle />} >
            Add
          </Button>
          {' '}
          <Button variant="contained" color="secondary" startIcon={<Upload />} component="label" >
            Upload CSV
            <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileUpload} />
          </Button>
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        {uploadProgress !== null && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="body2" color="textSecondary">{`${Math.round(uploadProgress)}%`}</Typography>
          </Box>
        )}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ship To Address</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Weight</TableCell>
                <TableCell>Tracking</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packages.map(pkg => (
                <TableRow key={pkg.id}>
                  <TableCell>{pkg.shipToAddress.addressLine1}</TableCell>
                  <TableCell>{pkg.shipToAddress.state}</TableCell>
                  <TableCell>{pkg.weight}</TableCell>
                  <TableCell>{pkg.trackingNumber}</TableCell>
                  <TableCell style={{ width: '200px', whiteSpace: 'nowrap' }}>
                    <IconButton onClick={() => handleViewDetails(pkg)}><Visibility /></IconButton>
                    <IconButton onClick={() => handleEdit(pkg)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(pkg.id || 0)}><Delete /></IconButton>
                    <IconButton onClick={() => generatePDF(pkg)}><PictureAsPdf /></IconButton>
                    <IconButton component="a" href={`/packages/${pkg.id}/label`} target="_blank"><Label /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[25, 50, 100]}
            component="div"
            count={totalPackages} // Total number of packages
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            showFirstButton // Show the first page button
            showLastButton // Show the last page button
          />
        </TableContainer>
        <PackageDialog open={open} handleClose={handleClose} selectedPackage={selectedPackage} />
      </Box>
    </Container>
  );
};

export default PackageTable;
