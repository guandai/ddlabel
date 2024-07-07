// frontend/src/components/AddressForm.tsx
import React from 'react';
import { TextField, Grid, Typography } from '@mui/material';

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
            id="city"
            label="City"
            name="city"
            autoComplete="address-level2"
            value={addressData?.city || ''}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="state"
            label="State"
            name="state"
            autoComplete="address-level1"
            value={addressData?.state || ''}
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
        <Grid item xs={12}>
          <TextField
            required
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
            required
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
