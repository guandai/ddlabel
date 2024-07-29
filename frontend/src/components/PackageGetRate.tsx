import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import { FullRateRsp } from '@ddlabel/shared';
import { PackageType } from './PackageForm';
import { loadApi, tryLoad } from '../util/errors';
import { MessageContent, PostalZoneType, ZonesType } from '../types';

type PackageDialogProps = {
    setMessage: React.Dispatch<React.SetStateAction<MessageContent>>;
    selectedPackage: PackageType | null
}

const PackageGetRate: React.FC<PackageDialogProps> = ({ setMessage, selectedPackage }) => {
    const [rate, setRate] = useState<number | string | null>(null);
    const [sortCode, setSortCode] = useState<string | null>(null);


    const getPostalZone = useCallback(async (): Promise<PostalZoneType | null> => {
        if (!selectedPackage) {
            return null;
        }
        const postZone = await loadApi<PostalZoneType>(
            setMessage, 'postal_zones/get_post_zone', { zip_code: selectedPackage.shipFromAddress.zip });
        if (!postZone) {
            return null;
        }

        setSortCode(postZone.new_sort_code);
        return postZone;
    }, [selectedPackage]);

    const getZone = useCallback(async (selectedPackage: PackageType, proposal: ZonesType) => {
        const zone = await loadApi<string | '-'>(setMessage, 'postal_zones/get_zone', { zip_code: selectedPackage.shipToAddress.zip, proposal });
        return zone?.replace('Zone ', '');
    }, []);

    const handleGetData = useCallback(async () => {
        if (!selectedPackage) {
            return;
        }
        tryLoad(setMessage, async () => {
            const postalZone = await getPostalZone();
            const zone = await getZone(selectedPackage, postalZone?.proposal as ZonesType);

            if (!zone || zone === '-') {
                setRate('Can not deliver');
                return;
            }
            const response = await axios.get<FullRateRsp> (`${process.env.REACT_APP_BE_URL}/shipping_rates/full-rate`, {
                params: {
                    length: selectedPackage.length,
                    width: selectedPackage.width,
                    height: selectedPackage.height,
                    weight: selectedPackage.weight,
                    zone, // Replace with actual zone if available
                    weightUnit: 'lbs',
                    volumeUnit: 'inch',
                },
            });
            const cost = response.data.totalCost;
            if (cost === -1){
                setMessage({ text: 'No rate available', level: 'info' }); 
                setRate(`N/A`);
                return;
            }
            setRate(`$${cost.toFixed(2)}`);
        });
    }, [getPostalZone, getZone, selectedPackage]);

    useEffect(() => {
		setMessage(null);
        handleGetData();
    }
    , [selectedPackage, handleGetData]);

    return (
		<Box>
			<strong>Shipping Rate: </strong>{rate === null ? '...' : rate}<br />
			<strong>Sort Code: </strong>{rate === null ? '...' : sortCode}<br />
			{/* <Button onClick={handleGetData} color="primary">Get Rate</Button> */}
		</Box>
    );
};

export default PackageGetRate;
