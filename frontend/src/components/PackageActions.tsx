import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { Visibility, Edit, Delete, PictureAsPdf, Label } from '@mui/icons-material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { BeansAI, PackageModel } from '@ddlabel/shared';
import { generatePDF } from './generatePDF';
import PackageDialog from './PackageDialog';
import StatusLogsDialog from './StatusLogsDialog';
import PackageApi from '../api/PackageApi';
import { useNavigate } from 'react-router-dom';
import BeansAiApi from '../external/beansApi';
import { SetMessage, tryLoad } from '../util/errors';

type PackageActionsProps = {
  pkg: PackageModel;
  setMessage: SetMessage;
};

const PackageActions: React.FC<PackageActionsProps> = ({ pkg, setMessage }) => {
  const [pkgOpen, setPkgOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [logs, setLogs] = useState<BeansAI.StatusLog[] | null>(null);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    setPkgOpen(true);
  };

  const handlePkgClose = () => {
    setPkgOpen(false);
  };

  const handleEdit = () => {
    navigate(`/packages/edit/${pkg.id}`);
  };

  const handleDelete = async () => {
    const deleteLoading = async () => {
      await PackageApi.deletePackage(String(pkg.id));
      setMessage({ text: 'Package deleted', level: 'success' });
    };
    tryLoad(setMessage, deleteLoading);
  };

  const handleViewLog = async () => {
    const log = await BeansAiApi.getStatusLog({ trackingNo: pkg.trackingNo });
    setLogs(log.listItemReadableStatusLogs);
    setLogOpen(true);
  };

  const handleLogClose = () => {
    setLogOpen(false);
    setLogs(null);
  };

  return (
    <>
      <IconButton onClick={handleViewDetails}><Visibility /></IconButton>
      <IconButton onClick={handleEdit}><Edit /></IconButton>
      <IconButton onClick={handleDelete}><Delete /></IconButton>
      <IconButton onClick={() => generatePDF(pkg)}><PictureAsPdf /></IconButton>
      <IconButton onClick={handleViewLog}><AssignmentTurnedInIcon /></IconButton>
      <IconButton component="a" href={`/packages/${pkg.id}/label`} target="_blank"><Label /></IconButton>
      
      {/* Package Dialog */}
      <PackageDialog open={pkgOpen} handleClose={handlePkgClose} pkg={pkg} />
      
      {/* Status Logs Dialog */}
      <StatusLogsDialog open={logOpen} handleClose={handleLogClose} logs={logs} />
    </>
  );
};

export default PackageActions;
