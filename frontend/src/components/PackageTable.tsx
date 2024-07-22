import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Alert, Typography, Box, Container, Button,
  TablePagination
} from '@mui/material';
import { Visibility, Edit, Delete, PictureAsPdf, Label, AddCircle } from '@mui/icons-material';
import { PackageType } from './PackageForm';
import { tryLoad } from '../util/errors';
import { generatePDF } from './generatePDF';
import PackageDialog from './PackageDialog';
import { useNavigate } from 'react-router-dom';
import PackageUploadMapping from './PackageUploadMapping';
import { MessageContent } from '../types';
import MessageAlert from './MessageAlert';

const PackageTable: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPackages, setTotalPackages] = useState(0); // Track the total number of packages
  const [message, setMessage] = useState<MessageContent>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const offset = page * rowsPerPage;

    tryLoad(setMessage, async () => {
      const response = await axios.get(`${process.env.REACT_APP_BE_URL}/packages`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit: rowsPerPage,
          offset,
          userId,
        }
      });
      setPackages(response.data.packages);
      setTotalPackages(response
        .data.total); // Set the total number of packages
    });
    
  }, [page, rowsPerPage]);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    tryLoad(setMessage, async () => {
      await axios.delete(`${process.env.REACT_APP_BE_URL}/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPackages(packages.filter(pkg => pkg.id !== id));
      setMessage({ text: 'Package deleted successfully', level: 'success' });
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
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '400px' }}>
          <Typography component="h1" variant="h5">Packages</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/packages/create')} startIcon={<AddCircle />} >
              Add
            </Button>
          <PackageUploadMapping />
        </Box>

        <MessageAlert message={message} />
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
            rowsPerPageOptions={[5, 25, 50, 100]}
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
