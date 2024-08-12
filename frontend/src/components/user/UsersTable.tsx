// frontend/src/components/Users.tsx
import React, { useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FlexBox, StyledBox } from '../../util/styled';
import { MessageContent } from '../../types';
import { UserModel } from '@ddlabel/shared';
import UserTableSideBar from './UserTableSideBar';
import MessageAlert from '../share/MessageAlert';
import RecordsQuery from '../query/RecordsQuery';
import UserApi from '../../api/UserApi';
import { convertToTimeString } from '../../util/time';


const Users: React.FC = () => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [message, setMessage] = useState<MessageContent>(null);

  return (
    <FlexBox component="main" maxWidth="lg" >
      <UserTableSideBar setUsers={setUsers} setMessage={setMessage} />
    
      <StyledBox>
        <Typography component="h1" variant="h4">Users</Typography>
        <MessageAlert message={message} />
        <RecordsQuery getRecords={UserApi.getUsers} setRecords={setUsers} setMessage={setMessage} />
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: UserModel) => (
                <TableRow key={`user_${user.id}`}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.warehouseAddress.address1}</TableCell>
                  <TableCell>{convertToTimeString(user.createdAt || '')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledBox>
    </FlexBox>
  );
};

export default Users;
