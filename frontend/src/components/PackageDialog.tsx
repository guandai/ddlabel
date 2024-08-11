import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { PackageModel } from '@ddlabel/shared';
import PackageGetRate from './PackageGetRate';
import BeansStatusInfo from './BeansStatusInfo';
import { Line } from '../util/styled';

type PackageDialogProps = {
    open: boolean;
    handleClose: () => void;
    pkg: PackageModel | null
    ;
}

const PackageDialog: React.FC<PackageDialogProps> = ({ open, handleClose, pkg }) => {
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="package-details-title">
            <DialogTitle id="package-details-title">Package Details</DialogTitle>
            {pkg && (
                <DialogContent  sx={{width: '400px'}}>
                    <PackageGetRate pkg={pkg} />
                    <BeansStatusInfo pkg={pkg} />
                    <DialogContentText>
                        <strong>Package Id:</strong> {pkg.id}<br />
                        <Line />
                        <strong>Tracking Number:</strong> {pkg.trackingNo}<br />
                        <strong>Reference Number:</strong> {pkg.referenceNo}<br />
                        <Line />
                        From: <br />
                        <strong>Name:</strong> {pkg.fromAddress.name}<br />
                        <strong>Address1:</strong> {pkg.fromAddress.address1}<br />
                        <strong>Address2:</strong> {pkg.fromAddress.address2}<br />
                        <strong>City:</strong> {pkg.fromAddress.city}<br />
                        <strong>Zip:</strong> {pkg.fromAddress.zip}<br />
                        <strong>State:</strong> {pkg.fromAddress.state}<br />
                        <strong>Phone:</strong> {pkg.fromAddress.phone}<br />
                        <strong>Email:</strong> {pkg.fromAddress.email}<br />

                        <Line />
                        To: <br />
                        <strong>Name:</strong> {pkg.toAddress.name}<br />
                        <strong>Address1:</strong> {pkg.toAddress.address1}<br />
                        <strong>Address2:</strong> {pkg.toAddress.address2}<br />
                        <strong>City:</strong> {pkg.toAddress.city}<br />
                        <strong>Zip:</strong> {pkg.toAddress.zip}<br />
                        <strong>State:</strong> {pkg.toAddress.state}<br />
                        <strong>Phone:</strong> {pkg.toAddress.phone}<br />
                        <strong>Email:</strong> {pkg.toAddress.email}<br />

                        <Line />
                        <strong>Weight:</strong> {pkg.weight}<br />
                        <strong>Length:</strong> {pkg.length}<br />
                        <strong>Width:</strong> {pkg.width}<br />
                        <strong>Height:</strong> {pkg.height}<br />
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
