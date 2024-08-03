import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { tryLoad } from '../util/errors';
import { MessageContent } from '../types';
import RateApi from '../api/RateApi';
import PostalZoneApi from '../api/PostalZoneApi';
import { PackageType } from '@ddlabel/shared';
import MessageAlert from './MessageAlert';

type PackageDialogProps = {
    selectedPackage: PackageType | null
}

const PackageGetRate: React.FC<PackageDialogProps> = ({ selectedPackage }) => {
    const [rate, setRate] = useState<number | string | null>(null);
    const [sortCode, setSortCode] = useState<string | null>(null);
    const [message, setMessage] = useState<MessageContent>(null);

    const getZone = useCallback(async (selectedPackage: PackageType): Promise<string> => {
        const fromZip = selectedPackage.fromAddress.zip;
        const toZip = selectedPackage.toAddress.zip;
        const zone = (await PostalZoneApi.getZone({fromZip, toZip})).zone?.replace('Zone ', '');
        if (!zone || zone === '-') {
            setRate('N/A');
            setMessage({ text: 'Zone is not avaliable now', level: 'info' });
            return 'N/A';
        }
        return zone;
    }, [setMessage]);
    
    const getCost = useCallback(async (selectedPackage: PackageType, zone: string): Promise<number> => { 
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
            return -1;
        }
        return cost;
    }, [setMessage]);
    
    const handleGetData = useCallback(async () => {
        if (!selectedPackage) {
            return;
        }
        tryLoad(setMessage, async () => {
            const zip = selectedPackage?.toAddress.zip;
            setSortCode((await PostalZoneApi.getPostalZone({zip})).postalZone.sort_code);

            const zone = await getZone(selectedPackage);
            if (zone === 'N/A' ) { return }

            const cost = await getCost(selectedPackage, zone);
            if (cost === -1) { return; }

            setRate(`$${cost.toFixed(2)}`);
        });
    }, [selectedPackage, setMessage, getCost, getZone]);

    useEffect(() => {
		setMessage(null);
        handleGetData();
    }
    , [selectedPackage, handleGetData, setMessage]);

    return (
		<Box>
            <MessageAlert message={message} />
			<strong>Shipping Rate: </strong>{rate === null ? '...' : rate}<br />
			<strong>Sort Code: </strong>{rate === null ? '...' : sortCode}<br />
			{/* <Button onClick={handleGetData} color="primary">Get Rate</Button> */}
		</Box>
    );
};

export default PackageGetRate;
