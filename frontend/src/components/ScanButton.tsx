// src/components/AddPackageForm.tsx
import React, { useState } from 'react';
import { Button, DialogTitle, DialogContent, Dialog, DialogActions, Typography } from '@mui/material';
import { usePackages } from '../contexts/PackageContext';
import { addPackage } from '../services/packageService';
import BarcodeScanner from './BarcodeScanner';

const ScanButton = () => {
    const { dispatch } = usePackages();
    const [open, setOpen] = useState(false);
    const [scannedCode, setScannedCode] = useState<string | null>(null);

    const handleScanSuccess = async (decodedText: string) => {
        setScannedCode(decodedText);
        setOpen(false);

        // Call addPackage function to store the scanned code in the database
        try {
            const newPackage = await addPackage({ name: decodedText });
            dispatch({ type: 'ADD_PACKAGE', payload: newPackage });
            console.log('Package added successfully:', newPackage);
        } catch (error) {
            console.error('Failed to add package:', error);
        }
    };

    const handleScanFailure = (error: any) => {
        console.error('Scan failed: ', error);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleClickOpen} style={{ marginTop: '16px' }}>
                Scan Barcode
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Scan Barcode</DialogTitle>
                <DialogContent>
                    <BarcodeScanner onScanSuccess={handleScanSuccess} onScanFailure={handleScanFailure} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
            {
                scannedCode && (
                    <Typography variant="body1" component="p" style={{ marginTop: '16px' }}>
                        Scanned Code: {scannedCode}
                    </Typography>
                )
            }
        </>
    );
};

export default ScanButton;
