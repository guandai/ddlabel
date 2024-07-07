// frontend/src/components/PackageForm.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Alert, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { tryLoad } from '../util/errors';
import AddressForm, { AddressType } from './AddressForm';

export type PackageType = {
  id: number;
  userId: number;
  shipFromAddress: AddressType;
  shipToAddress: AddressType;
  length: number;
  width: number;
  height: number;
  weight: number;
  trackingNumber: string;
};

type User = {
  id: number;
  name: string;
};

type PackageFormProps = {
  initialData?: Partial<PackageType>;
  onSubmit: (data: Partial<PackageType>) => void;
};

const PackageForm: React.FC<PackageFormProps> = ({ initialData = {} }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [packageData, setPackageData] = useState<Partial<PackageType>>({
    ...initialData,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      tryLoad(async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      }, setError);
    };
    fetchUsers();

    if (id) {
      const token = localStorage.getItem('token');
      tryLoad(async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/packages/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPackageData(response.data);
      }, setError);
    }
  }, [id]);

  const onSubmit = async (data: Partial<PackageType>) => {
    const token = localStorage.getItem('token');
    const header = {
      headers: { Authorization: `Bearer ${token}` }
    };
    try {
      id
        ? await axios.put(`${process.env.REACT_APP_API_URL}/packages/${id}`, data, header)
        : await axios.post(`${process.env.REACT_APP_API_URL}/packages`, data, header);
      navigate('/packages');
    } catch (error) {
      setError('Failed to create package.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPackageData({ ...packageData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setPackageData({ ...packageData, [name]: value });
  };

  const handleAddressChange = (addressType: 'shipFromAddress' | 'shipToAddress') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPackageData({
      ...packageData,
      [addressType]: {
        ...packageData[addressType],
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(packageData);
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {id ? 'Edit Package' : 'Add Package'}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="user-label">Assignee</InputLabel>
                <Select
                  labelId="user-label"
                  id="userId"
                  name="userId"
                  value={packageData.userId?.toString() || ''}
                  label="Assignee"
                  onChange={handleSelectChange}
                >
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <AddressForm
                addressData={packageData.shipFromAddress}
                onChange={handleAddressChange('shipFromAddress')}
                title="Ship From Address"
              />
            </Grid>
            <Grid item xs={12}>
              <AddressForm
                addressData={packageData.shipToAddress}
                onChange={handleAddressChange('shipToAddress')}
                title="Ship To Address"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="length"
                label="Length"
                name="length"
                type="number"
                value={packageData.length || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="width"
                label="Width"
                name="width"
                type="number"
                value={packageData.width || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="height"
                label="Height"
                name="height"
                type="number"
                value={packageData.height || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="weight"
                label="Weight"
                name="weight"
                type="number"
                value={packageData.weight || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {id ? 'Update Package' : 'Add Package'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default PackageForm;
