// src/components/PackageList.tsx
import React, { useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { usePackages } from '../contexts/PackageContext';
import { getPackages, removePackage } from '../services/packageService';
import { PackType } from './PackageItem';

const PackageList = () => {
  const { state, dispatch } = usePackages();

  useEffect(() => {
    const fetchPackages = async () => {
      const packages = await getPackages();
      dispatch({ type: 'SET_PACKAGES', payload: packages });
    };

    fetchPackages();
  }, [dispatch]);

  const handleRemove = async (id: number) => {
    await removePackage(id);
    dispatch({ type: 'REMOVE_PACKAGE', payload: id });
  };

  return (
    <List>
      {state.packages.map((pkg: PackType) => (
        <ListItem key={pkg.id}>
          <ListItemText primary={pkg.name} />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="edit">
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(pkg.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default PackageList;
