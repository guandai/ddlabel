import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Alert, Typography, Box, Container, Button } from '@mui/material';
import { Visibility, Edit, Delete, PictureAsPdf, Label, AddCircle } from '@mui/icons-material';
import { PackageType } from './PackageForm';
import { tryLoad } from '../util/errors';
import { generatePDF } from './generatePDF';
import PackageDialog from './PackageDialog';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const PackageTable: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchPackages = async () => {
      const token = localStorage.getItem('token');
      tryLoad(async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/packages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPackages(response.data);
      }, setError);
    };
    fetchPackages();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    tryLoad(async () => {
      await axios.delete(`${process.env.REACT_APP_API_URL}/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPackages(packages.filter(pkg => pkg.id !== id));
      setSuccess('Package deleted successfully.');
    }, setError);
  };

  const handleEdit = (pkg: PackageType) => {
    navigate(`/packages/edit/${pkg.id}`);
  };

  // Pass handleFormSubmit as a prop in PackageForm component call if directly used

  const handleViewDetails = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPackage(null);
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Packages
          <Button
            variant="contained"
            color="primary"
            sx={{ ml: 2 }}
            onClick={() => navigate('/packages/create')}
            startIcon={<AddCircle />} // Adds the plus icon to the button
          >
            Add
          </Button></Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ship To Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Weight</TableCell>
                <TableCell>Postal</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packages.map(pkg => (
                <TableRow key={pkg.id}>
                  <TableCell>{pkg.shipToAddress}</TableCell>
                  <TableCell>{pkg.phone}</TableCell>
                  <TableCell>{pkg.weight}</TableCell>
                  <TableCell>{pkg.postCode}</TableCell>
                  <TableCell>{pkg.email}</TableCell>
                  <TableCell>{pkg.state}</TableCell>
                  <TableCell>{pkg.name}</TableCell>
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
        </TableContainer>
        <PackageDialog open={open} handleClose={handleClose} selectedPackage={selectedPackage} />
      </Box>
    </Container>
  );
};

export default PackageTable;
