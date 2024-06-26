// src/components/PackageItem.tsx
import React, { useState } from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Button, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { usePackages } from '../contexts/PackageContext';
import { removePackage, updatePackage } from '../services/packageService';

type PackTypeProp = { packItem: { id: number, name: string } };
export type PackType = { id: number, name: string };

const PackageItem = ({ packItem }: PackTypeProp) => {
  const { dispatch } = usePackages();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(packItem.name);

  const handleRemove = async () => {
    try {
      await removePackage(packItem.id);
      dispatch({ type: 'REMOVE_PACKAGE', payload: packItem.id });
    } catch (error) {
      console.error('Failed to remove package:', error);
    }
  };

  const handleEdit = async () => {
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const updatedPackage = { ...packItem, name };
      const savedPackage = await updatePackage(updatedPackage);
      dispatch({ type: 'UPDATE_PACKAGE', payload: savedPackage });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update package:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(packItem.name);
  };

  return (
    <ListItem>
      {isEditing ? (
        <Box display="flex" alignItems="center" width="100%">
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button onClick={handleUpdate} color="primary" variant="contained" style={{ marginLeft: '8px' }}>
            Save
          </Button>
          <Button onClick={handleCancel} color="secondary" variant="contained" style={{ marginLeft: '8px' }}>
            Cancel
          </Button>
        </Box>
      ) : (
        <>
          <ListItemText primary={packItem.name} />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="edit" onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={handleRemove}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </>
      )}
    </ListItem>
  );
};

export default PackageItem;
