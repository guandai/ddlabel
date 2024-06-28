// frontend/src/components/PackageLabelPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PackageType } from './PackageForm';
import PackageLabel from './PackageLabel';
import { Alert, CircularProgress } from '@mui/material';

const PackageLabelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<PackageType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPackage = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/packages/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPkg(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch package.');
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return pkg ? <PackageLabel pkg={pkg} /> : null;
};

export default PackageLabelPage;
