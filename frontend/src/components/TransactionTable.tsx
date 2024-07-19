import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Alert, Container } from '@mui/material';
import { tryLoad } from '../util/errors';

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      tryLoad(setError, async () => {
        const response = await axios.get(`${process.env.REACT_APP_BE_URL}/transactions`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(response.data);
      });
    };
    fetchTransactions();
  }, []);

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
        <Typography component="h1" variant="h5">
          Transactions
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
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
        </TableContainer>
      </Box>
    </Container>
  );
};

export default TransactionTable;
