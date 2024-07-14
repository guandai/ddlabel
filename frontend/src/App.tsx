// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import UserProfile from './components/UserProfile';
import PackageForm from './components/PackageForm';
import PackageTable from './components/PackageTable';
import TransactionTable from './components/TransactionTable';
import PackageLabelPage from './components/PackageLabelPage';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';

const AppContent: React.FC = () => {
  const location = useLocation();

  const showHeader = !(location.pathname.startsWith('/packages/') && location.pathname.match(/\/packages\/\d+\/label/));

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<UserProfile isRegister={true} />} />
        <Route path="/profile" element={<PrivateRoute component={UserProfile} />} />
        <Route path="/packages/create" element={<PrivateRoute component={PackageForm} />} />
        <Route path="/packages/edit/:id" element={<PrivateRoute component={PackageForm} />} />
        <Route path="/packages" element={<PrivateRoute component={PackageTable} />} />
        <Route path="/transactions" element={<PrivateRoute component={TransactionTable} />} />
        <Route path="/packages/:id/label" element={<PrivateRoute component={PackageLabelPage} />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
