// frontend/src/components/Header.tsx
import React, { useEffect } from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MonkeyLogo from '../assets/svg/monkey_logo.svg';

const Header: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if user is authenticated
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    
  }, [isAuthenticated, navigate]);

  return (
    <AppBar position="static">
      <Toolbar>
        <img src={MonkeyLogo} width="48px" alt="Monkey Logo" />
        <Typography variant="h6" sx={{ marginLeft: '0.5em', flexGrow: 1 }}>
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
