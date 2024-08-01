import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { PackageType } from './PackageForm';
import { tryLoad } from '../util/errors';
import { MessageContent } from '../types';
import RateApi from '../api/RateApi';
import PostalZoneApi from '../api/PostalZone';
import { KeyZones, PostalZoneAttributes } from '@ddlabel/shared';

type PackageDialogProps = {
    setMessage: React.Dispatch<React.SetStateAction<MessageContent>>;
    selectedPackage: PackageType | null
}

const PackageGetRate: React.FC<PackageDialogProps> = ({ setMessage, selectedPackage }) => {
    const [rate, setRate] = useState<number | string | null>(null);
    const [sortCode, setSortCode] = useState<string | null>(null);


    const getPostalZone = useCallback(async (): Promise<PostalZoneAttributes | null> => {
        if (!selectedPackage) {
            return null;
        }

        const postZone = await PostalZoneApi.getPostZone(selectedPackage.fromAddress.zip);
        if (!postZone) {
            return null;
        }

        setSortCode(postZone.new_sort_code);
        return postZone;
    }, [selectedPackage, setMessage]);

    const getZone = useCallback(async (selectedPackage: PackageType, proposal: KeyZones) => {
        const zone = await PostalZoneApi.getZone(selectedPackage.toAddress.zip, proposal);
        return zone?.replace('Zone ', '');
    }, [setMessage]);

    const handleGetData = useCallback(async () => {
        if (!selectedPackage) {
            return;
        }
        tryLoad(setMessage, async () => {
            const postalZone = await getPostalZone();
            if (!postalZone) {
                setRate('Can not deliver PostalZone not found');
                return;
            }
            const zone = await getZone(selectedPackage, postalZone?.proposal);

            if (!zone || zone === '-') {
                setRate('Can not deliver');
                return;
            }

            const params = {
                length: selectedPackage.length,
                width: selectedPackage.width,
                height: selectedPackage.height,
                weight: selectedPackage.weight,
                zone, // Replace with actual zone if available
                weightUnit: 'lbs',
                volumeUnit: 'inch',
            };
            const cost = (await RateApi.getFullRate(params)).totalCost;
            if (cost === -1){
                setMessage({ text: 'No rate available', level: 'info' }); 
                setRate(`N/A`);
                return;
            }
            setRate(`$${cost.toFixed(2)}`);
        });
    }, [getPostalZone, getZone, selectedPackage, setMessage]);

    useEffect(() => {
		setMessage(null);
        handleGetData();
    }
    , [selectedPackage, handleGetData, setMessage]);

    return (
		<Box>
			<strong>Shipping Rate: </strong>{rate === null ? '...' : rate}<br />
			<strong>Sort Code: </strong>{rate === null ? '...' : sortCode}<br />
			{/* <Button onClick={handleGetData} color="primary">Get Rate</Button> */}
		</Box>
    );
};

export default PackageGetRate;
