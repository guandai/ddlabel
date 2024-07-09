import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@mui/material';
import axios from 'axios';
import { PackageType } from './PackageForm';
import { loadApi, tryLoad } from '../util/errors';
import { PostalZoneType, ZonesType } from '../types';

type PackageDialogProps = {
    open: boolean;
    handleClose: () => void;
    selectedPackage: PackageType | null
    ;
};

const PackageDialog: React.FC<PackageDialogProps> = ({ open, handleClose, selectedPackage }) => {
    const [rate, setRate] = useState<number | string | null>(null);
    const [sortCode, setSortCode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const Line = () => <>
        <br />
        <div style={{ fontSize: '0px' , paddingLeft: '100%', lineHeight: '30px', borderBottom: '1px solid black'}}>{' '}</div>
    </>

    const getPostalZone = async (): Promise<PostalZoneType | null> => {
        if (!selectedPackage) {
            return null;
        }
        const postZone = await loadApi<PostalZoneType>(setError, 'postal_zones/get_post_zone', { zip_code: selectedPackage.user.warehouseZip });
        if (!postZone) {
            return null;
        }

        setSortCode(postZone.new_sort_code);
        return postZone;
    }

    const getZone = async (selectedPackage: PackageType, proposal: ZonesType) => {
        const zone = await loadApi<string | '-'>(setError, 'postal_zones/get_zone', { zip_code: selectedPackage.shipToAddress.zip, proposal });
        return zone?.replace('Zone ', '');
    }

    const handleGetData = async () => {
        if (!selectedPackage) {
            return;
        }
        tryLoad(setError, async () =>{
            const postalZone = await getPostalZone();
            const zone = await getZone(selectedPackage, postalZone?.proposal as ZonesType);

            if (!zone || zone === '-') {
                setRate('Can not deliver');
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
            setRate('$' + response.data.totalCost.toFixed(2));
        });
    };

    useEffect(() => {
        setRate(null);
        setError(null);
        handleGetData();
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
                        <strong>Shipping Rate: </strong>{rate === null ? '...' :  rate }<br />
                        <strong>Sort Code: </strong>{rate === null ? '...' :  sortCode }<br />
                        
                        <Line />
                        <strong>Tracking Number:</strong> {selectedPackage.trackingNumber}<br />
                        <strong>Reference Number:</strong> {selectedPackage.reference}<br />
                        <strong>Warehouse Zip:</strong> {selectedPackage.user.warehouseZip}<br />
                        
                        <Line />
                        <strong>Name:</strong> {selectedPackage.shipToAddress.name}<br />
                        <strong>Address1:</strong> {selectedPackage.shipFromAddress.addressLine1}<br />
                        <strong>Address2:</strong> {selectedPackage.shipFromAddress.addressLine2}<br />
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
                </DialogContent>
            )}
            <DialogActions>
                <Button onClick={handleGetData} color="primary">Get Rate</Button>
                <Button onClick={handleClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PackageDialog;
