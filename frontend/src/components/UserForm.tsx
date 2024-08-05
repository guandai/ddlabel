import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Box, Typography, Container, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { tryLoad } from '../util/errors';
import AddressForm from './AddressForm';
import { MessageContent, ProfileType } from '../types.d';
import MessageAlert from './MessageAlert';
import { AddressEnum } from '@ddlabel/shared';
import { AddressAttributes } from "@ddlabel/shared";
import UserApi from '../api/UserApi';
import { StyledBox } from '../util/styled';

type QuickFieldProp = {
  name: keyof ProfileType;
  autoComplete?: string;
  type?: 'text' | 'password';
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type UserFormProps = {
  isRegister?: boolean;
}

const enum UserRoles {
  worker = 'worker',
  admin = 'admin',
}

const defaultUser = { role: UserRoles.worker, warehouseAddress: { addressType: AddressEnum.user } } as ProfileType;

const UserForm: React.FC<UserFormProps> = ({ isRegister = false }) => {
  ;
  const [profile, setProfile] = useState<ProfileType>(defaultUser);
  const [message, setMessage] = useState<MessageContent>(null);

  const testPassword = useCallback(() => {
    setMessage(null);
    const test = profile.password === profile.confirmPassword;
    !test
      ? setMessage({ text: 'Passwords do not match', level: 'error' })
      : setMessage(null);
    return !!test;
  }, [profile.confirmPassword, profile.password]);

  useEffect(() => {
    if (isRegister) {
      return;
    }
    const getCurrentUser = async () => {
      setProfile({
        ...(await UserApi.getCurrentUser()).user,
        password: '', // Ensure password is empty initially
        confirmPassword: '',
      });
    };
    tryLoad(setMessage, getCurrentUser);
  }, [isRegister]);

  useEffect(() => {
    // This will run after every render if status changes
    testPassword();
  }
    , [profile.confirmPassword, profile.password, testPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
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

  const checkErrors = (): boolean => {
    if (!testPassword() || (message && message.level === 'error')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    setMessage(null);
    return true;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkErrors()) return;
    const profileCopy = { ...profile };

    if (isRegister) {
      const registerUser = async () => {
        await UserApi.register(profileCopy);
        window.location.href = '/login';
      };
      tryLoad(setMessage, registerUser);
    } else {
      const updateUser = async () => {
        await UserApi.updateUser(profileCopy);
        setMessage({ text: 'Profile updated successfully', level: 'success' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      tryLoad(setMessage, updateUser);
    }
  };

  const quickField = (
    prop: QuickFieldProp
  ) => {
    const { autoComplete = "", name, onChange = handleChange, required = true, type = 'text' } = prop;
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
    )
  };
  return (
    <Container component="main" maxWidth="md">
      <StyledBox>
        <Typography component="h1" variant="h4">
          {isRegister ? 'Register' : 'User Profile'}
        </Typography>
        <MessageAlert message={message} />

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Typography variant="h6">User Info</Typography>
          {quickField({ name: 'name', autoComplete: 'name' })}
          {quickField({ name: 'email', autoComplete: 'email' })}
          {quickField({ name: 'password', autoComplete: 'new-password', type: 'password', required: isRegister })}
          {quickField({ name: 'confirmPassword', autoComplete: 'off', type: 'password', required: isRegister })}
          <AddressForm
            setMessage={setMessage}
            addressData={profile.warehouseAddress as AddressAttributes}
            onChange={handleAddressChange}
            title="Warehouse Address"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              required
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
      </StyledBox>
    </Container>
  );
};

export default UserForm;
