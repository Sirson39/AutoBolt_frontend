import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Truck, Users, FileText, Car,
  BarChart2, Bell, LogOut, ShoppingCart
} from 'lucide-react';

const navItems = [
  { label: 'Overview', section: true },
  { to: '/admin/dashboard',  label: 'Dashboard',        icon: LayoutDashboard },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { label: 'Inventory', section: true },
  { to: '/admin/parts',    label: 'Parts Management', icon: Package },
  { to: '/admin/vendors',  label: 'Vendor Management', icon: Truck },
  { label: 'Business', section: true },
  { to: '/admin/customers', label: 'Customer Management', icon: Users },
  { to: '/admin/vehicles',  label: 'Vehicle Management',  icon: Car },
  { to: '/admin/sales',     label: 'Sales & Invoices',    icon: ShoppingCart },
  { label: 'Staff & Security', section: true },
  { to: '/admin/staff',           label: 'Staff Management',    icon: Users },
  { label: 'Reports', section: true },
  { to: '/admin/inventory-report',  label: 'Inventory Report',  icon: BarChart2 },
  { to: '/admin/reports',           label: 'Financial Report',  icon: FileText },
];

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>Auto<span>Bolt</span></h1>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, i) =>
            item.section ? (
              <p key={i} className="nav-section-label">{item.label}</p>
            ) : (
              <NavLink
                key={i}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon className="nav-icon" size={18} />
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" style={{ color: '#e53e3e' }}>
            <LogOut className="nav-icon" size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
