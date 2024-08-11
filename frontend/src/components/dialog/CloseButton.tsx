import React from 'react';
import { IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

type Prop = {
	handleModalClose: () => void;
}

const CloseButton: React.FC<Prop> = ({ handleModalClose }: Prop) => {
	return (
		<IconButton
			aria-label="close"
			onClick={handleModalClose}
			sx={{
				position: 'absolute',
				right: 8,
				top: 8,
				color: (theme) => theme.palette.grey[500],
			}}
		>
			<Close />
		</IconButton>
	);
};

export default CloseButton;
