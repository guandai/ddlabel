import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import MessageAlert from './MessageAlert';
import { MessageContent } from '../types';
import TransactionApi from '../api/TransectionApi';
import { TransactionModel } from '@ddlabel/shared';
import { FlexBox, StyledBox } from '../util/styled';
import TransactionTableSideBar from './TransactionTableSideBar';
import RecordsQuery from './RecordsQuery';

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  const [message, setMessage] = useState<MessageContent>(null);

  return (
    <FlexBox component="main" maxWidth="lg" >
      <TransactionTableSideBar setTransactions={setTransactions} setMessage={setMessage} />
      <StyledBox>
        <Typography component="h1" variant="h4">Transactions</Typography>
        <MessageAlert message={message} />
        <RecordsQuery getRecords={TransactionApi.getTransactions} setRecords={setTransactions} setMessage={setMessage} />
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
      </StyledBox>
    </FlexBox>
  );
};

export default TransactionTable;
