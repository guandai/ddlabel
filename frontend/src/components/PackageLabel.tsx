// frontend/src/components/PackageLabel.tsx
import React from 'react';
import QRCodeComponent from './QRCodeComponent';
import BarcodeComponent from './BarcodeComponent';
import { PackageType } from './PackageForm';
import { Box, Typography } from '@mui/material';

interface PackageLabelProps {
  pkg: PackageType;
}

const PackageLabel: React.FC<PackageLabelProps> = ({ pkg }) => {
  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      <Typography variant="h6" sx={{ fontSize: '1rem' }}>Sender Information</Typography>
      <Typography sx={{ fontSize: '0.7rem' }}>Sender Address: {pkg.shipFromAddress}</Typography>
      
      <Typography variant="h6" sx={{ mt: 2, fontSize: '1rem' }}>Recipient Information</Typography>
      <Typography sx={{ fontSize: '0.7rem' }}>Recipient Name: {pkg.name}</Typography>
      <Typography sx={{ fontSize: '0.7rem' }}>Recipient Address: {pkg.shipToAddress}</Typography>
      <Typography sx={{ fontSize: '0.7rem' }}>Contact Number: {pkg.phone}</Typography>
      
      <Typography variant="h6" sx={{ mt: 2, fontSize: '1rem' }}>Package Information</Typography>
      <Typography sx={{ fontSize: '0.7rem' }}>Tracking Number: {pkg.trackingNumber}</Typography>
      <Typography sx={{ fontSize: '0.7rem' }}>Weight: {pkg.weight}</Typography>
      <Typography sx={{ fontSize: '0.7rem' }}>Dimensions: {pkg.length} x {pkg.width} x {pkg.height}</Typography>
      
      <Box sx={{ mt: 2 }}>
        <BarcodeComponent value={pkg.trackingNumber} />
      </Box>
      <Typography sx={{ fontSize: '0.7rem' }}>Tracking Number: {pkg.trackingNumber}</Typography>
      
      <Box sx={{ mt: 2 }}>
        <QRCodeComponent value={`${process.env.REACT_APP_URL}/packages/${pkg.id}`} />
      </Box>
    </Box>
  );
};

export default PackageLabel;
