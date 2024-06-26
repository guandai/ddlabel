import { Container, CssBaseline, Typography, AppBar, Toolbar, Paper, Box } from '@mui/material';
import PackageList from './components/PackageList';
import AddPackageForm from './components/AddPackageForm';
import { PackageProvider } from './contexts/PackageContext';
import ScanButton from './components/ScanButton';

function App() {
  return (
    <PackageProvider>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Package Manager</Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="md">
        <Box my={4}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Add New Package
            </Typography>
            <AddPackageForm />
            <ScanButton />
          </Paper>
          <Box my={4}>
            <Paper elevation={3} style={{ padding: '16px' }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Package List
              </Typography>
              <PackageList />
            </Paper>
          </Box>
        </Box>
      </Container>
    </PackageProvider>
  );
}

export default App;
