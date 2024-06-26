// frontend/src/utils/generatePDF.ts
import jsPDF from 'jspdf';
import { PackageModel } from '@ddlabel/shared';
import PackageLabel from './PackageLabel';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';

const pdfWidth = 4;
const pdfHeight = 6;

export const getLabelContainer = (pkg: PackageModel) => {
  const PPI = 300; // Desired PPI for the PDF
  const mmToInch = 26.6; // Conversion factor from mm to inches
  const widthInMM = pdfWidth * mmToInch; // Width of the label in mm
  const heightInMM = pdfHeight * mmToInch; // Height of the label in mm

  // Calculate the scale factor
  const scaleFactor = PPI / 96; // 96 is the default screen PPI

  // Create a container for the label
  const labelContainer = document.createElement('div');
  labelContainer.style.width = `${widthInMM}mm`;
  labelContainer.style.height = `${heightInMM}mm`;
  labelContainer.style.position = 'absolute';
  labelContainer.style.top = '-9999px'; // Move out of visible area
  labelContainer.style.left = '-9999px'; // Move out of visible area
  document.body.appendChild(labelContainer);

  // Create a root for React rendering
  const labelRoot = createRoot(labelContainer);
  labelRoot.render(<PackageLabel pkg={pkg} />);
  return { labelRoot, labelContainer, scaleFactor };
};

export const generatePDF = async (pkg: PackageModel) => {
  const { labelContainer, scaleFactor } = getLabelContainer(pkg);
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Convert the label to a canvas
  const canvas = await html2canvas(labelContainer, { scale: scaleFactor });
  const imgData = canvas.toDataURL('image/png');

  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [pdfWidth, pdfHeight]
  });
  doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight); // Add the image to the PDF

  // Clean up by removing the label container
  document.body.removeChild(labelContainer);

  // Save the PDF
  doc.save(`package_${pkg.id}_label.pdf`);
};
