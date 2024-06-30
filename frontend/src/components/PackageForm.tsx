import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Alert, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { tryLoad } from '../util/errors';

export type PackageType = {
  id: number;
  userId: number;
  shipFromAddress: string;
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
  trackingNumber: string;
}

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
  const navigate = useNavigate(); // Initialize useNavigate
  const { id } = useParams<{ id: string }>(); // Get the id from the URL

  console.log(`id`,id);

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
  }, []);

  const onSubmit = async (data: Partial<PackageType>) => {
    const token = localStorage.getItem('token');
    const header = {
      headers: { Authorization: `Bearer ${token}` }
    }
    try {
      id 
        ? await axios.put(`${process.env.REACT_APP_API_URL}/packages/${id}`, data, header) 
        : await axios.post(`${process.env.REACT_APP_API_URL}/packages`, data, header);
      navigate('/packages'); // Redirect to the list of packages after successful creation
    } catch (error) {
      setError('Failed to create package.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPackageData({ ...packageData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setPackageData({ ...packageData, [name as string]: value as string });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(packageData);
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
          {id ? 'Edit Package' : 'Add Package'}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <FormControl fullWidth margin="normal" required>
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
          <TextField
            margin="normal"
            required
            fullWidth
            id="shipFromAddress"
            label="Ship From Address"
            name="shipFromAddress"
            autoComplete="address"
            value={packageData.shipFromAddress || ''}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="shipToAddress"
            label="Ship To Address"
            name="shipToAddress"
            autoComplete="address"
            value={packageData.shipToAddress || ''}
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
            value={packageData.phone || ''}
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
            value={packageData.length || ''}
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
            value={packageData.width || ''}
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
            value={packageData.height || ''}
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
            value={packageData.weight || ''}
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
            value={packageData.postCode || ''}
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
            value={packageData.email || ''}
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
            value={packageData.state || ''}
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
            value={packageData.name || ''}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {id ? 'Update Package' : 'Add Package'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PackageForm;
