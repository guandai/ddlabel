// frontend/src/components/AddressForm.tsx
import React, { useEffect, useState } from 'react';
import { TextField, Grid, Typography } from '@mui/material';
import axios from 'axios';

export enum AddressEnum {
  user = 'user',
  package = 'package'
}

export type AddressType = {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  email?: string;
  phone?: string;
  addressType: AddressEnum;
}

type QuickFieldProps = {
  name: keyof AddressType;
  pattern?: RegExp | string;
  autoComplete: string;
  required?: boolean;
  readOnly?: boolean;
  value?: string;
}

interface AddressFormProps {
  setError: (msg: string) => void;
  addressData: AddressType;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ setError, addressData, onChange, title }) => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    if (addressData?.zip) {
      setCity('');
      setState('');
      axios.get(`https://api.zippopotam.us/us/${addressData.zip}`)
        .then(response => {
          const place = response.data.places[0];
          setCity(place['place name']);
          setState(place['state abbreviation']);
          setError('');
        })
        .catch(error => {
          setError('Not found Zip info'); // Clear any previous error
          console.error('Error fetching city/state data:', error);
        });
    }
  }, [addressData?.zip]);

  const quickField = (prop: QuickFieldProps) => {
    const { name, autoComplete, required = true, readOnly = false, value = '', pattern=null } = prop;
    return (
    <Grid item xs={12} sm={6}>
      <TextField
        required={required}
        sx={{
          pointerEvents: readOnly ? 'none' : 'auto',
          backgroundColor: readOnly ? "#DDDDDD" : "transparent"}}
        id={name}
        fullWidth
        label={name}
        name={name}
        autoComplete={autoComplete}
        value={value || addressData[name] || ''}
        onChange={onChange}
        inputProps={{ readOnly, pattern }}
      />
    </Grid>
  )};

  return (
    <>
      <Typography variant="h6" mb='1em'>{title}</Typography>
      <Grid container spacing={2}>
        {quickField({name: 'name', autoComplete: 'name'})}
        {quickField({name: 'addressLine1', autoComplete: 'address-line1'})}
        {quickField({name: 'addressLine2', autoComplete: 'address-line2', required: false})}
        {quickField({name: 'zip', autoComplete: 'postal-code', pattern: '[0-9]{5}'})}
        {quickField({name: 'state', autoComplete: 'address-level1', readOnly: true, value: state})}
        {quickField({name: 'city', autoComplete: 'address-level2', readOnly: true, value: city})}
        {quickField({name: 'phone', autoComplete: 'tel', required: false, pattern: '[+]?[0-9]{5,}'})}
        {quickField({name: 'email', autoComplete: 'email', pattern: '^[\\w\\-\\.]+@([\\w\\-]+\\.)+[\\w\\-]{2,4}$'})}
      </Grid>
    </>
  );
};

export default AddressForm;
