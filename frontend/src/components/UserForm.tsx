import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Alert, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { tryLoad } from '../util/errors';
import AddressForm, { AddressEnum, AddressType } from './AddressForm';

type ProfileType = {
  id: string;
  name: string;
  email: string;
  password?: string; 
  confirmPassword?: string;
  role: string;
  warehouseAddress: AddressType;
};

type QuickFieldProp = { 
  name: keyof ProfileType;
  autoComplete?: string;
  type?: 'text' | 'password';
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

interface UserFormProps {
  isRegister?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ isRegister = false }) => {;
  const [profile, setProfile] = useState<ProfileType>({role: 'worker', warehouseAddress: {}} as ProfileType);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>();

  useEffect(() => {
    if (isRegister) {
      return;
    }
    const token = localStorage.getItem('token');
    tryLoad(setError, async () => {
      const response = await axios.get<ProfileType>(`${process.env.REACT_APP_BE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const profileData = response.data;
      setProfile({
        ...profileData,
        password: '', // Ensure password is empty initially
        confirmPassword: '',
      });
    });
  }, [isRegister]);

  useEffect(() => {
    // This will run after every render if status changes
    testPassword();
  }
  , [profile.confirmPassword, profile.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const testPassword = (): boolean => {
    setSuccess('');
    const test =  profile.password == profile.confirmPassword;
    !test ? setError('Passwords do not match.') : setError('');
    return !!test;
  }

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
    if (error) {
      return;
    }

    setError('');
    setSuccess('');
    const profileToUpdate = { ...profile };

    if (!profile.confirmPassword) {
      delete profileToUpdate.confirmPassword;
      delete profileToUpdate.password;
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

  const quickField = (
      prop: QuickFieldProp
    ) => {
      const { autoComplete="", name, onChange=handleChange, required=true, type='text' } = prop;
    return (
    <TextField
      margin="normal"
      required={required}
      fullWidth
      id={name}
      label={name}
      name={name}
      autoComplete={autoComplete}
      type={type}
      value={profile[name] || ''}
      onChange={onChange}
    />
  )};
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
          {isRegister ? 'Register' : 'User Profile'}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Typography variant="h6">User Info:</Typography>
          {quickField({name: 'name', autoComplete: 'name'})}
          {quickField({name: 'email', autoComplete: 'email'})}
          {quickField({name: 'password', type: 'password', required: isRegister})}
          {quickField({name: 'confirmPassword', type: 'password', required: isRegister})}
          <AddressForm
            setError={setError}
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
