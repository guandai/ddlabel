import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Container, TablePagination, TextField } from '@mui/material';
import { tryLoad } from '../util/errors';
import MessageAlert from './MessageAlert';
import { MessageContent } from '../types';
import TransactionApi from '../api/TransectionApi';
import { TransactionType } from '@ddlabel/shared';

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [message, setMessage] = useState<MessageContent>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState(''); // Add search state
  const [totalPackages, setTotalPackages] = useState(0); // Track the total number of packages

  useEffect(() => {
    const fetchTransactions = async () => {
      tryLoad(setMessage, async () => {
        const params = { limit: rowsPerPage, offset: page * rowsPerPage, search };
        const response = await TransactionApi.getTransactions(params);
        setTransactions(response.transactions || []);
        setTotalPackages(response.total); // Set the total number of packages
      });
    };
    fetchTransactions();
  }, [page, rowsPerPage, search]);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '600px' }}>
          <Typography component="h1" variant="h5">Transactions</Typography>
          <TextField
            label="Search Transactions"
            value={search}
            onChange={handleSearchChange}
            variant="outlined"
          />
        </Box>
        <MessageAlert message={message} />
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date Added</TableCell>
                <TableCell>Event</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Tracking</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction: any) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.dateAdded).toLocaleString()}</TableCell>
                  <TableCell>{transaction.event}</TableCell>
                  <TableCell>{transaction.cost}</TableCell>
                  <TableCell>{transaction.tracking}</TableCell>
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
      </Box>
    </Container>
  );
};

export default TransactionTable;
