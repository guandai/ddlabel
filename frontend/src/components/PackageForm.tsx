import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';
import { tryLoad } from '../util/errors';

const PackageForm: React.FC = () => {
  const [packageData, setPackageData] = useState({
    shipToAddress: '',
    phone: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    postCode: '',
    email: '',
    state: '',
    name: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPackageData({ ...packageData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setError(null);
    setSuccess(null);

    tryLoad(async () => {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/packages`, packageData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Package added successfully.');
    }, setError);
  };

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
          Add Package
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="shipToAddress"
            label="Ship To Address"
            name="shipToAddress"
            autoComplete="address"
            autoFocus
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone"
            name="phone"
            autoComplete="phone"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="length"
            label="Length"
            name="length"
            type="number"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="width"
            label="Width"
            name="width"
            type="number"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="height"
            label="Height"
            name="height"
            type="number"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="weight"
            label="Weight"
            name="weight"
            type="number"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="postCode"
            label="Post Code"
            name="postCode"
            autoComplete="postal-code"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="state"
            label="State"
            name="state"
            autoComplete="address-level1"
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Add Package
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PackageForm;
