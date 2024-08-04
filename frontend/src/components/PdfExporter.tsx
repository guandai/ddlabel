import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PackageType, GetPackagesReq } from '@ddlabel/shared';
import PackageApi from '../api/PackageApi';
import { MessageContent } from '../types';
import { tryLoad } from '../util/errors';
import { Button, Container, Typography } from '@mui/material';
import MessageAlert from './MessageAlert';
import PackageLabel from './PackageLabel';
import { DownloadForOfflineRounded } from '@mui/icons-material';
import { FlexBox, StyledBox } from '../util/styled';

const PdfExporter: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [totalPackages, setTotalPackages] = useState(0);
  const [message, setMessage] = useState<MessageContent>(null);

  useEffect(() => {
    const getPackages = async () => {
      const params: GetPackagesReq = { limit: rowsPerPage, offset: page * rowsPerPage, search };
      const packagesRes = await PackageApi.getPackages(params);
      setPackages(packagesRes.packages);
      setTotalPackages(packagesRes.total);
    }
    tryLoad(setMessage, getPackages);
  }, [page, rowsPerPage, search]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Create refs for each page
  const pagesRef = useRef<(HTMLDivElement | null)[]>([]);

  const capturePages = () => {
    const pages = pagesRef.current;
    const pdf = new jsPDF('p', 'in', [4, 6]); // Set size to 4in x 6in
  
    // Create an array of promises for rendering each page
    const renderPromises = pages.map((page, idx) => {
      if (!page) return Promise.resolve(); // Skip if the page is not rendered yet
      return html2canvas(page).then((canvas) => {
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
  };
  const getLabels = () =>
    packages.map((pkg, idx) => 
      <div style={ {width: '4in' }} ref={(el) => (pagesRef.current[idx] = el)}>
          <PackageLabel pkg={pkg} />
      </div> )
    
  return (
    <Container component="main" maxWidth="lg">
      <StyledBox >
        <Typography align="center" variant="h4">Export to PDF</Typography>
        <Button sx={{my: 2}} variant="contained" onClick={capturePages}><DownloadForOfflineRounded />Export to PDF</Button>
      </StyledBox>
      
      <MessageAlert message={message} />
      <FlexBox component="main" maxWidth="lg" sx={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {getLabels()}
      </FlexBox>
    </Container>
  );
};

export default PdfExporter;
