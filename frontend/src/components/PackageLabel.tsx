import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import BarcodeComponent from './BarcodeComponent';
import { Box, Typography } from '@mui/material';
import { PackageType } from './PackageForm';
import monkeyLogo from '../assets/svg/monkey_logo.jpg'; // Import the main logo
import monkeyFont from '../assets/svg/monkey_font.jpg'; // Import the bottom-right logo
import axios from 'axios';
import { PostalZoneType, ZonesType } from '../types';
import styled from 'styled-components';

const MonoTypoSmall = styled(Typography)(() => ({
  fontFamily: 'monospace',
  fontSize: '0.11in'
}));
const MonoTypoNormal = styled(Typography)(() => ({
  fontFamily: 'monospace',
  fontSize: '0.15in'
}));

interface PackageLabelProps {
  pkg: PackageType;
  reader?: 'web' | 'pdf';
}

const PackageLabel: React.FC<PackageLabelProps> = ({ pkg, reader }) => {
  const [sortCode, setSortCode] = useState<string | 'N/A'>('N/A');
  const [toProposal, setToProposal] = useState<ZonesType | 'N/A'>('N/A');

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
          params: { zip_code: pkg.toAddress.zip },
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
    <Box sx={{ width, height, padding: '0.1in', margin: 0, border: '0.02in solid black', boxSizing: 'border-box' }}>

      {/* main upper */}
      <Box sx={{ height: '1.  9in', display: 'flex', justifyContent: 'space-between', alignItems: 'top', }}>
        {/* top left part */}
        <Box sx={{ textAlign: 'left', mr: '8px', width: '70%' }}>
          {/* logo part */}
          <Box >
            <img src={monkeyLogo} alt="Monkey Logo" style={{ display: 'inline', width: '0.7in'}} /> {/* Adjust logo size */}
            <Typography variant="h4" sx={{ float: 'right', display: 'inline', fontWeight: 'bold' }}>{sortCode}</Typography>
          </Box>

          {/* Return to part */}
          <Box sx={{ height: '1.05in', textAlign: 'left' }}>
            <MonoTypoSmall variant='body1'>Return to:</MonoTypoSmall>
            <MonoTypoSmall >{pkg.fromAddress.name}</MonoTypoSmall>
            <MonoTypoSmall >{pkg.fromAddress.address1}</MonoTypoSmall>
            <MonoTypoSmall >{pkg.fromAddress.address2}</MonoTypoSmall>
            <MonoTypoSmall >{pkg.fromAddress.city} {pkg.fromAddress.state} {pkg.fromAddress.zip}</MonoTypoSmall>
          </Box>
        </Box>

        {/* top right part */}
        <Box sx={{ textAlign: 'right', width: '30%' }}>
          <QRCode value={`${process.env.REACT_APP_FE_URL}/packages/${pkg.id}`} size={100} /> {/* Increase QR code size */}
          <Typography sx={{ textAlign: 'center', fontSize: '3rem', fontWeight: 'bold', lineHeight: 1 }}>{toProposal as string}</Typography>
          <Typography sx={{ textAlign: 'center', fontSize: '2rem', color: 'white', backgroundColor: 'black', lineHeight: 1 }}>{pkg.toAddress.zip}</Typography>
        </Box>
      </Box>

      {/* Ship to part */}
      <Box mt={1} sx={{ height: '1.15in', borderTop : 'solid' }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>SHIP TO:</Typography>
        <MonoTypoNormal >{pkg.toAddress.name}</MonoTypoNormal>
        <MonoTypoNormal >{pkg.toAddress.address1}</MonoTypoNormal>
        <MonoTypoNormal >{pkg.toAddress.address2}</MonoTypoNormal>
        <MonoTypoNormal >{pkg.toAddress.city} {pkg.toAddress.state} {pkg.toAddress.zip}</MonoTypoNormal>
      </Box>

      {/* lbs weight number */}
      <Box sx={{ height: '0.2in', textAlign: 'right' }}>
        <Typography sx={{ fontSize: '0.8rem' }}>{pkg.weight} lbs.</Typography>
      </Box>

      {/* barcode tracking */}
      <Box sx={{ height: '1.5in', width: '100%', textAlign: 'center' }}>
        <BarcodeComponent value={pkg.trackingNo} />
      </Box>

      {/* under barcode spacing */}
      <Box sx={{ height: '0.7in' }}>
        {" "}
      </Box>

      {/* bottom line */}
      <Box sx={{ height: '0.2in', display: 'flex', justifyContent: 'space-between', alignItems: "end", }}>
        <Box> Reference No: {pkg.referenceNo}</Box>
        <img src={monkeyFont} alt="Monkey Font Logo" style={{ width: '5em' }} />
      </Box>
    </Box>
  );
};

export default PackageLabel;
