// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UserProfile from './components/UserProfile';
import PackageForm from './components/PackageForm';
import PackageTable from './components/PackageTable';
import TransactionTable from './components/TransactionTable';
import PackageLabelPage from './components/PackageLabelPage';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/profile" element={<PrivateRoute component={UserProfile} />} />
        <Route path="/add-package" element={<PrivateRoute component={PackageForm} />} />
        <Route path="/packages" element={<PrivateRoute component={PackageTable} />} />
        <Route path="/transactions" element={<PrivateRoute component={TransactionTable} />} />
        <Route path="/packages/:id/label" element={<PrivateRoute component={PackageLabelPage} />} />
      </Routes>
    </Router>
  );
};

export default App;
