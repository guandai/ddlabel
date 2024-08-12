// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import UsersTable from './components/user/UsersTable';
import LoginForm from './components/user/LoginForm';
import UserForm from './components/user/UserForm';
import PackageForm from './components/package/PackageForm';
import PackageTable from './components/package/PackageTable';
import TransactionTable from './components/transaction/TransactionTable';
import PackageLabelPage from './components/label/PackageLabelPage';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/share/Header';
import PdfExporter from './components/label/PdfExporter';

const AppContent: React.FC = () => {
  const location = useLocation();
  const showHeader = !(location.pathname.startsWith('/packages/') && location.pathname.match(/\/packages\/\d+\/label/));

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/pdfs" element={<PdfExporter />} />
        <Route path="/users" element={<UsersTable />} />
        <Route path="/users/edit/:id" element={<PrivateRoute component={UserForm} />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<UserForm isRegister={true} />} />
        <Route path="/profile" element={<UserForm/>} />
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
