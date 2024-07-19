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
  password?: string; // Password is optional
  role: string;
  warehouseAddress: AddressType;
};

interface UserFormProps {
  isRegister?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ isRegister = false }) => {
  const initialProfile = {
    id: '',
    name: '',
    email: '',
    password: '', // Initialize password as an empty string
    role: 'worker',
    warehouseAddress: { name: '', addressLine1: '', city: '', state: '', zip: '' },
  };

  const [profile, setProfile] = useState<ProfileType>(initialProfile);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>();
  const [passwordChanged, setPasswordChanged] = useState(false); // Track if the password has been changed

  useEffect(() => {
    if (!isRegister) {
      const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        tryLoad(setError, async () => {
          const profileRsp = await axios.get(`${process.env.REACT_APP_BE_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const profileData = profileRsp.data;
          setProfile({
            ...profileData,
            password: '', // Ensure password is empty initially
            warehouseAddress: profileData.warehouseAddress || initialProfile.warehouseAddress,
          });
        });
      };
      fetchProfile();
    }
  }, [isRegister, initialProfile.warehouseAddress]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, password: e.target.value });
    setPasswordChanged(true); // Mark password as changed
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setProfile({ ...profile, [name]: value as string });
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setError('');
    setSuccess('');
    if (passwordChanged && profile.password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const profileToUpdate = { ...profile };
    if (!passwordChanged) {
      delete profileToUpdate.password; // Remove password if it hasn't been changed
    }

    if (isRegister) {
      tryLoad(setError, async () => {
        await axios.post(`${process.env.REACT_APP_BE_URL}/users/register`, profileToUpdate);
        window.location.href = '/login';
      });
    } else {
      const token = localStorage.getItem('token');
      tryLoad(setError, async () => {
        await axios.put(`${process.env.REACT_APP_BE_URL}/users/${profile.id}`, profileToUpdate, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Profile updated successfully.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <Typography variant="h6">User Info:</Typography>
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
            onChange={handlePasswordChange}
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

export default UserForm;
