// frontend/src/utils/generatePDF.ts
import jsPDF from 'jspdf';
import { PackageType } from '../components/PackageForm';
import PackageLabel from '../components/PackageLabel';
import React from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';

export const generatePDF = async (pkg: PackageType) => {
  const labelContainer = document.createElement('div');
  document.body.appendChild(labelContainer);
  const labelRoot = createRoot(labelContainer);
  labelRoot.render(<PackageLabel pkg={pkg} />);
  
  // Wait for the component to render
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const canvas = await html2canvas(labelContainer);
  const imgData = canvas.toDataURL('image/png');
  
  const doc = new jsPDF();
  doc.addImage(imgData, 'PNG', 120, 220, 50, 50);
  
  document.body.removeChild(labelContainer);
  doc.save(`package_${pkg.id}_label.pdf`);
};
