import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import PartsManagement from './pages/PartsManagement';
import VendorManagement from './pages/VendorManagement';
import CustomerManagement from './pages/CustomerManagement';
import VehicleManagement from './pages/VehicleManagement';
import SalesManagement from './pages/SalesManagement';
import CreateInvoice from './pages/CreateInvoice';
import FinancialReports from './pages/FinancialReports';
import StaffManagement from './pages/StaffManagement';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="parts" element={<PartsManagement />} />
          <Route path="vendors" element={<VendorManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="vehicles" element={<VehicleManagement />} />
          <Route path="sales" element={<SalesManagement />} />
          <Route path="create-invoice" element={<CreateInvoice />} />
          <Route path="reports" element={<FinancialReports />} />
          <Route path="staff" element={<StaffManagement />} />
        </Route>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
