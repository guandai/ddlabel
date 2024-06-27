import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, CircularProgress, Box } from '@mui/material';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import UserProfile from './components/UserProfile';
import PackageForm from './components/PackageForm';
import PackageTable from './components/PackageTable';
import TransactionTable from './components/TransactionTable';
import './App.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              TMS Labeling System
            </Typography>
            {!isLoggedIn ? (
              <>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/register">Register</Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/profile">Profile</Button>
                <Button color="inherit" component={Link} to="/add-package">Add Package</Button>
                <Button color="inherit" component={Link} to="/packages">Packages</Button>
                <Button color="inherit" component={Link} to="/transactions">Transactions</Button>
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </>
            )}
          </Toolbar>
        </AppBar>
        <Container>
          <Routes>
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/profile" element={isLoggedIn ? <UserProfile /> : <Navigate to="/login" />} />
            <Route path="/add-package" element={isLoggedIn ? <PackageForm /> : <Navigate to="/login" />} />
            <Route path="/packages" element={isLoggedIn ? <PackageTable /> : <Navigate to="/login" />} />
            <Route path="/transactions" element={isLoggedIn ? <TransactionTable /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to={isLoggedIn ? "/profile" : "/login"} />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
};

export default App;
