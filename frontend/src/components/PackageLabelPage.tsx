// frontend/src/components/PackageLabelPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PackageModel } from '@ddlabel/shared';
import PackageLabel from './PackageLabel';
import { CircularProgress } from '@mui/material';
import { tryLoad } from '../util/errors';
import { MessageContent } from '../types';
import MessageAlert from './MessageAlert';
import { PackageApi } from '../api/PackageApi';

const PackageLabelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<PackageModel | null>(null);
  const [message, setMessage] = useState<MessageContent>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getPackageById = async () => {
      id && setPkg((await new PackageApi().getPackageById(id)).package);
      setLoading(false);
    }
    const closeLoading = () => setLoading(false);
    const fetchPackage = async () => {
      tryLoad(setMessage, getPackageById, closeLoading);
    };
    fetchPackage();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  <MessageAlert message={message} />
  return pkg ? <PackageLabel pkg={pkg} reader='web' /> : null;
};

export default PackageLabelPage;
