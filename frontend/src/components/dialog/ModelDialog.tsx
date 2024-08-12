import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Models } from '@ddlabel/shared';
import DialogCard from './DialogCard';
import { toCapitalize } from '../../util/styled';
import { getRecursiveResult } from '../../util/recursivePush';

type ModelDialogProps = {
    open: boolean;
    handleClose: () => void;
    model: Models | null;
	modelName: string;
}

const ModelDialog: React.FC<ModelDialogProps> = ({ open, handleClose, model, modelName }) => {
    if (!model) return null;

	const gridNodesSections = getRecursiveResult(model, modelName);
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby={`${modelName}-details-title`}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle id={`${modelName}-details-title`}>{toCapitalize(modelName)} Details</DialogTitle>
            <DialogContent >
                {gridNodesSections.map((gridNodes, idx: number) => <DialogCard key={`gridNodes-${idx}`} title={`${gridNodes.title} Information`} gridNodes={gridNodes.gridNodes} />) }
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
};

export default ModelDialog;
