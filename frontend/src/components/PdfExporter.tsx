import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PackageType, GetPackagesReq } from '@ddlabel/shared';
import { MessageContent } from '../types';
import { Backdrop, CircularProgress, Dialog, Typography } from '@mui/material';
import MessageAlert from './MessageAlert';
import PackageLabel from './PackageLabel';
import { backDropStyle, FlexBox, StyledBox } from '../util/styled';
import ExportPdfSideBar from './ExportPdfSideBar';

const PdfExporter: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [message, setMessage] = useState<MessageContent>(null);
  const [loading, setLoading] = useState(false);

  // Create refs for each page
  const pagesRef = useRef<(HTMLDivElement | null)[]>([]);

  const capturePages = () => {
    const pages = pagesRef.current;
    const pdf = new jsPDF('p', 'in', [4, 6]); // Set size to 4in x 6in

    // Create an array of promises for rendering each page
    const renderPromises = pages.map((page, idx) => {
      if (!page) return Promise.resolve(); // Skip if the page is not rendered yet
      return html2canvas(page).then((canvas) => {
        setLoading(true);
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 4; // 4 inches
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        if (idx !== 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      });
    });

    // Wait for all renderings to finish
    Promise.all(renderPromises).then(() => {
      pdf.save('combined.pdf');
    });
    setLoading(false);
  };

  const getLabels = () =>
    packages.map((pkg, idx) =>
      <div key={pkg.id} style={{ width: '4in' }} ref={(el) => (pagesRef.current[idx] = el)}>
        <PackageLabel pkg={pkg} />
      </div>
    );

  return (
    <FlexBox component="main" maxWidth="lg">
      {loading && <Backdrop open={loading} sx={backDropStyle} ><CircularProgress /></Backdrop>}
      <ExportPdfSideBar capturePages={capturePages} setPackages={setPackages} setMessage={setMessage}/>
      <StyledBox>
        <Typography component="h1" variant="h4" align='center'>Export to PDF</Typography>
        <MessageAlert message={message} />
        <FlexBox component="main" maxWidth="lg" sx={{ mt: 3, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          {getLabels()}
        </FlexBox>
      </StyledBox>
    </FlexBox>
  );
};

export default PdfExporter;
