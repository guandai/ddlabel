// src/components/EditPackageForm.tsx
import React, { useState } from 'react';
import { usePackages } from '../contexts/PackageContext';
import { PackType } from './PackageItem';
import { updatePackage } from '../services/packageService';

interface EditPackageFormProps {
  packageToEdit: PackType;
  onCancel: () => void;
}

const EditPackageForm: React.FC<EditPackageFormProps> = ({ packageToEdit, onCancel }) => {
  const { dispatch } = usePackages();
  const [name, setName] = useState(packageToEdit.name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPackage = { ...packageToEdit, name };
    try {
      await updatePackage(updatedPackage);
      dispatch({ type: 'UPDATE_PACKAGE', payload: updatedPackage });
      onCancel(); // Close the form after updating
    } catch (error) {
      console.error('Failed to update package:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Package Name"
        required
      />
      <button type="submit">Update Package</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default EditPackageForm;
