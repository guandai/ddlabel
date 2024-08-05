import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { AutoAwesomeMotion } from '@mui/icons-material';
import { BeansAI, Models } from '@ddlabel/shared';
import StatusLogsDialog from '../dialog/StatusLogsDialog';
import PackageApi from '../../api/PackageApi';
import { useNavigate } from 'react-router-dom';
import { SetMessage } from '../../util/errors';
import ModelActions from '../share/ModelActions';

type BeansRoutesActionsProps = {
  model: Models;
  listRouteId: string;
  setMessage: SetMessage;
};

const BeansRoutesActions: React.FC<BeansRoutesActionsProps> = ({ model, listRouteId, setMessage }) => {
  const [logOpen, setLogOpen] = useState(false);
  const [logs, setLogs] = useState<BeansAI.StatusLog[] | null>(null);
  const navigate = useNavigate();

  const handleRouteItems = () => {
    navigate(`/beans/routes/${listRouteId}/items`);
  };
  const handleLogClose = () => {
    setLogOpen(false);
    setLogs(null);
  };

  return (
    <>
      <ModelActions model={model} modelName="routes" setMessage={setMessage} deleteAction={PackageApi.deletePackage} actions={['view']}>
	  		<Tooltip title="Route Stops"><IconButton onClick={handleRouteItems}><AutoAwesomeMotion /></IconButton></Tooltip>
      </ModelActions>
      <StatusLogsDialog open={logOpen} handleClose={handleLogClose} logs={logs} />
    </>
  );
};

export default BeansRoutesActions;
