import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Alert, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { tryLoad } from '../util/errors';

type ProfileType = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  warehouseAddress: string;
  warehouseZip: string;
};
const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileType>({
    id: '',
    name: '',
    email: '',
    password: '',
    role: '',
    warehouseAddress: '',
    warehouseZip: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      tryLoad(setError, async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
      });
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setProfile({ ...profile, [name]: value as string });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.password && profile.password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const token = localStorage.getItem('token');

    setSuccess(null);
    tryLoad(setError, async () => {
      await axios.put(`${process.env.REACT_APP_API_URL}/users/${profile.id}`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Profile updated successfully.');
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          User Profile
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={profile.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={profile.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={profile.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="warehouseAddress"
            label="Warehouse Address"
            name="warehouseAddress"
            autoComplete="warehouseAddress"
            value={profile.warehouseAddress}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="warehouseZip"
            label="Warehouse Zip"
            name="warehouseZip"
            autoComplete="warehouseZip"
            value={profile.warehouseZip}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={profile.role}
              label="Role"
              onChange={handleSelectChange}
            >
              <MenuItem value="worker">Worker</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update Profile
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UserProfile;
