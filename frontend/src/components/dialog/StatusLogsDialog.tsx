import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, ImageList, ImageListItem } from '@mui/material';
import { BeansAI } from '@ddlabel/shared';
import { unixTimeToString } from '../../util/time';
import DialogCard, { PackageCardType } from './DialogCard';

type StatusLogDialogProps = {
    open: boolean;
    handleClose: () => void;
    logs: BeansAI.StatusLog[] | null;
}

const StatusLogsDialog: React.FC<StatusLogDialogProps> = ({ open, handleClose, logs }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageDialogOpen, setImageDialogOpen] = useState<boolean>(false);

    const handleThumbnailClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setImageDialogOpen(true);
    };

    const handleImageDialogClose = () => {
        setImageDialogOpen(false);
        setSelectedImage(null);
    };

    const renderStatusLog = (log: BeansAI.StatusLog, idx: number) => {
        const cards: PackageCardType[] = [
            { label: 'Status', value: log.description },
            { label: 'Time', value: unixTimeToString(log.tsMillis) },
            { label: 'Address', value: log.item?.formattedAddress },
        ];
    
        if (log.pod) {
            cards.push(
                { label: 'EventName', value: log.pod.eventCode.name },
                { label: 'EventCode', value: log.pod.eventCode.code },
                { label: 'Position', value: log.pod.positionType },
                { label: 'TS', value: log.pod.ts },
                { 
                    label: 'Images', 
                    value: (
                        <ImageList sx={{ width: '100%', height: '120%' }} cols={4} rowHeight={60}>
                            {log.pod.images.map((image, index) => (
                                <ImageListItem key={index} sx={{ 
                                    margin: '4px',
                                    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)', 
                                    borderRadius: '8px', 
                                    overflow: 'hidden' // This ensures the shadow respects the borderRadius
                                  }}>
                                    <img 
                                        src={image.url} 
                                        alt={`Log ${index + 1}`} 
                                        style={{ cursor: 'pointer', objectFit: 'cover', borderRadius: '8px' }} 
                                        onClick={() => handleThumbnailClick(image.url)}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    )
                }
            );
        }
    
        return (
            <DialogCard key={`$stats_log_${idx}`} cards={cards} title={`Log Entry ${idx + 1}`} />
        );
    };

    return (
        <>
            <Dialog 
                open={open} 
                onClose={handleClose} 
                aria-labelledby="package-details-title"
                maxWidth="md" 
                fullWidth
            >
                <DialogTitle id="package-details-title">LOG DETAILS</DialogTitle>
                {logs && (
                    <DialogContent>
                        {logs.map((log: BeansAI.StatusLog, idx: number) => renderStatusLog(log, idx))}
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">Close</Button>
                        </DialogActions>
                    </DialogContent>
                )}
            </Dialog>

            {/* Full Image Dialog */}
            <Dialog 
                open={imageDialogOpen} 
                onClose={handleImageDialogClose} 
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>Image Preview</DialogTitle>
                <DialogContent>
                    {selectedImage && (
                        <img 
                            src={selectedImage} 
                            alt="Full size preview" 
                            style={{ width: '100%', height: 'auto' }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleImageDialogClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default StatusLogsDialog;
