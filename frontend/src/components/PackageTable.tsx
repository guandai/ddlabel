import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Typography, Box, Container, Button,
  TablePagination, TextField
} from '@mui/material';
import { Visibility, Edit, Delete, PictureAsPdf, Label, AddCircle } from '@mui/icons-material';
import { PackageType } from '@ddlabel/shared';
import { tryLoad } from '../util/errors';
import { generatePDF } from './generatePDF';
import PackageDialog from './PackageDialog';
import { useNavigate } from 'react-router-dom';
import PackageUploadMapping from './PackageUploadMapping';
import { MessageContent } from '../types';
import MessageAlert from './MessageAlert';
import PackageApi from '../api/PackageApi';
import { GetPackagesReq } from '@ddlabel/shared';

const PackageTable: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState(''); // Add search state
  const [totalPackages, setTotalPackages] = useState(0); // Track the total number of packages
  const [message, setMessage] = useState<MessageContent>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    tryLoad(setMessage, async () => {
      const params: GetPackagesReq = { limit: rowsPerPage, offset: page * rowsPerPage, search };
      const response = await PackageApi.getPackages(params);
      setPackages(response.packages);
      setTotalPackages(response.total); // Set the total number of packages
    });
    
  }, [page, rowsPerPage, search]);

  const handleDelete = async (id: number) => {
    tryLoad(setMessage, async () => {
      id && await PackageApi.deletePackage(String(id));
      setPackages(packages.filter(pkg => pkg.id !== id));
      setMessage({ text: 'Package deleted successfully', level: 'success' });
    });
  };

  const handleEdit = (pkg: PackageType) => {
    navigate(`/packages/edit/${pkg.id}`);
  };

  const handleViewDetails = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPackage(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '600px' }}>
          <Typography component="h1" variant="h5">Packages</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/packages/create')} startIcon={<AddCircle />} >
            Add
          </Button>
          <PackageUploadMapping />
          <TextField
            label="Search by Tracking"
            value={search}
            onChange={handleSearchChange}
            variant="outlined"
          />
        </Box>

        <MessageAlert message={message} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ship To Address</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Weight</TableCell>
                <TableCell>Tracking</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packages.map(pkg => (
                <TableRow key={pkg.id}>
                  <TableCell>{pkg.toAddress.address1}</TableCell>
                  <TableCell>{pkg.toAddress.state}</TableCell>
                  <TableCell>{pkg.weight}</TableCell>
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
          <TablePagination
            rowsPerPageOptions={[5, 25, 50, 100]}
            component="div"
            count={totalPackages} // Total number of packages
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            showFirstButton // Show the first page button
            showLastButton // Show the last page button
          />
        </TableContainer>
        <PackageDialog open={open} handleClose={handleClose} selectedPackage={selectedPackage} />
      </Box>
    </Container>
  );
};

export default PackageTable;
