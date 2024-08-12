import React, { useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { tryLoad } from '../../util/errors';
import { MessageContent } from '../../types';
import { BeansStatus, PackageModel } from '@ddlabel/shared';
import MessageAlert from './MessageAlert';
import BeansAiApi from '../../external/beansApi';
import DialogCard from '../dialog/DialogCard';
import { StatusLabel } from '../../util/styled';

type PackageDialogProps = {
    pkg: PackageModel | null
}

const BeansStatusInfo: React.FC<PackageDialogProps> = ({ pkg }) => {
	const [message, setMessage] = useState<MessageContent>(null);
    const [status, setStatus] = useState<string>();
    
    const handleGetData = useCallback(async () => {
        if (!pkg) {
            return;
        }
        const  getStatusLog = async () => {
			const statusLog = (await BeansAiApi.getStatusLog({trackingNo: pkg.trackingNo}));
			if (!('listItemReadableStatusLogs' in statusLog)) {
				setStatus('N/A');
				return;
			}
			const status = statusLog.listItemReadableStatusLogs?.[0].item.status;
			setStatus(status);
        };
        tryLoad(setMessage, getStatusLog);
    }, [pkg, setMessage]);

    useEffect(() => {
		setMessage(null);
        handleGetData();
    }
    , [pkg, handleGetData, setMessage]);

    const value = <StatusLabel status={(status || 'N/A' )as BeansStatus}>{status}</StatusLabel>;
    return (
		<Box>
			<MessageAlert message={message} />
            <DialogCard title="Beans Status Info" gridNodes={[{ label: 'Tracking Status',  value}]} />
		</Box>
    );
};

export default BeansStatusInfo;
