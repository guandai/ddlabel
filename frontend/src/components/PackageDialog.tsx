import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@mui/material';
import axios from 'axios';
import { PackageType } from './PackageForm';

type PackageDialogProps = {
    open: boolean;
    handleClose: () => void;
    selectedPackage: PackageType | null
    ;
};

const PackageDialog: React.FC<PackageDialogProps> = ({ open, handleClose, selectedPackage }) => {
    const [rate, setRate] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGetRate = async () => {
        if (selectedPackage) {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/shipping-rates/full-rate`, {
                    params: {
                        length: selectedPackage.length,
                        width: selectedPackage.width,
                        height: selectedPackage.height,
                        weight: selectedPackage.weight,
                        zone: 3, // Replace with actual zone if available
                        unit: 'lbs',
                    },
                });
                setRate(response.data.totalCost);
            } catch (error) {
                setError('Failed to calculate shipping rate.');
            }
        }
    };

    useEffect(() => {
        setRate(null);
        setError(null);
        handleGetRate();
    }
    , [selectedPackage]);

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="package-details-title">
            <DialogTitle id="package-details-title">Package Details</DialogTitle>
            {selectedPackage && (
                <DialogContent>
                    <DialogContentText>
                        <strong>Id:</strong> {selectedPackage.id}<br />
                        <Typography><strong>Shipping Rate: </strong>{rate === null ? '...' :  '$' + rate.toFixed(2) }</Typography>
                        {error && (
                            <Typography color="error">{error}</Typography>
                        )}
                        <hr></hr><br />
                        <strong>Tracking Number:</strong> {selectedPackage.trackingNumber}<br />
                        <strong>Name:</strong> {selectedPackage.name}<br />
                        <strong>Ship From Address:</strong> {selectedPackage.shipFromAddress}<br />
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
                <Button onClick={handleGetRate} color="primary">Get Rate</Button>
                <Button onClick={handleClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PackageDialog;
