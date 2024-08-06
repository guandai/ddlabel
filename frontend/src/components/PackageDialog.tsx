import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { PackageModel } from '@ddlabel/shared';
import PackageGetRate from './PackageGetRate';
import BeansStatusInfo from './BeansStatusInfo';

type PackageDialogProps = {
    open: boolean;
    handleClose: () => void;
    selectedPackage: PackageModel | null
    ;
}

const PackageDialog: React.FC<PackageDialogProps> = ({ open, handleClose, selectedPackage }) => {
    const Line = () => <>
        <i style={{ display: 'block', fontSize: '0px', height: '12px', borderBottom: '1px solid black' }}>{' '}</i>
    </>

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="package-details-title">
            <DialogTitle id="package-details-title">Package Details</DialogTitle>
            {selectedPackage && (
                <DialogContent  sx={{width: '400px'}}>
                    <PackageGetRate selectedPackage={selectedPackage} />
                    <BeansStatusInfo selectedPackage={selectedPackage} />
                    <DialogContentText>
                        <strong>Package Id:</strong> {selectedPackage.id}<br />
                        <Line />
                        <strong>Tracking Number:</strong> {selectedPackage.trackingNo}<br />
                        <strong>Reference Number:</strong> {selectedPackage.referenceNo}<br />
                        <Line />
                        From: <br />
                        <strong>Name:</strong> {selectedPackage.fromAddress.name}<br />
                        <strong>Address1:</strong> {selectedPackage.fromAddress.address1}<br />
                        <strong>Address2:</strong> {selectedPackage.fromAddress.address2}<br />
                        <strong>City:</strong> {selectedPackage.fromAddress.city}<br />
                        <strong>Zip:</strong> {selectedPackage.fromAddress.zip}<br />
                        <strong>State:</strong> {selectedPackage.fromAddress.state}<br />
                        <strong>Phone:</strong> {selectedPackage.fromAddress.phone}<br />
                        <strong>Email:</strong> {selectedPackage.fromAddress.email}<br />

                        <Line />
                        To: <br />
                        <strong>Name:</strong> {selectedPackage.toAddress.name}<br />
                        <strong>Address1:</strong> {selectedPackage.toAddress.address1}<br />
                        <strong>Address2:</strong> {selectedPackage.toAddress.address2}<br />
                        <strong>City:</strong> {selectedPackage.toAddress.city}<br />
                        <strong>Zip:</strong> {selectedPackage.toAddress.zip}<br />
                        <strong>State:</strong> {selectedPackage.toAddress.state}<br />
                        <strong>Phone:</strong> {selectedPackage.toAddress.phone}<br />
                        <strong>Email:</strong> {selectedPackage.toAddress.email}<br />

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
