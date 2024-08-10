import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableContainer, TableHead, TableRow,
  Paper, IconButton, Typography
} from '@mui/material';
import { Visibility, Edit, Delete, PictureAsPdf, Label } from '@mui/icons-material';
import { BeansAI, BeansStatus, PackageModel } from '@ddlabel/shared';
import { tryLoad } from '../util/errors';

import { generatePDF } from './generatePDF';
import PackageDialog from './PackageDialog';
import { useNavigate } from 'react-router-dom';
import { MessageContent } from '../types';
import MessageAlert from './MessageAlert';
import PackageApi from '../api/PackageApi';
import BeansStatusLogApi from '../external/beansApi';
import { convertToTimeString } from '../util/time';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PackageTableSideBar from './PackageTableSideBar';
import { FlexBox, StatusLabel, StyledBox, StyledTabelCell } from '../util/styled';
import RecordsQuery, { FilterConfig } from './RecordsQuery';

const PackageTable: React.FC = () => {
  const [packages, setPackages] = useState<PackageModel[]>([]);
  const [message, setMessage] = useState<MessageContent>(null);
  const [statusLogs, setStatusLogs] = useState<BeansAI.ListItemReadableStatusLogs[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageModel | null>(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<FilterConfig>({ startDate: null, endDate: null, tracking: '', address: '' });
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
    return (statusLogs?.[idx]?.[0]?.item.status || 'N/A' ) as BeansStatus;
  };

  // const tsMillis = (idx: number) => {
  //   return statusLogs?.[idx]?.[0]?.tsMillis || 0;
  // };
  
  return (
    <FlexBox component="main" maxWidth="lg" >
        <PackageTableSideBar setMessage={setMessage} filter={filter} />
        <StyledBox>
            <Typography component="h1" variant="h4" align='center'>Packages</Typography>
            <MessageAlert message={message} />
            <RecordsQuery getRecords={PackageApi.getPackages} setRecords={setPackages} setMessage={setMessage} perPageList={[5,10,20]} setFilter={setFilter} />
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTabelCell>Ship To Address</StyledTabelCell>
                    <StyledTabelCell>Created Time</StyledTabelCell>
                    <StyledTabelCell>Status</StyledTabelCell>
                    <StyledTabelCell>Tracking</StyledTabelCell>
                    <StyledTabelCell>Actions</StyledTabelCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {packages.map((pkg, idx) => (
                    <TableRow key={pkg.id}>
                      <StyledTabelCell sx={{margin: '0px'}} >{pkg.toAddress.address1}</StyledTabelCell>
                      <StyledTabelCell>{convertToTimeString((pkg as any).createdAt) }</StyledTabelCell>
                      <StyledTabelCell>
                          <StatusLabel status={toStatus(idx)}>{toStatus(idx)}</StatusLabel>
                      </StyledTabelCell>
                      <StyledTabelCell>{pkg.trackingNo}</StyledTabelCell>
                      <StyledTabelCell style={{ width: '200px', whiteSpace: 'nowrap' }}>
                        <IconButton onClick={() => handleViewDetails(pkg)}><Visibility /></IconButton>
                        <IconButton onClick={() => handleEdit(pkg)}><Edit /></IconButton>
                        <IconButton onClick={() => handleDelete(pkg.id || 0)}><Delete /></IconButton>
                        <IconButton onClick={() => generatePDF(pkg)}><PictureAsPdf /></IconButton>
                        <IconButton onClick={() => generatePDF(pkg)}><AssignmentTurnedInIcon /></IconButton>
                        <IconButton component="a" href={`/packages/${pkg.id}/label`} target="_blank"><Label /></IconButton>
                      </StyledTabelCell>
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
