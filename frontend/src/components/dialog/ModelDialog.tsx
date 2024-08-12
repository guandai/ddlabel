import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Models } from '@ddlabel/shared';
import DialogCard, { GridNode } from './DialogCard';
import { toCapitalize } from '../../util/styled';

type ModelDialogProps = {
    open: boolean;
    handleClose: () => void;
    model: Models | null;
	modelName: string;
}

type GridNodesSection = {
	title: string;
	gridNodes: GridNode[];
}

const ModelDialog: React.FC<ModelDialogProps> = ({ open, handleClose, model, modelName }) => {
    if (!model) return null;

	const gridNodesSections = [ ] as GridNodesSection[];
    const recursivePush = (model: Models, title: string) => {
		if (!model) return;
		const gridNodes = [] as GridNode[];
		Object.keys(model).forEach((key) => {
			if (typeof model[key as keyof Models] !== 'object') {
				gridNodes.push( { label: key, value: model[key as keyof Models] } );
			} else {
				const subModel = ({...model} as any)[key] as Models;
				recursivePush(subModel, key);
			}
		});
		gridNodesSections.push({title, gridNodes});
	}
	recursivePush(model, modelName);
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
