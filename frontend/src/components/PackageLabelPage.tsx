// frontend/src/components/PackageLabelPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PackageType } from './PackageForm';
import PackageLabel from './PackageLabel';
import { CircularProgress } from '@mui/material';
import { tryLoad } from '../util/errors';
import { MessageContent, MsgLevel } from '../types';
import MessageAlert from './MessageAlert';

const PackageLabelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<PackageType | null>(null);
  const [message, setMessage] = useState<MessageContent>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPackage = async () => {
      const token = localStorage.getItem('token');
      tryLoad(setMessage, async () => {
        const response = await axios.get(`${process.env.REACT_APP_BE_URL}/packages/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPkg(response.data);
        setLoading(false);
      }, async () => setLoading(false));
    };
    fetchPackage();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  <MessageAlert message={message} />

  return pkg ? <PackageLabel pkg={pkg} /> : null;
};

export default PackageLabelPage;
