// frontend/src/components/PackageForm.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { tryLoad } from '../util/errors';
import AddressForm, { AddressType } from './AddressForm';
import { MessageContent } from '../types.d';
import MessageAlert from './MessageAlert';
import { AddressEnum } from '@ddlabel/shared';

type QuickFieldProp = {
  name: keyof PackageType;
  type?: 'text' | 'number';
  pattern?: string | null;
};

export type PackageType = {
  id: number;
  fromAddress: AddressType;
  toAddress: AddressType;
  length: number;
  width: number;
  height: number;
  weight: number;
  trackingNumber: string;
  reference: string;
};

const defautAddress = { addressType: AddressEnum.package } as AddressType;
const initialPackage = {
  fromAddress: defautAddress, toAddress: defautAddress,
} as PackageType;


const PackageForm: React.FC = () => {
  const [packageData, setPackageData] = useState<PackageType>(initialPackage);
  const [message, setMessage] = useState<MessageContent>(null);
  const navigate = useNavigate();
  const { id: packageId } = useParams<{ id: string }>();

  const quickField = ({ name, type = 'number', pattern = '^[1-9][0-9]*$' }: QuickFieldProp) => (
    <Grid item xs={12} sm={6}>
      <TextField
        required
        fullWidth
        id={name}
        label={name}
        name={name}
        type={type}
        value={packageData[name] || ''}
        onChange={handleChange}
        inputProps={{ pattern }}
      /></Grid>
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!packageId) {
      return;
    }
    tryLoad(setMessage, async () => {
      const response = await axios.get(`${process.env.REACT_APP_BE_URL}/packages/${packageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPackageData(response.data);
    });
  }, [packageId]);

  const onSubmit = async (data: Partial<PackageType>) => {
    const token = localStorage.getItem('token');
    const header = {
      headers: { Authorization: `Bearer ${token}` }
    };
    if (message?.text && message.level === 'error') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    tryLoad(setMessage, async () => {
      if (packageId) {
        // update
        await axios.put(`${process.env.REACT_APP_BE_URL}/packages/${packageId}`, data, header)
      } else {
        // create
        await axios.post(`${process.env.REACT_APP_BE_URL}/packages`, data, header);
        navigate('/packages');
      }
      setMessage({
        level: 'success',
        text: packageId ? 'Package updated successfully' : 'Package added successfully'
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPackageData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleAddressChange =
    (addressType: 'fromAddress' | 'toAddress') => (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(`e.target`, addressType, e.target.name, e.target.value, 'all');
      setPackageData(prevData => ({
        ...prevData,
        [addressType]: {
          ...prevData[addressType],
          [e.target.name]: e.target.value,
        },
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(packageData);
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {packageId ? 'Edit Package' : 'Add Package'}
        </Typography>
        <MessageAlert message={message} />
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid item xs={12} mt="1.5em">
            <AddressForm
              setMessage={setMessage}
              addressData={packageData.fromAddress}
              onChange={handleAddressChange('fromAddress')}
              title="Ship From Address"
            />
          </Grid>
          <Grid item xs={12} mt="1.5em">
            <AddressForm
              setMessage={setMessage}
              addressData={packageData.toAddress}
              onChange={handleAddressChange('toAddress')}
              title="Ship To Address"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography mb='1em' mt='1.5em' variant="h6">Package Info</Typography>
            <Grid container spacing={2}>
              {quickField({ name: 'length' })}
              {quickField({ name: 'width' })}
              {quickField({ name: 'height' })}
              {quickField({ name: 'weight' })}
              {quickField({ name: 'reference', type: 'text', pattern: null })}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {packageId ? 'Update Package' : 'Add Package'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default PackageForm;
