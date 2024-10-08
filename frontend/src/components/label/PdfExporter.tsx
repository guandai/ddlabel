import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PackageModel } from '@ddlabel/shared';
import { MessageContent } from '../../types';
import { Backdrop, CircularProgress, Typography } from '@mui/material';
import MessageAlert from '../share/MessageAlert';
import PackageLabel from './PackageLabel';
import { backDropStyle, FlexBox, StyledBox } from '../../util/styled';
import ExportPdfSideBar from './ExportPdfSideBar';
import RecordsQuery from '../query/RecordsQuery';
import PackageApi from '../../api/PackageApi';

const PdfExporter: React.FC = () => {
  const [packages, setPackages] = useState<PackageModel[]>([]);
  const [message, setMessage] = useState<MessageContent>(null);
  const [loading, setLoading] = useState(false);

  // Create refs for each page
  const pagesRef = useRef<(HTMLDivElement | null)[]>([]);

  const preparePromises = async (pdf: jsPDF, pages: (HTMLDivElement | null)[]) =>
    pages.map(async (page, idx) => {
      if (!page) return Promise.resolve();
      const canvas = await html2canvas(page)  
      const imgData = canvas.toDataURL('image/jpeg', 0.7);
      const imgWidth = 4;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      if (idx !== 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
    });

  const capturePages = async () => {
    setLoading(true);
    const pages = pagesRef.current;
    const pdf = new jsPDF('p', 'in', [4, 6]);

    setTimeout(async () => {
      await Promise.all(await preparePromises(pdf, pages)).then(() => {
        pdf.save('combined.pdf');
        setLoading(false);
      });
    }, 100);
  };

  const getLabels = (factor = 1) =>
    packages.map((pkg, idx) =>
      <div key={pkg.id}
        ref={(el) => true && (pagesRef.current[idx] = el)
        }
      >
        <PackageLabel pkg={pkg} factor={factor} />
      </div>
    );

  return (
    <FlexBox component="main" maxWidth="lg">
      <Backdrop open={loading} sx={backDropStyle} ><CircularProgress /></Backdrop>
      <ExportPdfSideBar capturePages={capturePages} />
      <StyledBox sx={{ overflowY: 'clip' }}>
        <Typography component="h1" variant="h4" align='center'>Export to PDF</Typography>
        <MessageAlert message={message} />
        <RecordsQuery getRecords={PackageApi.getPackages} setRecords={setPackages} setMessage={setMessage} />
        <FlexBox component="main" maxWidth="lg" sx={{ mt: 3, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
          {getLabels(0.7)}
        </FlexBox>
      </StyledBox>
    </FlexBox>
  );
};

export default PdfExporter;
