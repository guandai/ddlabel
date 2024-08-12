import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { tryLoad } from '../../util/errors';
import { MessageContent } from '../../types';
import RateApi from '../../api/RateApi';
import PostalZoneApi from '../../api/PostalZoneApi';
import { PackageModel } from '@ddlabel/shared';
import MessageAlert from '../share/MessageAlert';
import DialogCard from '../dialog/DialogCard';

type PackageDialogProps = {
    pkg: PackageModel | null
}

const PackageGetRate: React.FC<PackageDialogProps> = ({ pkg }) => {
    const [rate, setRate] = useState<number | string | null>(null);
    const [sortCode, setSortCode] = useState<string | null>(null);
    const [message, setMessage] = useState<MessageContent>(null);

    const getZone = useCallback(async (pkg: PackageModel): Promise<string> => {
        const fromZip = pkg.fromAddress.zip;
        const toZip = pkg.toAddress.zip;
        const zone = (await PostalZoneApi.getZone({fromZip, toZip})).zone?.replace('Zone ', '');
        if (!zone || zone === '-') {
            setRate('N/A');
            setMessage({ text: 'Zone is not avaliable now', level: 'info' });
            return 'N/A';
        }
        return zone;
    }, [setMessage]);
    
    const getCost = useCallback(async (pkg: PackageModel, zone: string): Promise<number> => { 
        const params = {
            length: pkg.length,
            width: pkg.width,
            height: pkg.height,
            weight: pkg.weight,
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
        if (!pkg) {
            return;
        }
        const getZoneAndCost = async () => {
            const zip = pkg?.toAddress.zip;
            setSortCode((await PostalZoneApi.getPostalZone({zip})).postalZone.sort_code);

            const zone = await getZone(pkg);
            if (zone === 'N/A' ) { return }

            const cost = await getCost(pkg, zone);
            if (cost === -1) { return; }

            setRate(`$${cost.toFixed(2)}`);
        };
        tryLoad(setMessage, getZoneAndCost);
    }, [pkg, setMessage, getCost, getZone]);

    useEffect(() => {
		setMessage(null);
        handleGetData();
    }
    , [pkg, handleGetData, setMessage]);

    return (
		<Box>
            <MessageAlert message={message} />
			<DialogCard title="Package Rate" gridNodes={[{ label: 'Sort Code',  value: rate === null ? '...' : sortCode }]} />
		</Box>
    );
};

export default PackageGetRate;
