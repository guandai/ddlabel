// frontend/src/components/Home.tsx
import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { StyledBox } from '../../util/styled';

const Home: React.FC = () => {
  return (
    <Container component="main" maxWidth="md">
      <StyledBox>
        <Typography component="h1" variant="h4">
          Register a new user
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" component={Link} to="/register" sx={{ mr: 2 }}>
            Register
          </Button>
          {/* <Button variant="contained" color="secondary" component={Link} to="/login">
            Login
          </Button> */}
        </Box>
      </StyledBox>
    </Container>
  );
};

export default Home;
