import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { PictureAsPdf, Label } from '@mui/icons-material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { BeansAI, PackageModel } from '@ddlabel/shared';
import { generatePDF } from '../label/generatePDF';
import StatusLogsDialog from '../dialog/StatusLogsDialog';
import PackageApi from '../../api/PackageApi';
import { useNavigate } from 'react-router-dom';
import BeansAiApi from '../../external/beansApi';
import { SetMessage } from '../../util/errors';
import ModelActions from '../share/ModelActions';

type PackageActionsProps = {
  pkg: PackageModel;
  setMessage: SetMessage;
};

const PackageActions: React.FC<PackageActionsProps> = ({ pkg, setMessage }) => {
  const [logOpen, setLogOpen] = useState(false);
  const [logs, setLogs] = useState<BeansAI.StatusLog[] | null>(null);
  const navigate = useNavigate();

  const handleViewLog = async () => {
    const log = await BeansAiApi.getStatusLog({ trackingNo: pkg.trackingNo });
    setLogs(log.listItemReadableStatusLogs);
    setLogOpen(true);
  };

  const handelLabel = () => {
    navigate(`/packages/${pkg.id}/label`);
  }

  const handleLogClose = () => {
    setLogOpen(false);
    setLogs(null);
  };

  return (
    <>
      <ModelActions model={pkg} modelName="packages" setMessage={setMessage} deleteAction={PackageApi.deletePackage} >
        <Tooltip title="View Label">
          <IconButton onClick={handelLabel}><Label /></IconButton>
        </Tooltip>
        <Tooltip title="View PDF">
          <IconButton onClick={() => generatePDF(pkg)}><PictureAsPdf /></IconButton>
        </Tooltip>
        <Tooltip title="View Log">
          <IconButton onClick={handleViewLog}><AssignmentTurnedInIcon /></IconButton>
        </Tooltip>
      </ModelActions>
      <StatusLogsDialog open={logOpen} handleClose={handleLogClose} logs={logs} />
    </>
  );
};
export default PackageActions;
