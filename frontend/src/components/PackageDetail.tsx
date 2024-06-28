import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Container, CircularProgress, Alert } from '@mui/material';
import { PackageType } from './PackageForm';

const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<PackageType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
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
        {pkg && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body1"><strong>Ship To Address:</strong> {pkg.shipFromAddress}</Typography>
            <Typography variant="body1"><strong>Ship To Address:</strong> {pkg.shipToAddress}</Typography>
            <Typography variant="body1"><strong>Phone:</strong> {pkg.phone}</Typography>
            <Typography variant="body1"><strong>Length:</strong> {pkg.length}</Typography>
            <Typography variant="body1"><strong>Width:</strong> {pkg.width}</Typography>
            <Typography variant="body1"><strong>Height:</strong> {pkg.height}</Typography>
            <Typography variant="body1"><strong>Weight:</strong> {pkg.weight}</Typography>
            <Typography variant="body1"><strong>Post Code:</strong> {pkg.postCode}</Typography>
            <Typography variant="body1"><strong>Email:</strong> {pkg.email}</Typography>
            <Typography variant="body1"><strong>State:</strong> {pkg.state}</Typography>
            <Typography variant="body1"><strong>Name:</strong> {pkg.name}</Typography>
            <Typography variant="body1"><strong>Tracking Number:</strong> {pkg.trackingNumber}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default PackageDetail;
