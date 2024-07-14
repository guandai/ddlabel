// frontend/src/components/AddressForm.tsx
import React, { useEffect, useState } from 'react';
import { TextField, Grid, Typography } from '@mui/material';
import axios from 'axios';
import styled from 'styled-components';

const StyledTextField = styled(TextField)`
  .Mui-readOnly.MuiInputBase-readOnly {
    color: rgba(10, 10, 10, 0.5); 
  }
`;

export type AddressType = {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  email?: string;
  phone?: string;
}

interface AddressFormProps {
  addressData?: AddressType;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ addressData, onChange, title }) => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    if (addressData?.zip) {
      axios.get(`https://api.zippopotam.us/us/${addressData.zip}`)
        .then(response => {
          const place = response.data.places[0];
          setCity(place['place name']);
          setState(place['state abbreviation']);
        })
        .catch(error => {
          console.error('Error fetching city/state data:', error);
        });
    }
  }, [addressData?.zip]);

  return (
    <>
      <Typography variant="h6">{title}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            value={addressData?.name || ''}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="addressLine1"
            label="Street"
            name="addressLine1"
            autoComplete="address-line1"
            value={addressData?.addressLine1 || ''}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="addressLine2"
            label="Street 2"
            name="addressLine2"
            autoComplete="address-line2"
            value={addressData?.addressLine2 || ''}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="zip"
            label="Zip Code"
            name="zip"
            autoComplete="postal-code"
            value={addressData?.zip || ''}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledTextField
            required
            fullWidth
            id="city"
            label="City"
            name="city"
            autoComplete="address-level2"
            value={addressData?.city || city}
            onChange={onChange}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledTextField
            required
            fullWidth
            id="state"
            label="State"
            name="state"
            autoComplete="address-level1"
            value={addressData?.state || state}
            onChange={onChange}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="phone"
            label="Phone"
            name="phone"
            autoComplete="phone"
            value={addressData?.phone || ''}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={addressData?.email || ''}
            onChange={onChange}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default AddressForm;
