import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { PackageType } from './PackageForm';
import { MessageContent } from '../types';
import MessageAlert from './MessageAlert';
import PackageGetRate from './PackageGetRate';

type PackageDialogProps = {
    open: boolean;
    handleClose: () => void;
    selectedPackage: PackageType | null
    ;
}

const PackageDialog: React.FC<PackageDialogProps> = ({ open, handleClose, selectedPackage }) => {
    const [message, setMessage] = useState<MessageContent>(null);

    const Line = () => <>
        <i style={{ display: 'block', fontSize: '0px', height: '12px', borderBottom: '1px solid black' }}>{' '}</i>
    </>

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="package-details-title">
            <DialogTitle id="package-details-title">Package Details</DialogTitle>
            {selectedPackage && (
                <DialogContent  sx={{width: '400px'}}>
                    <MessageAlert message={message} />
                    <PackageGetRate setMessage={setMessage} selectedPackage={selectedPackage} />
                    <DialogContentText>
                        <strong>Id:</strong> {selectedPackage.id}<br />
                        <Line />
                        <strong>Tracking Number:</strong> {selectedPackage.trackingNumber}<br />
                        <strong>Reference Number:</strong> {selectedPackage.reference}<br />
                        <Line />
                        From: <br />
                        <strong>Name:</strong> {selectedPackage.shipFromAddress.name}<br />
                        <strong>Address1:</strong> {selectedPackage.shipFromAddress.addressLine1}<br />
                        <strong>Address2:</strong> {selectedPackage.shipFromAddress.addressLine2}<br />
                        <strong>City:</strong> {selectedPackage.shipFromAddress.city}<br />
                        <strong>Zip:</strong> {selectedPackage.shipFromAddress.zip}<br />
                        <strong>State:</strong> {selectedPackage.shipFromAddress.state}<br />
                        <strong>Phone:</strong> {selectedPackage.shipFromAddress.phone}<br />
                        <strong>Email:</strong> {selectedPackage.shipFromAddress.email}<br />

                        <Line />
                        To: <br />
                        <strong>Name:</strong> {selectedPackage.shipToAddress.name}<br />
                        <strong>Address1:</strong> {selectedPackage.shipToAddress.addressLine1}<br />
                        <strong>Address2:</strong> {selectedPackage.shipToAddress.addressLine2}<br />
                        <strong>City:</strong> {selectedPackage.shipToAddress.city}<br />
                        <strong>Zip:</strong> {selectedPackage.shipToAddress.zip}<br />
                        <strong>State:</strong> {selectedPackage.shipToAddress.state}<br />
                        <strong>Phone:</strong> {selectedPackage.shipToAddress.phone}<br />
                        <strong>Email:</strong> {selectedPackage.shipToAddress.email}<br />

                        <Line />
                        <strong>Weight:</strong> {selectedPackage.weight}<br />
                        <strong>Length:</strong> {selectedPackage.length}<br />
                        <strong>Width:</strong> {selectedPackage.width}<br />
                        <strong>Height:</strong> {selectedPackage.height}<br />
                    </DialogContentText>

                    <DialogActions>
                        <Button onClick={handleClose} color="primary">Close</Button>
                    </DialogActions>
                </DialogContent>
            )}
        </Dialog>
    );
};

export default PackageDialog;
