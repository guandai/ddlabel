// frontend/src/components/Header.tsx
import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if user is authenticated
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          TMS Labeling System
        </Typography>
        <Button color="inherit" component={Link} to="/">
          HOME
        </Button>
        {/* <Button color="inherit" component={Link} to="/register">
          REGISTER
        </Button> */}
        {isAuthenticated && (
          <>
            <Button color="inherit" component={Link} to="/profile">
              PROFILE
            </Button>
            <Button color="inherit" component={Link} to="/packages">
              PACKAGES
            </Button>
            <Button color="inherit" component={Link} to="/transactions">
              TRANSACTIONS
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              LOGOUT
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
