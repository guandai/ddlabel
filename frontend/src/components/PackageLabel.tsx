// frontend/src/components/NewPackageLabel.tsx
import React from 'react';
import QRCode from 'qrcode.react';
import BarcodeComponent from './BarcodeComponent';
import { Box, Typography } from '@mui/material';
import { PackageType } from './PackageForm';
import monkeyLogo from '../assets/svg/monkey_logo.jpg'; // Import the main logo
import monkeyFont from '../assets/svg/monkey_font.jpg'; // Import the bottom-right logo

interface PackageLabelProps {
  pkg: PackageType;
}

const NewPackageLabel: React.FC<PackageLabelProps> = ({ pkg }) => {
  return (
    <Box sx={{ width: '384px', height: '576px', padding: '1em', border: '0.25em solid black', position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'top' }}>
        <Box sx={{ textAlign: 'left', mr: '1em', width: '60%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <img src={monkeyLogo} alt="Monkey Logo" style={{ width: '6em', height: 'auto' }} /> {/* Adjust logo size */}
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>BKN A02</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography sx={{ fontWeight: 'bold' }}>Return to:</Typography>
              <Typography sx={{ fontSize: '0.8rem' }}>{pkg.shipFromAddress.name}</Typography>
              <Typography sx={{ fontSize: '0.8rem' }}>{pkg.shipFromAddress.addressLine1}</Typography>
              <Typography sx={{ fontSize: '0.8rem' }}>{pkg.shipFromAddress.addressLine2}</Typography>
              <Typography sx={{ fontSize: '0.8rem' }}>{pkg.shipFromAddress.state} {pkg.shipFromAddress.zip}</Typography>
            </Box>
          </Box>
          <hr style={{ height: '0.125em', backgroundColor: '#000' }} />
          <Box sx={{ textAlign: 'left', fontSize: '1.2rem' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>SHIP TO:</Typography>
            <Typography sx={{ fontSize: '1.4rem', lineHeight: '1em' }}>{pkg.shipToAddress.name}</Typography>
            <Typography sx={{ fontSize: '1.4rem', lineHeight: '1em' }}>{pkg.shipToAddress.addressLine1}</Typography>
            <Typography sx={{ fontSize: '1.4rem', lineHeight: '1em' }}>{pkg.shipToAddress.addressLine2}</Typography>
            <Typography sx={{ fontSize: '1.4rem', lineHeight: '1em' }}>{pkg.shipToAddress.state} {pkg.shipToAddress.zip}</Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right', mt: '1em', width: '40%' }}>
          <QRCode value={`${process.env.REACT_APP_URL}/packages/${pkg.id}`} size={136} /> {/* Increase QR code size */}
          <Typography sx={{ textAlign: 'center', fontSize: '2rem', color: 'white', backgroundColor: 'black', mt: '0.5em', lineHeight: 1 }}>{pkg.shipFromAddress.zip}</Typography> {/* SHIP TO zip code */}
        </Box>
      </Box>
      <Box sx={{ mb: '-0.5em', textAlign: 'right' }}>
        <Typography sx={{ fontSize: '0.8rem' }}>Weight: {pkg.weight} lbs.</Typography>
      </Box>
      <Box sx={{ mt: '0.5em', display: 'flex', justifyContent: 'center' }}>
        <BarcodeComponent value={pkg.trackingNumber} />
      </Box>
      <Box sx={{ width: "100%", position: "absolute", bottom: "0", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'left', fontWeight: 'bold', fontSize: '1.2rem' }}>
          reference {pkg.reference}
        </Box>
        <Box>
          <img src={monkeyFont} alt="Monkey Font Logo" style={{ width: '7em', marginRight: '1.5em' }} />
        </Box>
      </Box>
    </Box>
  );
};

export default NewPackageLabel;
