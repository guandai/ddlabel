import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { tryLoad } from '../util/errors';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, IconButton, Alert, Container } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export type PackageType = {
  id: number;
  trackingNumber: string;
  userId: number;
  shipToAddress: string;
  phone: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  postCode: string;
  email: string;
  state: string;
  name: string;
};

const PackageTable: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      const token = localStorage.getItem('token');
      tryLoad(async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/packages`, {
          headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages(packages.filter(pkg => pkg.id !== id));
    }, setError);
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
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tracking Number</TableCell>
                <TableCell>Ship To Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Length</TableCell>
                <TableCell>Width</TableCell>
                <TableCell>Height</TableCell>
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
                  <TableCell>{pkg.trackingNumber}</TableCell>
                  <TableCell>{pkg.shipToAddress}</TableCell>
                  <TableCell>{pkg.phone}</TableCell>
                  <TableCell>{pkg.length}</TableCell>
                  <TableCell>{pkg.width}</TableCell>
                  <TableCell>{pkg.height}</TableCell>
                  <TableCell>{pkg.weight}</TableCell>
                  <TableCell>{pkg.postCode}</TableCell>
                  <TableCell>{pkg.email}</TableCell>
                  <TableCell>{pkg.state}</TableCell>
                  <TableCell>{pkg.name}</TableCell>
                  <TableCell>
                    <IconButton color="secondary" onClick={() => handleDelete(pkg.id)}>
                      <DeleteIcon />
                    </IconButton>
                    {/* Implement Edit and View functionality */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default PackageTable;
