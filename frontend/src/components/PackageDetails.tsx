// frontend/src/components/PackageDetails.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, Alert, Button } from '@mui/material';
import { PackageType } from './PackageForm';

const PackageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<PackageType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/packages/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPkg(response.data);
      } catch (error) {
        setError('Failed to fetch package details.');
      }
    };
    fetchPackage();
  }, [id]);

  const handleGetRate = async () => {
    if (pkg) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/shipping-rates/calculate-rate`, {
            params: {
              length: 100, // Use actual values as needed
              width: 100, // Use actual values as needed
              height: 10, // Use actual values as needed
              actualWeight: pkg.weight,
              zone: 3, // Use actual zone as needed
              unit: 'lbs',
            },
          }
        );
        setRate(response.data.totalCost);
      } catch (error) {
        setError('Failed to calculate shipping rate.');
      }
    }
  };

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
          Package Label
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
          {rate !== null && <Typography><strong>Shipping Rate:</strong> ${rate.toFixed(2)}</Typography>}
          <Button variant="contained" color="primary" onClick={handleGetRate} sx={{ mt: 2 }}>
            Get Rate
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PackageDetails;
