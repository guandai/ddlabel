// frontend/src/components/PackageLabelPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PackageType } from './PackageForm';
import PackageLabel from './PackageLabel';
import { CircularProgress } from '@mui/material';
import { tryLoad } from '../util/errors';
import { MessageContent } from '../types';
import MessageAlert from './MessageAlert';
import { PackageApi } from '../api/PackageApi';

const PackageLabelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<PackageType | null>(null);
  const [message, setMessage] = useState<MessageContent>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPackage = async () => {
      tryLoad(setMessage, async () => {
        id && setPkg(await new PackageApi().getPackageById(id));
        setLoading(false);
      }, async () => setLoading(false));
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
