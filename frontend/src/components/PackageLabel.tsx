// frontend/src/components/NewPackageLabel.tsx
import React from 'react';
import QRCode from 'qrcode.react';
import BarcodeComponent from './BarcodeComponent';
import { Box, Typography } from '@mui/material';
import { PackageType } from './PackageForm';
import monkeyLogo from '../assets/svg/monkey_logo.svg'; // Import the main logo
import monkeyFont from '../assets/svg/monkey_font.svg'; // Import the bottom-right logo

interface PackageLabelProps {
  pkg: PackageType;
}

const NewPackageLabel: React.FC<PackageLabelProps> = ({ pkg }) => {
  return (
    <Box sx={{ width: '4in', height: '6in', padding: 1, border: '1px solid black', position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <img src={monkeyLogo} alt="Monkey Logo" style={{ width: '1.5in', height: 'auto' }} /> {/* Adjust logo size */}
        <Box sx={{ textAlign: 'right' }}>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Return to:</Typography>
          <Typography sx={{ fontSize: '0.8rem' }}>{pkg.shipFromAddress.name}</Typography>
          <Typography sx={{ fontSize: '0.8rem' }}>{pkg.shipFromAddress.addressLine1}</Typography>
          <Typography sx={{ fontSize: '0.8rem' }}>{pkg.shipFromAddress.addressLine2}</Typography>
          <Typography sx={{ fontSize: '0.8rem' }}>{pkg.shipFromAddress.state} {pkg.shipFromAddress.zip}</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <QRCode value={`${process.env.REACT_APP_URL}/packages/${pkg.id}`} size={128} /> {/* Increase QR code size */}
          <Typography sx={{ fontSize: '1rem', mt: 1 }}>{pkg.shipFromAddress.zip}</Typography> {/* SHIP TO zip code */}
        </Box>
      </Box>

      <Box sx={{ textAlign: 'left', mt: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>SHIP TO:</Typography>
        <Typography sx={{ fontSize: '0.8rem' }}>{pkg.shipToAddress.name}</Typography>
        <Typography sx={{ fontSize: '0.8rem' }}>{pkg.shipToAddress.addressLine1}</Typography>
        <Typography sx={{ fontSize: '0.8rem' }}>{pkg.shipToAddress.addressLine2}</Typography>
        <Typography sx={{ fontSize: '0.8rem' }}>{pkg.shipToAddress.state} {pkg.shipToAddress.zip}</Typography>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <BarcodeComponent value={pkg.trackingNumber} />
      </Box>

      <Box sx={{ textAlign: 'left', mt: 2 }}>
        <Typography sx={{ fontSize: '0.8rem' }}>Weight: {pkg.weight} lbs.</Typography>
        <Typography sx={{ fontSize: '0.8rem' }}>Reference: {pkg.trackingNumber}</Typography>
      </Box>

      <Box sx={{ textAlign: 'left', mt: 2, fontWeight: 'bold', fontSize: '1.2rem' }}>
        {pkg.shipFromAddress.zip}
      </Box>

      <Box sx={{ position: 'absolute', bottom: 0, right: 0, p: 1 }}>
        <img src={monkeyFont} alt="Monkey Font Logo" style={{ width: '1in', height: 'auto' }} /> {/* Adjust size as needed */}
      </Box>
    </Box>
  );
};

export default NewPackageLabel;
