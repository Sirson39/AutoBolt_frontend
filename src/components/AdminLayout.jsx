import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, Truck, Users, FileText, Car,
  BarChart2, Bell, LogOut, ShoppingCart, Gift, Settings
} from 'lucide-react';
import axios from 'axios';

const navItems = [
  { label: 'Overview', section: true },
  { to: 'admin',  label: 'Dashboard',        icon: LayoutDashboard },
  { to: 'admin-notifications', label: 'Notifications', icon: Bell, isNotification: true },
  { label: 'Inventory', section: true },
  { to: 'admin-parts',    label: 'Parts Management', icon: Package },
  { to: 'admin-vendors',  label: 'Vendor Management', icon: Truck },
  { label: 'Business', section: true },
  { to: 'admin-sales',     label: 'Sales & Invoices',    icon: ShoppingCart },
  { to: 'admin-purchase', label: 'Purchase Management', icon: ShoppingCart },
  { to: 'admin-customers', label: 'Customer Management', icon: Users },
  { to: 'admin-vehicles',  label: 'Vehicle Management',  icon: Car },
  { to: 'admin-loyalty',   label: 'Loyalty Program',     icon: Gift },
  { label: 'Staff & Security', section: true },
  { to: 'admin-staff',           label: 'Staff Management',    icon: Users },
  { label: 'Reports', section: true },
  { to: 'admin-inventory',  label: 'Inventory Report',  icon: BarChart2 },
  { to: 'admin-reports',           label: 'Financial Report',  icon: FileText },
  { label: 'Configurations', section: true },
  { to: 'admin-settings',        label: 'Shop Settings',       icon: Settings },
];

export default function AdminLayout({ children, onNavigate }) {
  const [unseenCount, setUnseenCount] = useState(0);
  const [shopName, setShopName] = useState('AutoBolt');
  const [tagline, setTagline] = useState('Admin Panel');

  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('shopSettings');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const data = JSON.parse(saved);
        if (data && typeof data === 'object') {
          setShopName(data.shopName || 'AutoBolt');
          setTagline(data.tagline || 'Admin Panel');
          return;
        }
      }
    } catch (e) {
      console.error("Critical: Settings recovery failed", e);
    }
    setShopName('AutoBolt');
    setTagline('Admin Panel');
  };

  const updateUnseenCount = (parts) => {
    const seenIds = JSON.parse(localStorage.getItem('seenNotificationIds') || '[]');
    const newParts = parts.filter(p => !seenIds.includes(p.id));
    setUnseenCount(newParts.length);
  };

  useEffect(() => {
    const fetchLowStockCount = async () => {
      try {
        const response = await axios.get('/api/parts/low-stock');
        updateUnseenCount(response.data);
      } catch (error) {
        console.error("Failed to fetch notification count", error);
      }
    };

    fetchLowStockCount();
    loadSettings();

    window.addEventListener('settingsUpdated', loadSettings);

    const interval = setInterval(fetchLowStockCount, 30000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('settingsUpdated', loadSettings);
    };
  }, []);

  const currentRoute = window.location.hash.replace(/^#/, "") || 'admin';

  return (
    <div className="admin-layout">
      <aside className="sidebar no-print">
        <div className="sidebar-logo">
          <h1>Auto<span>Bolt</span></h1>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, i) =>
            item.section ? (
              <p key={i} className="nav-section-label">{item.label}</p>
            ) : (
              <button
                key={i}
                onClick={() => onNavigate(item.to)}
                className={`nav-item ${currentRoute === item.to ? 'active' : ''}`}
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  textAlign: 'left', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '4px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: 'var(--ink-soft)'
                }}
              >
                <item.icon className="nav-icon" size={18} style={{ marginRight: '12px' }} />
                {item.label}
                {item.isNotification && unseenCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'var(--danger)',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: '900',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 4px rgba(229, 62, 62, 0.3)'
                  }}>
                    {unseenCount}
                  </span>
                )}
              </button>
            )
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" style={{ color: '#e53e3e', width: '100%', border: 'none', background: 'none', textAlign: 'left', display: 'flex', alignItems: 'center' }} onClick={() => onNavigate('home')}>
            <LogOut className="nav-icon" size={18} style={{ marginRight: '12px' }} />
            Logout
          </button>
        </div>
      </aside>

      <div className="main-content">
        {children}
      </div>
    </div>
  );
}
