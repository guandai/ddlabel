// frontend/src/components/PackageForm.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Alert, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { tryLoad } from '../util/errors';
import AddressForm, { AddressType } from './AddressForm';
import { UserType } from './LoginForm';

export type PackageType = {
  id: number;
  user: UserType;
  shipFromAddress: AddressType;
  shipToAddress: AddressType;
  length: number;
  width: number;
  height: number;
  weight: number;
  trackingNumber: string;
  reference: string;
};

type PackageFormProps = {
  initialData?: PackageType;
  onSubmit: (data: Partial<PackageType>) => void;
};

const defaultPackageData: PackageType = {
  user: { id: 0, name: '', email: '', password: '', role: '', warehouseAddress: { name: '', addressLine1: '', city: '', state: '', zip: '' }},
  shipFromAddress: { name: '', addressLine1: '', city: '', state: '', zip: '' },
  shipToAddress: { name: '', addressLine1: '', city: '', state: '', zip: '' },
  length: 0,
  width: 0,
  height: 0,
  weight: 0,
  trackingNumber: '',
  reference: '',
  id: 0
};
const PackageForm: React.FC<PackageFormProps> = ({ initialData = defaultPackageData }) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [packageData, setPackageData] = useState<PackageType>(
    initialData,
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id: packageId } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      tryLoad(setError, async () => {
        const response = await axios.get(`${process.env.REACT_APP_BE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      });
    };
    fetchUsers();

    if (packageId) {
      const token = localStorage.getItem('token');
      tryLoad(setError, async () => {
        const response = await axios.get(`${process.env.REACT_APP_BE_URL}/packages/${packageId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPackageData(response.data);
      });
    }
  }, [packageId]);

  const onSubmit = async (data: Partial<PackageType>) => {
    const token = localStorage.getItem('token');
    const header = {
      headers: { Authorization: `Bearer ${token}` }
    };
    tryLoad(setError, async () => {
      if (packageId) {
        await axios.put(`${process.env.REACT_APP_BE_URL}/packages/${packageId}`, data, header)
      } else{
        await axios.post(`${process.env.REACT_APP_BE_URL}/packages`, data, header);
        navigate('/packages');
      }
      setSuccess(packageId ? 'Package updated successfully' : 'Package added successfully');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPackageData({ ...packageData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setPackageData({ 
      ...packageData, 
      user: { 
        ...packageData.user, 
        id: parseInt(value) 
      }
    });
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
          {packageId ? 'Edit Package' : 'Add Package'}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="user-label">Assignee</InputLabel>
                  <Select
                    labelId="user-label"
                    id="userId"
                    name="userId"
                    value={packageData.user?.id ? String(packageData.user.id) : ''}
                    label="Assignee"
                    onChange={handleSelectChange}
                  >
                    {users.map(user => (
                      <MenuItem key={user.id} value={String(user.id)}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={12} mt="2em">
              <AddressForm
                addressData={packageData.shipFromAddress}
                onChange={handleAddressChange('shipFromAddress')}
                title="Ship From Address"
              />
            </Grid>
            <Grid item xs={12} mt="2em">
              <AddressForm
                addressData={packageData.shipToAddress}
                onChange={handleAddressChange('shipToAddress')}
                title="Ship To Address"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Package Info</Typography>
              <Grid container spacing={2}>
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="reference"
                    label="reference"
                    name="Reference"
                    type="text"
                    value={packageData.reference || ''}
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
                    {packageId ? 'Update Package' : 'Add Package'}
                  </Button>
                </Grid>
              </Grid>
            </Grid>

          
        </Box>
      </Box>
    </Container>
  );
};

export default PackageForm;
