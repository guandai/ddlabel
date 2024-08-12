import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { PackageModel } from '@ddlabel/shared';
import BeansStatusInfo from '../share/BeansStatusInfo';
import DialogCard from './DialogCard';

type PackageDialogProps = {
    open: boolean;
    handleClose: () => void;
    pkg: PackageModel | null;
}

const PackageDialog: React.FC<PackageDialogProps> = ({ open, handleClose, pkg }) => {
    if (!pkg) return null;

    const packageInfo = [
        { label: 'Package Id', value: pkg.id },
        { label: 'Tracking Number', value: pkg.trackingNo },
        { label: 'Reference Number', value: pkg.referenceNo },
    ];

    const senderInfo = [
        { label: 'Name', value: pkg.fromAddress.name },
        { label: 'Phone', value: pkg.fromAddress.phone },
        { label: 'Address 1', value: pkg.fromAddress.address1 },
        { label: 'Address 2', value: pkg.fromAddress.address2 },
        { label: 'City', value: pkg.fromAddress.city },
        { label: 'State', value: pkg.fromAddress.state },
        { label: 'Zip', value: pkg.fromAddress.zip },
        { label: 'Email', value: pkg.fromAddress.email },
    ];

    const receiverInfo = [
        { label: 'Name', value: pkg.toAddress.name },
        { label: 'Phone', value: pkg.toAddress.phone },
        { label: 'Address 1', value: pkg.toAddress.address1 },
        { label: 'Address 2', value: pkg.toAddress.address2 },
        { label: 'City', value: pkg.toAddress.city },
        { label: 'State', value: pkg.toAddress.state },
        { label: 'Zip', value: pkg.toAddress.zip },
        { label: 'Email', value: pkg.toAddress.email },
    ];

    const packageDimensions = [
        { label: 'Weight', value: `${pkg.weight} kg` },
        { label: 'Length', value: `${pkg.length} cm` },
        { label: 'Width', value: `${pkg.width} cm` },
        { label: 'Height', value: `${pkg.height} cm` },
    ];

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="package-details-title"
            maxWidth="md"
            fullWidth
        >
            <DialogTitle id="package-details-title">Package Details</DialogTitle>
            <DialogContent >
                {/* <PackageGetRate pkg={pkg} /> */}
                <BeansStatusInfo pkg={pkg} />

                <DialogCard title="Package Information" gridNodes={packageInfo} />
                <DialogCard title="Sender Information" gridNodes={senderInfo} />
                <DialogCard title="Receiver Information" gridNodes={receiverInfo} />
                <DialogCard title="Package Dimensions" gridNodes={packageDimensions} />

                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default PackageDialog;
