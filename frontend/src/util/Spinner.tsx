import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const LoadingSpinner = () => {
  return (
    <Box
      marginLeft={1}
      marginRight={1}
    >
      <CircularProgress size="1.5em" />
    </Box>
  );
}

export default LoadingSpinner;
