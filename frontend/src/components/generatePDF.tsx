// frontend/src/utils/generatePDF.ts
import jsPDF from 'jspdf';
import { PackageType } from '../components/PackageForm';
import QRCodeComponent from '../components/QRCodeComponent';
import BarcodeComponent from '../components/BarcodeComponent';
import React from 'react';
import { createRoot } from 'react-dom/client';

export const generatePDF = async (pkg: PackageType) => {
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

  // Render and capture barcode
  const barcodeContainer = document.createElement('div');
  document.body.appendChild(barcodeContainer);
  const barcodeRoot = createRoot(barcodeContainer);
  barcodeRoot.render(<BarcodeComponent value={pkg.trackingNumber} />);
  
  const barcodeCanvas = barcodeContainer.querySelector('canvas');
  if (barcodeCanvas) {
    const barcodeImgData = barcodeCanvas.toDataURL('image/png');
    doc.addImage(barcodeImgData, 'PNG', 10, 170, 100, 30);  // Adjust position and size as needed
  }
  document.body.removeChild(barcodeContainer);

  doc.text(`Tracking Number: ${pkg.trackingNumber}`, 10, 210);  // Adjust position as needed

  // Render and capture QR code
  const qrCodeContainer = document.createElement('div');
  document.body.appendChild(qrCodeContainer);
  const qrCodeRoot = createRoot(qrCodeContainer);
  qrCodeRoot.render(<QRCodeComponent value={`http://localhost:3000/packages/${pkg.id}`} />);
  
  const qrCodeCanvas = qrCodeContainer.querySelector('canvas');
  if (qrCodeCanvas) {
    const qrCodeImgData = qrCodeCanvas.toDataURL('image/png');
    doc.addImage(qrCodeImgData, 'PNG', 120, 220, 50, 50);  // Adjust position and size as needed
  }
  document.body.removeChild(qrCodeContainer);

  doc.save(`package_${pkg.id}_label.pdf`);
};
