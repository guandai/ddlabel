import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import { Models } from '@ddlabel/shared';
import { useNavigate } from 'react-router-dom';
import { SetMessage, tryLoad } from '../../util/errors';
import ModelDialog from '../dialog/ModelDialog';
import { ModelActionOptions } from '../../types';

type ModelActionsProps = {
  modelName: string;
  model: Models;
  setMessage: SetMessage;
  deleteAction?: (id: number) => Promise<void>;
  children?: React.ReactNode;
  actions?: ModelActionOptions[];
};

const ModelActions: React.FC<ModelActionsProps> = ({ model, setMessage, modelName, deleteAction, children, actions = ['delete', 'view', 'edit'] }) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
  };

  const handleEdit = () => {
    if (!model.id) return;
    navigate(`/${modelName}/edit/${model.id}`);
  };

  const handleDelete = async () => {
    if (!deleteAction) return;
    const callback = async () => {
      await deleteAction(model.id);
      setMessage({ text: 'User is deleted', level: 'success' });
    };
    tryLoad(setMessage, callback);
  };

  return (
    <>
      {actions.includes('view') && <IconButton onClick={handleViewDetails}><Visibility /></IconButton>}
      {actions.includes('edit') && <IconButton onClick={handleEdit}><Edit /></IconButton>}
      {actions.includes('delete') && <IconButton onClick={handleDelete}><Delete /></IconButton>}
      {children}
      <ModelDialog open={detailOpen} handleClose={handleDetailClose} model={model} modelName={modelName} />
    </>
  );
};

export default ModelActions;
