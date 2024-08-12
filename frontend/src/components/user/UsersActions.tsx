import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import { UserModel } from '@ddlabel/shared';
import PackageApi from '../../api/PackageApi';
import { useNavigate } from 'react-router-dom';
import { SetMessage, tryLoad } from '../../util/errors';
import ModelDialog from '../dialog/ModelDialog';

type ModelActionsProps = {
  modelName: string;
  model: UserModel;
  setMessage: SetMessage;
};

const ModelActions: React.FC<ModelActionsProps> = ({ model, setMessage, modelName }) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = () => {
    setDetailOpen(true);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
  };

  const handleEdit = () => {
    navigate(`/${modelName}/edit/${model.id}`);
  };

  const handleDelete = async () => {
    const deleteLoading = async () => {
      await PackageApi.deletePackage(String(model.id));
      setMessage({ text: 'User is deleted', level: 'success' });
    };
    tryLoad(setMessage, deleteLoading);
  };

  return (
    <>
      <IconButton onClick={handleViewDetails}><Visibility /></IconButton>
      <IconButton onClick={handleEdit}><Edit /></IconButton>
      <IconButton onClick={handleDelete}><Delete /></IconButton>
      <ModelDialog open={detailOpen} handleClose={handleDetailClose} model={model} modelName={modelName}/>
    </>
  );
};

export default ModelActions;
