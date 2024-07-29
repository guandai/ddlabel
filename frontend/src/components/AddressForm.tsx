// frontend/src/components/AddressForm.tsx
import React, { useEffect, useState } from 'react';
import { TextField, Grid, Typography } from '@mui/material';
import axios from 'axios';
import { SetMessage, tryLoad } from '../util/errors';
import { AddressEnum } from '@ddlabel/shared';

export type AddressType = {
  name: string;
  address1: string;
  address2?: string;
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
  setMessage: SetMessage;
  addressData: AddressType;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ setMessage, addressData, onChange, title }) => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    if (addressData?.zip) {
      setCity('');
      setState('');
      tryLoad(setMessage, async () => {
        const response = await axios.get(`${process.env.REACT_APP_BE_URL}/zipcodes/datafile/${addressData.zip}`)
        const info = response.data;
        setCity(info.city);
        setState(info.state);
        setMessage(null);
      })
    }
  }, [addressData.zip, setMessage]);

  useEffect(() => {
    onChange({ target: { name: 'city', value: city } } as React.ChangeEvent<HTMLInputElement>);
    onChange({ target: { name: 'state', value: state } } as React.ChangeEvent<HTMLInputElement>);
  }, [city, state]);


  const quickField = (prop: QuickFieldProps) => {
    const { name, autoComplete, required = true, readOnly = false, value = '', pattern = null } = prop;
    return (
      <Grid item xs={12} sm={6}>
        <TextField
          sx={{
            pointerEvents: readOnly ? 'none' : 'auto',
            backgroundColor: readOnly ? "#dddddd" : "transparent"
          }}
          required={required}
          id={name}
          fullWidth
          label={name}
          name={name}
          autoComplete={autoComplete}
          value={value || addressData[name] || ''}
          onChange={onChange}
          inputProps={{ pattern, maxLength: 38 }}
        />
      </Grid>
    )
  };

  return (
    <>
      <Typography variant="h6" mb='1em'>{title}</Typography>
      <Grid container spacing={2}>
        {quickField({ name: 'name', autoComplete: 'name' })}
        {quickField({ name: 'address1', autoComplete: 'address-line1' })}
        {quickField({ name: 'address2', autoComplete: 'address-line2', required: false })}
        {quickField({ name: 'zip', autoComplete: 'postal-code', pattern: '[0-9]{5}' })}
        {quickField({ name: 'state', autoComplete: 'address-level1', readOnly: true, value: state })}
        {quickField({ name: 'city', autoComplete: 'address-level2', readOnly: true, value: city })}
        {quickField({ name: 'phone', autoComplete: 'tel', required: false, pattern: '[+]?[0-9]{5,}' })}
        {quickField({ name: 'email', autoComplete: 'email', required: false, pattern: '^[\\w\\-\\.]+@([\\w\\-]+\\.)+[\\w\\-]{2,4}$' })}
      </Grid>
    </>
  );
};

export default AddressForm;
