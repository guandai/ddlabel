// frontend/src/components/PackageDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, Alert } from '@mui/material';
import { PackageType } from './PackageForm';

const PackageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<PackageType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/packages/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPkg(response.data);
      } catch (error) {
        setError('Failed to fetch package details.');
      }
    };
    fetchPackage();
  }, [id]);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!pkg) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Package Details
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography><strong>Ship To Address:</strong> {pkg.shipToAddress}</Typography>
          <Typography><strong>Phone:</strong> {pkg.phone}</Typography>
          <Typography><strong>Weight:</strong> {pkg.weight}</Typography>
          <Typography><strong>Post Code:</strong> {pkg.postCode}</Typography>
          <Typography><strong>Email:</strong> {pkg.email}</Typography>
          <Typography><strong>State:</strong> {pkg.state}</Typography>
          <Typography><strong>Name:</strong> {pkg.name}</Typography>
          <Typography><strong>Tracking Number:</strong> {pkg.trackingNumber}</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default PackageDetails;
