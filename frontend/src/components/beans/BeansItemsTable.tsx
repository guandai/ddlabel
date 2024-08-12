// frontend/src/components/beans/BeansItemsTable.tsx
import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FlexBox, StyledBox, StyledTabelCell } from '../../util/styled';
import { MessageContent } from '../../types';
import BeansTableSideBar from './BeansTableSideBar';
import MessageAlert from '../share/MessageAlert';
import BeansApi from '../../external/beansApi';
import { toDateTime } from '../../util/time';
import ModelActions from '../share/ModelActions';
import { tryLoad } from '../../util/errors';
import { BeansAI, Models } from '@ddlabel/shared';

const BeansItems: React.FC = () => {
  const [records, setBeansRecords] = useState<BeansAI.Item[]>([]);
  const [message, setMessage] = useState<MessageContent>(null);

  useEffect(() => {
    const callback = async () => {
      const records = (await BeansApi.getItems()).item;
      setBeansRecords(records);
    };
	tryLoad(setMessage, callback);
  }, [records]);
  
  return (
    <FlexBox component="main" maxWidth="lg">
      <BeansTableSideBar/>
    
      <StyledBox>
        <Typography component="h1" variant="h4">Beans Items</Typography>
        <MessageAlert message={message} />
        
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tracking No</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Item Type</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={`item_${record.listItemId}`}>
                  <TableCell>{record.trackingId}</TableCell>
                  <TableCell>{record.address}</TableCell>
                  <TableCell>{record.status}</TableCell>
                  <TableCell>{record.type}</TableCell>
                  <TableCell>{toDateTime(record?.updatedAt || '')}</TableCell>
                  <StyledTabelCell style={{ width: '200px', whiteSpace: 'nowrap' }}>
                    <ModelActions model={record as any as Models} setMessage={setMessage} modelName='items' actions={['view']}/>
                  </StyledTabelCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledBox>
    </FlexBox>
  );
};

export default BeansItems;
