import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { tryLoad } from '../util/errors';
import { MessageContent } from '../types';
import { PackageModel } from '@ddlabel/shared';
import MessageAlert from './MessageAlert';
import BeansStatusLogApi from '../external/beansApi';

type PackageDialogProps = {
    selectedPackage: PackageModel | null
}

const BeansStatusInfo: React.FC<PackageDialogProps> = ({ selectedPackage }) => {
	const [message, setMessage] = useState<MessageContent>(null);
    const [status, setStatus] = useState<string>();
    
    const handleGetData = useCallback(async () => {
        if (!selectedPackage) {
            return;
        }
        const  getStatusLog = async () => {
			const statusLog = (await BeansStatusLogApi.getStatusLog({trackingNo: selectedPackage.trackingNo}));
			if (!('listItemReadableStatusLogs' in statusLog)) {
				setStatus('N/A');
				return;
			}
			const status = statusLog.listItemReadableStatusLogs?.[0].item.status;
			setStatus(status);
        };
        tryLoad(setMessage, getStatusLog);
    }, [selectedPackage, setMessage]);

    useEffect(() => {
		setMessage(null);
        handleGetData();
    }
    , [selectedPackage, handleGetData, setMessage]);

    return (
		<Box>
			<MessageAlert message={message} />
			<strong>Tracking Status: </strong>{ status }<br />
		</Box>
    );
};

export default BeansStatusInfo;
