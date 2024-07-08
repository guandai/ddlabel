// frontend/src/utils/generatePDF.ts
import jsPDF from 'jspdf';
import { PackageType } from '../components/PackageForm';
import PackageLabel from '../components/PackageLabel';
import React from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';

export const generatePDF = async (pkg: PackageType) => {
  // Create a container for the label
  const labelContainer = document.createElement('div');
  labelContainer.style.width = '100mm'; // 4 inches in pixels (1 inch = 96 pixels)
  labelContainer.style.height = 'auto'; // 6 inches in pixels
  labelContainer.style.position = 'absolute';
  labelContainer.style.top = '-9999px'; // Move out of visible area
  labelContainer.style.left = '-9999px'; // Move out of visible area
  document.body.appendChild(labelContainer);

  // Create a root for React rendering
  const labelRoot = createRoot(labelContainer);
  labelRoot.render(<PackageLabel pkg={pkg} />);
  
  // Wait for the component to render
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Convert the label to a canvas
  const canvas = await html2canvas(labelContainer, { scale: 3 }); // Scale up to increase quality
  const imgData = canvas.toDataURL('image/png');
  
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [102, 152] // 4 inches x 6 inches
  });
  doc.addImage(imgData, 'PNG', 0, 0, 102, 152); // Add the image to the PDF
  
  // Clean up by removing the label container
  document.body.removeChild(labelContainer);
  
  // Save the PDF
  doc.save(`package_${pkg.id}_label.pdf`);
};
