import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Alert, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { tryLoad } from '../util/errors';
import AddressForm, { AddressType } from './AddressForm';

type ProfileType = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  warehouseAddress: AddressType;
};

interface UserProfileProps {
  isRegister?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ isRegister = false }) => {
  const initialProfile = {
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'worker',
    warehouseAddress: { name: '', addressLine1: '', city: '', state: '', zip: '' },
  };

  const [profile, setProfile] = useState<ProfileType>(initialProfile);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isRegister) {
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
    }
  }, [isRegister]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setProfile({ ...profile, [name]: value as string });
    }
  };

  const handleAddressChange = () => (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfile({
        ...profile,
        warehouseAddress: {
          ...profile.warehouseAddress,
          [e.target.name]: e.target.value,
        },
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.password && profile.password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSuccess(null);

    if (isRegister) {
      tryLoad(setError, async () => {
        await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, profile);
        window.location.href = '/login';
      });
    } else {
      const token = localStorage.getItem('token');
      tryLoad(setError, async () => {
        await axios.put(`${process.env.REACT_APP_API_URL}/users/${profile.id}`, profile, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Profile updated successfully.');
      });
    }
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
          {isRegister ? 'Register' : 'User Profile'}
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
          <AddressForm
            addressData={profile.warehouseAddress as AddressType}
            onChange={handleAddressChange}
            title="Warehouse Address"
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
            {isRegister ? 'Register' : 'Update Profile'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UserProfile;
