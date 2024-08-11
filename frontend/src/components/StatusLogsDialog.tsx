import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, ImageList, Box } from '@mui/material';
import { BeansAI } from '@ddlabel/shared';
import { Line } from '../util/styled';
import { unixTimeToString } from '../util/time';

type StatusLogDialogProps = {
    open: boolean;
    handleClose: () => void;
    logs: BeansAI.StatusLog[] | null;
}

const StatusLogsDialog: React.FC<StatusLogDialogProps> = ({ open, handleClose, logs }) => {
    const renderStatusLog = (log: BeansAI.StatusLog, idx: number) => 
        <Box key={`$stats_log_${idx}`}>
            <Typography variant="body2">Status: {log.description}</Typography>
            <Typography variant="body2">Time: {unixTimeToString(log.tsMillis)}</Typography>
            <Typography variant="body2">Address: {log.item?.formattedAddress}</Typography>
            {log.pod && <>
                <Typography variant="body2">EventName: {log.pod?.eventCode.name}</Typography>
                <Typography variant="body2">EventCode: {log.pod?.eventCode.code}</Typography>
                <Typography variant="body2">Position: {log.pod?.positionType}</Typography>
                <Typography variant="body2">TS: {log.pod?.ts}</Typography>
                <Typography variant="body2">Images:</Typography>
                {log.pod?.images.map((image, index) => (
                    <ImageList key={index} sx={{ width: '100%', height: '100%' }} cols={1} rowHeight={160}>
                        <img src={image.url} alt={image.url} />
                    </ImageList>
                ))} 
            </>}
            <Line />
        </Box>

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="package-details-title">
            <DialogTitle id="package-details-title">Log Details</DialogTitle>
            {logs && (
                <DialogContent sx={{ width: '400px' }}>
                    {/* {pod && <>
                        <Typography variant="body2">EventName: {pod?.eventCode.name}</Typography>
                        <Typography variant="body2">EventCode: {pod?.eventCode.code}</Typography>
                        <Typography variant="body2">Position: {pod?.positionType}</Typography>
                        <Typography variant="body2">TS: {pod?.ts}</Typography>
                        <Typography variant="body2">Images:</Typography>
                        {pod?.images.map((image, index) => (
                            <ImageList key={index} sx={{ width: '100%', height: '100%' }} cols={1} rowHeight={160}>
                                <img src={image.url} alt={image.url} />
                            </ImageList>
                        ))} 
                    </>} */}
                    
                    {logs.map((log: BeansAI.StatusLog, idx: number) => (renderStatusLog(log, idx)))}
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">Close</Button>
                    </DialogActions>
                </DialogContent>
            )}
        </Dialog>
    );
};

export default StatusLogsDialog;
