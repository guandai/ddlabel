import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import BarcodeComponent from './BarcodeComponent';
import { Box, Typography } from '@mui/material';
import { PackageType } from './PackageForm';
import monkeyLogo from '../assets/svg/monkey_logo.jpg'; // Import the main logo
import monkeyFont from '../assets/svg/monkey_font.jpg'; // Import the bottom-right logo
import axios from 'axios';
import { PostalZoneType, ZonesType } from '../types';

interface PackageLabelProps {
  pkg: PackageType;
  reader?: 'web' | 'pdf';
}

const PackageLabel: React.FC<PackageLabelProps> = ({ pkg, reader }) => {
  const [sortCode, setSortCode] = useState<string | 'N/A'>('N/A');
  const [toProposal, setToProposal] = useState<ZonesType | 'N/A'>('N/A');

  console.log(`reader`, reader);
  const { width, height } = reader === 'web' ? {
    width: '4in', height: '6in',
  } : {
    width: '4in', height: '6in',
  };
  useEffect(() => {
    const path = `${process.env.REACT_APP_BE_URL}/postal_zones/get_post_zone`;
    const fetchData = async () => {

      try {
        const response = await axios.get<PostalZoneType>(path, {
          params: { zip_code: pkg.shipToAddress.zip },
        });
        const data = response.data;
        setToProposal(data.proposal as ZonesType);
        setSortCode(data.new_sort_code);
      } catch (error) {
        setToProposal('N/A');
        setSortCode('N/A');
      }
    };

    fetchData();
  }, [pkg]);

  return (
    <Box sx={{ width, height, padding: '0.1in', margin: 0, border: '4px solid black', boxSizing: 'border-box' }}>

      {/* main upper */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'top', }}>
        {/* top left part */}
        <Box sx={{ textAlign: 'left', mr: '10px', width: '70%' }}>
          {/* logo part */}
          <Box >
            <img src={monkeyLogo} alt="Monkey Logo" style={{ display: 'inline', width: '0.7in', height: 'auto' }} /> {/* Adjust logo size */}

            <Typography variant="h4" sx={{ float: 'right', display: 'inline', fontWeight: 'bold' }}>{sortCode}</Typography>

          </Box>

          {/* Return to part */}
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant='body1'>Return to:</Typography>
            <Typography sx={{ fontSize: '0.1in' }}>{pkg.shipFromAddress.name}</Typography>
            <Typography sx={{ fontSize: '0.1in' }}>{pkg.shipFromAddress.addressLine1}</Typography>
            <Typography sx={{ fontSize: '0.1in' }}>{pkg.shipFromAddress.addressLine2}</Typography>
            <Typography sx={{ fontSize: '0.1in' }}>{pkg.shipFromAddress.city} {pkg.shipFromAddress.state} {pkg.shipFromAddress.zip}</Typography>
          </Box>
        </Box>

        {/* top right part */}
        <Box sx={{ textAlign: 'right', width: '30%' }}>
          <QRCode value={`${process.env.REACT_APP_FE_URL}/packages/${pkg.id}`} size={100} /> {/* Increase QR code size */}
          <Typography sx={{ textAlign: 'center', fontSize: '3rem', fontWeight: 'bold', lineHeight: 1 }}>{toProposal as string}</Typography>
          <Typography sx={{ textAlign: 'center', fontSize: '2rem', color: 'white', backgroundColor: 'black', lineHeight: 1 }}>{pkg.shipToAddress.zip}</Typography>
        </Box>
      </Box>

      {/* Ship to part */}
      <Box mt={1} sx={{ textAlign: 'left', fontSize: '1.2rem', border: '1px solid black'}}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>SHIP TO:</Typography>
        <Typography sx={{ fontSize: '0.15in' }}>{pkg.shipToAddress.name}</Typography>
        <Typography sx={{ fontSize: '0.15in' }}>{pkg.shipToAddress.addressLine1}</Typography>
        <Typography sx={{ fontSize: '0.15in' }}>{pkg.shipToAddress.addressLine2}</Typography>
        <Typography sx={{ fontSize: '0.15in' }}>{pkg.shipToAddress.city} {pkg.shipToAddress.state} {pkg.shipToAddress.zip}</Typography>
      </Box>

      {/* lbs weight number */}
      <Box sx={{ mb: '-0.5em', textAlign: 'right' }}>
        <Typography sx={{ fontSize: '0.8rem' }}>{pkg.weight} lbs.</Typography>
      </Box>

      {/* barcode tracking */}
      <Box mt={1} sx={{ width: '100%', textAlign: 'center' }}>
        <BarcodeComponent value={pkg.trackingNumber} />
      </Box>

      {/* under barcode spacing */}
      <Box sx={{ height: '0.72in' }}>
        {" "}
      </Box>

      {/* bottom line */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: "end", }}>
        <Box > Reference: {pkg.reference}</Box>

        <img src={monkeyFont} alt="Monkey Font Logo" style={{ width: '5em' }} />
      </Box>
    </Box>
  );
};

export default PackageLabel;
