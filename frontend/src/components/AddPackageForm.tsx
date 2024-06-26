// src/components/AddPackageForm.tsx
import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { usePackages } from '../contexts/PackageContext';
import { addPackage } from '../services/packageService';

const AddPackageForm = () => {
  const { dispatch } = usePackages();
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newPackage = { name };
    const savedPackage = await addPackage(newPackage);
    dispatch({ type: 'ADD_PACKAGE', payload: savedPackage });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" alignItems="center">
        <TextField
          label="Package Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginLeft: '16px' }}>
          Add Package
        </Button>
      </Box>
    </form>
  );
};

export default AddPackageForm;
