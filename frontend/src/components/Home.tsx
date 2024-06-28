// frontend/src/components/Home.tsx
import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4">
          Welcome to TMS Labeling System
        </Typography>
        <Typography component="p" sx={{ mt: 2 }}>
          This system allows you to manage your shipping packages, generate logistic labels, and track your shipments.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" component={Link} to="/register" sx={{ mr: 2 }}>
            Register
          </Button>
          <Button variant="contained" color="secondary" component={Link} to="/login">
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
