// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import UserProfile from './components/UserProfile';
import PackageForm from './components/PackageForm';
import PackageTable from './components/PackageTable';
import TransactionTable from './components/TransactionTable';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              TMS Labeling System
            </Typography>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
            <Button color="inherit" component={Link} to="/profile">Profile</Button>
            <Button color="inherit" component={Link} to="/add-package">Add Package</Button>
            <Button color="inherit" component={Link} to="/packages">Packages</Button>
            <Button color="inherit" component={Link} to="/transactions">Transactions</Button>
          </Toolbar>
        </AppBar>
        <Container>
          <Routes>
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/add-package" element={<PackageForm />} />
            <Route path="/packages" element={<PackageTable />} />
            <Route path="/transactions" element={<TransactionTable />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
};

export default App;
