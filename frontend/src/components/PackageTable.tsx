import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  Typography,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { Visibility, Edit, Delete, PictureAsPdf, Label } from '@mui/icons-material';
import { PackageType } from './PackageForm';
import { tryLoad } from '../util/errors';
import { generatePDF } from './generatePDF';
import PackageForm from './PackageForm';

const PackageTable: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
    setSelectedPackage(pkg);
    setIsEditing(true);
    setOpen(true);
  };

  const handleViewDetails = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    setIsEditing(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPackage(null);
  };

  const handleFormSubmit = async (data: Partial<PackageType>, id?: number) => {
    const token = localStorage.getItem('token');
    try {
      if (id) {
        await axios.put(`${process.env.REACT_APP_API_URL}/packages/${id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPackages(packages.map(pkg => pkg.id === id ? { ...pkg, ...data } : pkg));
        setSuccess('Package updated successfully.');
      } else {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/packages`, data, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPackages([...packages, response.data]);
        setSuccess('Package added successfully.');
      }
      setOpen(false);
      setSelectedPackage(null);
    } catch (error) {
      setError('Failed to save package.');
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Packages
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ship To Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Weight</TableCell>
                <TableCell>Post Code</TableCell>
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
                    <IconButton onClick={() => handleDelete(pkg.id)}><Delete /></IconButton>
                    <IconButton onClick={() => generatePDF(pkg)}><PictureAsPdf /></IconButton>
                    <IconButton component="a" href={`/packages/${pkg.id}/label`} target="_blank"><Label /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} aria-labelledby="package-dialog-title">
          <DialogTitle id="package-dialog-title">{isEditing ? 'Edit Package' : 'Package Details'}</DialogTitle>
          <DialogContent>
            {isEditing ? (
              <PackageForm initialData={selectedPackage || {}} onSubmit={(data) => handleFormSubmit(data, selectedPackage?.id)} />
            ) : (
              selectedPackage && (
                <div>
                  <strong>Ship To Address:</strong> {selectedPackage.shipToAddress}<br />
                  <strong>Phone:</strong> {selectedPackage.phone}<br />
                  <strong>Weight:</strong> {selectedPackage.weight}<br />
                  <strong>Post Code:</strong> {selectedPackage.postCode}<br />
                  <strong>Email:</strong> {selectedPackage.email}<br />
                  <strong>State:</strong> {selectedPackage.state}<br />
                  <strong>Name:</strong> {selectedPackage.name}<br />
                  <strong>Tracking Number:</strong> {selectedPackage.trackingNumber}
                </div>
              )
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default PackageTable;
