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
import BeansAiApi from '../external/beansApi';
import { convertToTimeString } from '../util/time';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PackageTableSideBar from './PackageTableSideBar';
import { FlexBox, StatusLabel, StyledBox, StyledTabelCell } from '../util/styled';
import RecordsQuery, { FilterConfig } from './RecordsQuery';
import StatusLogsDialog from './StatusLogsDialog';

type StatusLogsMaps = { [x: number]: BeansAI.ListItemReadableStatusLogs }
const PackageTable: React.FC = () => {
  const [packages, setPackages] = useState<PackageModel[]>([]);
  const [message, setMessage] = useState<MessageContent>(null);
  const [statusLogs, setStatusLogs] = useState<StatusLogsMaps>([]);
  const [pkg, setPkg] = useState<PackageModel | null>(null);
  const [logs, setLogs] = useState<BeansAI.StatusLog[] | null>(null);
  const [pkgOpen, setPkgOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [filter, setFilter] = useState<FilterConfig>({ startDate: null, endDate: null, tracking: '', address: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const loadPackageAndBeanLog = async () => {
      const statusLogsMap: StatusLogsMaps = {};
      for (const pkg of packages) {
        const log = (await BeansAiApi.getStatusLog({ trackingNo: pkg.trackingNo })).listItemReadableStatusLogs;
        statusLogsMap[pkg.id] = log;
      }
      setStatusLogs(statusLogsMap);
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
    setPkg(pkg);
    setPkgOpen(true);
  };

  const handlePkgClose = () => {
    setPkgOpen(false);
    setPkg(null);
  };

  const handleViewlog = (pkgId: number) => {
    setLogs(statusLogs[pkgId]);
    setLogOpen(true);
  };

  const handleLogClose = () => {
    setLogOpen(false);
    setLogs(null);
  };

  const toStatus = (pkgId: number) => {
    return (statusLogs?.[pkgId]?.[0]?.item.status || 'N/A') as BeansStatus;
  };

  // const tsMillis = (pkgId: number) => {
  //   return statusLogs?.[pkgId]?.[0]?.tsMillis || 0;
  // };

  return (
    <FlexBox component="main" maxWidth="lg" >
      <PackageTableSideBar setMessage={setMessage} filter={filter} />
      <StyledBox>
        <Typography component="h1" variant="h4" align='center'>Packages</Typography>
        <MessageAlert message={message} />
        <RecordsQuery getRecords={PackageApi.getPackages} setRecords={setPackages} setMessage={setMessage} perPageList={[5, 10, 20]} setFilter={setFilter} />
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
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <StyledTabelCell sx={{ margin: '0px' }} >{pkg.toAddress.address1}</StyledTabelCell>
                  <StyledTabelCell>{convertToTimeString((pkg as any).createdAt)}</StyledTabelCell>
                  <StyledTabelCell>
                    <StatusLabel status={toStatus(pkg.id)}>{toStatus(pkg.id)}</StatusLabel>
                  </StyledTabelCell>
                  <StyledTabelCell>{pkg.trackingNo}</StyledTabelCell>
                  <StyledTabelCell style={{ width: '200px', whiteSpace: 'nowrap' }}>
                    <IconButton onClick={() => handleViewDetails(pkg)}><Visibility /></IconButton>
                    <IconButton onClick={() => handleEdit(pkg)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(pkg.id || 0)}><Delete /></IconButton>
                    <IconButton onClick={() => generatePDF(pkg)}><PictureAsPdf /></IconButton>
                    <IconButton onClick={() => handleViewlog(pkg.id)}><AssignmentTurnedInIcon /></IconButton>
                    <IconButton component="a" href={`/packages/${pkg.id}/label`} target="_blank"><Label /></IconButton>
                  </StyledTabelCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <PackageDialog open={pkgOpen} handleClose={handlePkgClose} pkg={pkg} />
        <StatusLogsDialog open={logOpen} handleClose={handleLogClose} logs={logs} />
      </StyledBox>
    </FlexBox>
  );
};

export default PackageTable;
