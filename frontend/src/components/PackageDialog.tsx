import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@mui/material';
import axios from 'axios';
import { PackageType } from './PackageForm';
import { tryLoad } from '../util/errors';

type PackageDialogProps = {
    open: boolean;
    handleClose: () => void;
    selectedPackage: PackageType | null
    ;
};

const PackageDialog: React.FC<PackageDialogProps> = ({ open, handleClose, selectedPackage }) => {
    const [rate, setRate] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getZone = async () => {
        if (!selectedPackage) {
            return;
        }
        return tryLoad<number | '-', void>(setError, async () => {
            const proposal = await axios.get(`${ process.env.REACT_APP_API_URL}/postal_zones/get_proposal`, {
                params: {
                    zip_code: selectedPackage.user.warehouseZip,
                },
            });

            const zone = await axios.get(`${ process.env.REACT_APP_API_URL}/postal_zones/get_zone`, {
                params: {
                    zip_code: selectedPackage.shipToAddress.zip,
                    proposal: proposal.data, 
                },
            });
            
            return zone.data.replace('Zone ', '');
        });
    }

    const handleGetRate = async () => {
        if (!selectedPackage) {
            return;
        }
        tryLoad(setError, async () =>{
            const zone = await getZone();
            if (!zone || zone === '-') {
                setRate(null);
                return;
            }
            const response = await axios.get(`${ process.env.REACT_APP_API_URL}/shipping_rates/full-rate`, {
                params: {
                    length: selectedPackage.length,
                    width: selectedPackage.width,
                    height: selectedPackage.height,
                    weight: selectedPackage.weight,
                    zone, // Replace with actual zone if available
                    unit: 'lbs',
                },
            });
            setRate(response.data.totalCost);
        });
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
                    {error && (
                <Typography color="error">{error}</Typography>
            )}
                    <DialogContentText>
                        <strong>Id:</strong> {selectedPackage.id}<br />
                        <strong>Shipping Rate: </strong>{rate === null ? 'N/A' :  '$' + rate.toFixed(2) }
                        
                        <br />
                        <span style={{ fontSize: '0px' , paddingLeft: '100%', lineHeight: '30px', borderBottom: '1px solid black'}}>{' '}</span>
                        <br />
                        <strong>Tracking Number:</strong> {selectedPackage.trackingNumber}<br />
                        <strong>Reference Number:</strong> {selectedPackage.reference}<br />
                        <strong>Warehouse Zip:</strong> {selectedPackage.warehouseZip}<br />
                        <strong>Ship From Address:</strong> {selectedPackage.shipFromAddress.addressLine1}<br />
                        <strong>Name:</strong> {selectedPackage.shipToAddress.name}<br />
                        <strong>City:</strong> {selectedPackage.shipToAddress.city}<br />
                        <strong>Address:</strong> {selectedPackage.shipToAddress.addressLine1}<br />
                        <strong>Address2:</strong> {selectedPackage.shipToAddress.addressLine2}<br />
                        <strong>Phone:</strong> {selectedPackage.shipToAddress.phone}<br />
                        <strong>To Zip Code:</strong> {selectedPackage.shipToAddress.zip}<br />
                        <strong>Email:</strong> {selectedPackage.shipToAddress.email}<br />
                        <strong>State:</strong> {selectedPackage.shipToAddress.state}<br />
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
