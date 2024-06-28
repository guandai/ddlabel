import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { PackageType } from './PackageForm';
import { tryLoad } from '../util/errors';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode.react';
import JsBarcode from 'jsbarcode';

const PackageTable: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/packages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPackages(response.data);
      } catch (error) {
        setError('Failed to fetch packages.');
      }
    };
    fetchPackages();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    tryLoad(async () => {
      await axios.delete(`${process.env.REACT_APP_API_URL}/packages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPackages(packages.filter(pkg => pkg.id !== id));
      setSuccess('Package deleted successfully.');
    }, setError);
  };

  const handleEdit = async (id: number) => {
    // Handle edit logic here (e.g., open a modal with the edit form)
  };

  const handleViewDetails = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPackage(null);
  };

  const generatePDF = async (pkg: PackageType) => {
    const doc = new jsPDF();
    
    doc.setFontSize(12);
    doc.text('Sender Information', 10, 10);
    doc.text(`Sender Address: ${pkg.shipFromAddress}`, 10, 30);
    
    doc.text('Recipient Information', 10, 70);
    doc.text(`Recipient Name: ${pkg.name}`, 10, 80);
    doc.text(`Recipient Address: ${pkg.shipToAddress}`, 10, 90);
    doc.text(`Contact Number: ${pkg.phone}`, 10, 120);
    
    doc.text('Package Information', 10, 130);
    doc.text(`Tracking Number: ${pkg.trackingNumber}`, 10, 140);
    doc.text(`Weight: ${pkg.weight}`, 10, 150);
    doc.text(`Dimensions: ${pkg.length}x${pkg.width}x${pkg.height}`, 10, 160);

    // Barcode
    const barcodeCanvas = document.createElement('canvas');
    JsBarcode(barcodeCanvas, pkg.trackingNumber, { format: "CODE128" });
    const barcodeImgData = barcodeCanvas.toDataURL('image/png');
    doc.addImage(barcodeImgData, 'PNG', 10, 220, 100, 30);
    
    // QR Code
    const qrCodeCanvas = document.createElement('canvas');
    const qrCode = <QRCode value={`http://localhost:3000/packages/${pkg.id}`} size={100} level="H" includeMargin />;
    const qrCodeContext = qrCodeCanvas.getContext('2d');
    await html2canvas(qrCode).then((canvas) => {
      qrCodeContext?.drawImage(canvas, 0, 0);
    });
    const qrCodeImgData = qrCodeCanvas.toDataURL('image/png');
    doc.addImage(qrCodeImgData, 'PNG', 120, 220, 50, 50);

  

    doc.save(`package_${pkg.id}_label.pdf`);
  };

  return (
    <>
      <TableContainer component={Paper}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ship To Address</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Length</TableCell>
              <TableCell>Width</TableCell>
              <TableCell>Height</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Post Code</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {packages.map(pkg => (
              <TableRow key={pkg.id}>
                <TableCell>{pkg.shipToAddress}</TableCell>
                <TableCell>{pkg.phone}</TableCell>
                <TableCell>{pkg.length}</TableCell>
                <TableCell>{pkg.width}</TableCell>
                <TableCell>{pkg.height}</TableCell>
                <TableCell>{pkg.weight}</TableCell>
                <TableCell>{pkg.postCode}</TableCell>
                <TableCell>{pkg.email}</TableCell>
                <TableCell>{pkg.state}</TableCell>
                <TableCell>{pkg.name}</TableCell>
                <TableCell>
                  <Button onClick={() => handleViewDetails(pkg)}>View</Button>
                  <Button onClick={() => handleEdit(pkg.id)}>Edit</Button>
                  <Button onClick={() => handleDelete(pkg.id)}>Delete</Button>
                  <Button onClick={() => generatePDF(pkg)}>Generate PDF</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={open} onClose={handleClose} aria-labelledby="package-details-title">
        <DialogTitle id="package-details-title">Package Details</DialogTitle>
        {selectedPackage && (
          <DialogContent>
            <DialogContentText>
              <strong>Ship To Address:</strong> {selectedPackage.shipToAddress}<br />
              <strong>Phone:</strong> {selectedPackage.phone}<br />
              <strong>Length:</strong> {selectedPackage.length}<br />
              <strong>Width:</strong> {selectedPackage.width}<br />
              <strong>Height:</strong> {selectedPackage.height}<br />
              <strong>Weight:</strong> {selectedPackage.weight}<br />
              <strong>Post Code:</strong> {selectedPackage.postCode}<br />
              <strong>Email:</strong> {selectedPackage.email}<br />
              <strong>State:</strong> {selectedPackage.state}<br />
              <strong>Name:</strong> {selectedPackage.name}<br />
              <strong>Tracking Number:</strong> {selectedPackage.trackingNumber}
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

export default PackageTable;
