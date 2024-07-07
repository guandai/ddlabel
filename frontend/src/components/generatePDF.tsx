// frontend/src/utils/generatePDF.ts
import jsPDF from 'jspdf';
import { PackageType } from '../components/PackageForm';
import PackageLabel from '../components/PackageLabel';
import React from 'react';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';


export const generatePDF = async (pkg: PackageType) => {
  const labelContainer = document.createElement('div');
  labelContainer.style.width = '4in';
  labelContainer.style.height = '6in';
  labelContainer.style.position = 'absolute';
  labelContainer.style.top = '-9999px';
  labelContainer.style.left = '-9999px';
  document.body.appendChild(labelContainer);
  const labelRoot = createRoot(labelContainer);
  labelRoot.render(<PackageLabel pkg={pkg} />);
  
  // Wait for the component to render
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const canvas = await html2canvas(labelContainer);
  const imgData = canvas.toDataURL('image/png');
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [4, 6] // 4 inches x 6 inches
  });
  doc.addImage(imgData, 'PNG', 0, 0, 4, 6); // Full 4"x6" size
  
  document.body.removeChild(labelContainer);
  doc.save(`package_${pkg.id}_label.pdf`);
};



// export const generatePDF2 = async (pkg: PackageType) => {
//   const labelContainer = document.createElement('div');
//   labelContainer.style.width = '4in';
//   labelContainer.style.height = '6in';
//   labelContainer.style.position = 'absolute';
//   labelContainer.style.top = '-9999px';
//   labelContainer.style.left = '-9999px';
//   document.body.appendChild(labelContainer);
//   const labelRoot = createRoot(labelContainer);
//   labelRoot.render();
  
//   // Wait for the component to render
//   await new Promise(resolve => setTimeout(resolve, 1000));
  
//   const canvas = await html2canvas(labelContainer);
//   const imgData = canvas.toDataURL('image/png');
  
//   const doc = new jsPDF({
//   orientation: 'portrait',
//   unit: 'in',
//   format: [4, 6] // 4 inches x 6 inches
//   });
//   doc.addImage(imgData, 'PNG', 0, 0, 4, 6); // Full 4”x6” size
  
//   document.body.removeChild(labelContainer);
//   doc.save(`package_${pkg.id}_label.pdf`);
//   };
