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
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Sender Information</Typography>
      <Typography>Sender Address: {pkg.shipFromAddress}</Typography>
      
      <Typography variant="h6" sx={{ mt: 2 }}>Recipient Information</Typography>
      <Typography>Recipient Name: {pkg.name}</Typography>
      <Typography>Recipient Address: {pkg.shipToAddress}</Typography>
      <Typography>Contact Number: {pkg.phone}</Typography>
      
      <Typography variant="h6" sx={{ mt: 2 }}>Package Information</Typography>
      <Typography>Tracking Number: {pkg.trackingNumber}</Typography>
      <Typography>Weight: {pkg.weight}</Typography>
      <Typography>Dimensions: {pkg.length} x {pkg.width} x {pkg.height}</Typography>
      
      <Box sx={{ mt: 2 }}>
        <BarcodeComponent value={pkg.trackingNumber} />
      </Box>
      <Typography>Tracking Number: {pkg.trackingNumber}</Typography>
      
      <Box sx={{ mt: 2 }}>
        <QRCodeComponent value={`${process.env.REACT_APP_URL}/packages/${pkg.id}`} />
      </Box>
    </Box>
  );
};

export default PackageLabel;
