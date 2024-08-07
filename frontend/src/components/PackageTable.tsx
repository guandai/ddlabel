import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Typography
} from '@mui/material';
import { Visibility, Edit, Delete, PictureAsPdf, Label } from '@mui/icons-material';
import { BeansAI, PackageModel } from '@ddlabel/shared';
import { tryLoad } from '../util/errors';

import { generatePDF } from './generatePDF';
import PackageDialog from './PackageDialog';
import { useNavigate } from 'react-router-dom';
import { MessageContent } from '../types';
import MessageAlert from './MessageAlert';
import PackageApi from '../api/PackageApi';
import BeansStatusLogApi from '../external/beansApi';
import { toUpdateTime } from '../util/time';
import PackageTableSideBar from './PackageTableSideBar';
import { FlexBox, StyledBox } from '../util/styled';
import TablePaginationCommon from './TablePaginationCommon';

const PackageTable: React.FC = () => {
  const [packages, setPackages] = useState<PackageModel[]>([]);
  const [message, setMessage] = useState<MessageContent>(null);
  const [statusLogs, setStatusLogs] = useState<BeansAI.ListItemReadableStatusLogs[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageModel | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadPackageAndBeanLog = async () => {
      const packagesLogs = await Promise.all(packages.map(
        async pkg => (await BeansStatusLogApi.getStatusLog({ trackingNo: pkg.trackingNo })).listItemReadableStatusLogs
      ));
      setStatusLogs(packagesLogs);
    };
    
    tryLoad(setMessage, loadPackageAndBeanLog);
  }, [packages]);

  const handleDelete = async (id: number) => {
    const deleteLoading = async () => {
      id && await PackageApi.deletePackage(String(id));
      setPackages(packages.filter(pkg => pkg.id !== id));
      setMessage({ text: 'Package deleted successfully', level: 'success' });
    }
    tryLoad(setMessage, deleteLoading);
  };

  const handleEdit = (pkg: PackageModel) => {
    navigate(`/packages/edit/${pkg.id}`);
  };

  const handleViewDetails = (pkg: PackageModel) => {
    setSelectedPackage(pkg);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPackage(null);
  };

  const toStatus = (idx: number) => {
    return statusLogs?.[idx]?.[0]?.item.status || 'N/A';
  };

  const tsMillis = (idx: number) => {
    return statusLogs?.[idx]?.[0]?.tsMillis || 0;
  };
  
  return (
    <FlexBox component="main" maxWidth="lg" >
        <PackageTableSideBar setPackages={setPackages}  setMessage={setMessage} />
        <StyledBox>
            <Typography component="h1" variant="h4" align='center'>Packages</Typography>
            <MessageAlert message={message} />
            <TablePaginationCommon getRecords={PackageApi.getPackages} setRecords={setPackages} setMessage={setMessage} />
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ship To Address</TableCell>
                    <TableCell>Update Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Tracking</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {packages.map((pkg, idx) => (
                    <TableRow key={pkg.id}>
                      <TableCell>{pkg.toAddress.address1}</TableCell>
                      <TableCell>{toUpdateTime(tsMillis(idx))}</TableCell>
                      <TableCell>{toStatus(idx)}</TableCell>
                      <TableCell>{pkg.trackingNo}</TableCell>
                      <TableCell style={{ width: '200px', whiteSpace: 'nowrap' }}>
                        <IconButton onClick={() => handleViewDetails(pkg)}><Visibility /></IconButton>
                        <IconButton onClick={() => handleEdit(pkg)}><Edit /></IconButton>
                        <IconButton onClick={() => handleDelete(pkg.id || 0)}><Delete /></IconButton>
                        <IconButton onClick={() => generatePDF(pkg)}><PictureAsPdf /></IconButton>
                        <IconButton component="a" href={`/packages/${pkg.id}/label`} target="_blank"><Label /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          <PackageDialog open={open} handleClose={handleClose} selectedPackage={selectedPackage} />
        </StyledBox>
    </FlexBox>
  );
};

export default PackageTable;
