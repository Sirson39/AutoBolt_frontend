import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import PartsManagement from './pages/PartsManagement';
import VendorManagement from './pages/VendorManagement';
import CustomerManagement from './pages/CustomerManagement';
import VehicleManagement from './pages/VehicleManagement';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="parts" element={<PartsManagement />} />
          <Route path="vendors" element={<VendorManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="vehicles" element={<VehicleManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
