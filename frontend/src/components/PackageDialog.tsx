import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { PackageType } from './PackageForm';

type PackageDialogProps = {
        open: boolean;
        handleClose: () => void;
        selectedPackage: PackageType | null;
};

const PackageDialog: React.FC<PackageDialogProps> = ({open, handleClose, selectedPackage}) => {
    return (
        <>
            <Dialog open={open} onClose={handleClose} aria-labelledby="package-details-title">
                <DialogTitle id="package-details-title">Package Details</DialogTitle>
                {selectedPackage && (
                    <DialogContent>
                        <DialogContentText>
                            <strong>Id:</strong> {selectedPackage.id}<br />
                            <strong>Tracking Number:</strong> {selectedPackage.trackingNumber}<br />
                            <strong>Name:</strong> {selectedPackage.name}<br />
                            <strong>Ship To Address:</strong> {selectedPackage.shipToAddress}<br />
                            <strong>Phone:</strong> {selectedPackage.phone}<br />
                            <strong>Post Code:</strong> {selectedPackage.postCode}<br />
                            <strong>Email:</strong> {selectedPackage.email}<br />
                            <strong>State:</strong> {selectedPackage.state}<br />
                            <strong>Weight:</strong> {selectedPackage.weight}<br />
                            <strong>Length:</strong> {selectedPackage.length}<br />
                            <strong>Width:</strong> {selectedPackage.width}<br />
                            <strong>Height:</strong> {selectedPackage.height}<br />
                        </DialogContentText>
                    </DialogContent>
                )}
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PackageDialog;
