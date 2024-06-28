import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Alert, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';

type User = {
  id: number;
  name: string;
};

const PackageForm: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [packageData, setPackageData] = useState({
    userId: '', // Ensure userId is part of the package data
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

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        setError('Failed to fetch users.');
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPackageData({ ...packageData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setPackageData({ ...packageData, [name as string]: value as string });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setError(null);
    setSuccess(null);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/packages`, packageData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Package added successfully.');
    } catch (error) {
      setError('Failed to add package.');
    }
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
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="user-label">Assignee</InputLabel>
            <Select
              labelId="user-label"
              id="userId"
              name="userId"
              value={packageData.userId}
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
            id="shipToAddress"
            label="Ship To Address"
            name="shipToAddress"
            autoComplete="address"
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
