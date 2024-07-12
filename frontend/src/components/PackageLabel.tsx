// frontend/src/components PackageLabel.tsx
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
}

const PackageLabel: React.FC<PackageLabelProps> = ({ pkg }) => {  
  const [sortCode, setSortCode] = useState<string | 'N/A' >('N/A');
  const [toProposal, setToProposal] = useState<ZonesType | 'N/A' >('N/A');
  const [fromProposal, setFromProposal] = useState<ZonesType | 'N/A' >('N/A');
  useEffect(() => {
    const path = `${process.env.REACT_APP_API_URL}/postal_zones/get_post_zone`;
    const fetchData = async () => {
      try {
        const response = await axios.get(path, {
          params: { zip_code: pkg.user.warehouseZip },
        });
        const data = response.data;
        setFromProposal(data.proposal as ZonesType);
      } catch (error) {
        setFromProposal('N/A');
      }

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
    <Box sx={{ width: '384px', height: '576px', padding: '1em', border: '0.25em solid black', position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'top' }}>
        <Box sx={{ textAlign: 'left', mr: '1em', width: '60%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <img src={monkeyLogo} alt="Monkey Logo" style={{ width: '6em', height: 'auto' }} /> {/* Adjust logo size */}
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{sortCode}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Return to:</Typography>
              <Typography sx={{ fontSize: '0.8rem' }}>{pkg.shipFromAddress.name}</Typography>
              <Typography sx={{ fontSize: '0.8rem' }}>{pkg.shipFromAddress.addressLine1}</Typography>
              <Typography sx={{ fontSize: '0.8rem' }}>{pkg.shipFromAddress.addressLine2}</Typography>
              <Typography sx={{ fontSize: '0.8rem' }}>{pkg.shipFromAddress.state} {pkg.shipFromAddress.zip}</Typography>
            </Box>
          </Box>
          <hr style={{ height: '0.125em', backgroundColor: '#000' }} />
          <Box sx={{ textAlign: 'left', fontSize: '1.2rem' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>SHIP TO:</Typography>
            <Typography sx={{ fontSize: '1rem', lineHeight: '1em' }}>{pkg.shipToAddress.name}</Typography>
            <Typography sx={{ fontSize: '1rem', lineHeight: '1em' }}>{pkg.shipToAddress.addressLine1}</Typography>
            <Typography sx={{ fontSize: '1rem', lineHeight: '1em' }}>{pkg.shipToAddress.addressLine2}</Typography>
            <Typography sx={{ fontSize: '1rem', lineHeight: '1em' }}>{pkg.shipToAddress.state} {pkg.shipToAddress.zip}</Typography>
          </Box>
        </Box>
        <Box sx={{ position: 'relative', textAlign: 'right', mt: '1em', width: '40%' }}>
          <QRCode value={`${process.env.REACT_APP_URL}/packages/${pkg.id}`} size={136} /> {/* Increase QR code size */}
          <Typography sx={{ textAlign: 'center', fontSize: '3rem', fontWeight: 'bold', lineHeight: 1 }}>{ toProposal as string }</Typography> 
          <Typography sx={{ textAlign: 'center', fontSize: '2rem', color: 'white', backgroundColor: 'black', lineHeight: 1 }}>{pkg.shipToAddress.zip}</Typography>

          <Box sx={{ mb: '-0.5em', textAlign: 'right' }}>
            <Typography sx={{ fontSize: '0.8rem', position: 'absolute', right: 0, bottom: 0 }}>{pkg.weight} lbs.</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <BarcodeComponent value={pkg.trackingNumber} />
      </Box>


      <Box sx={{ position: "absolute", bottom: "0"  }}>
        
          <Box sx={{ fontSize: '0.8rem' }}>
            Reference:
          </Box>
          <Box sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
            {pkg.reference}
          </Box>
        
      </Box>

      <Box sx={{ position: "absolute", bottom: "0", right: '-1.2em'}}>
        <img src={monkeyFont} alt="Monkey Font Logo" style={{ width: '7em', marginRight: '1.5em' }} />
      </Box>
    </Box>
  );
};

export default PackageLabel;
