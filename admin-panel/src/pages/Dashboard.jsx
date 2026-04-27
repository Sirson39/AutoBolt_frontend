import { Package, Users, TrendingUp, AlertTriangle, ShoppingCart, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import NotificationDropdown from '../components/NotificationDropdown';

const statDefs = [
  { key: 'totalParts',     label: 'Total Parts',      icon: Package,      theme: 'brand'  },
  { key: 'lowStockParts',  label: 'Low Stock Alerts', icon: AlertTriangle, theme: 'danger' },
  { key: 'totalCustomers', label: 'Total Customers',  icon: Users,        theme: 'accent' },
  { key: 'totalVendors',   label: 'Vendors',          icon: Truck,        theme: 'warning'},
];

export default function Dashboard() {
  const [stats, setStats] = useState({ totalParts: 0, lowStockParts: 0, totalCustomers: 0, totalVendors: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [parts, lowStock, customers] = await Promise.all([
          axios.get('/api/parts'),
          axios.get('/api/parts/low-stock'),
          axios.get('/api/customers'),
        ]);
        setStats({
          totalParts:     parts.data.length,
          lowStockParts:  lowStock.data.length,
          totalCustomers: customers.data.length,
          totalVendors:   0, // will update when vendor API is ready
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      <header className="top-header">
        <span className="page-title">Dashboard</span>
        <div className="header-actions">
          <NotificationDropdown />
          <div className="avatar">A</div>
        </div>
      </header>

      <div className="page-content">
        {loading ? (
          <div className="loading"><div className="spinner" /> Loading stats...</div>
        ) : (
          <div className="stat-grid">
            {statDefs.map((s, i) => (
              <div className="stat-card" key={s.key} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={`stat-card-icon ${s.theme}`}>
                  <s.icon size={20} />
                </div>
                <span className="stat-card-label">{s.label}</span>
                <span className="stat-card-value">{stats[s.key]}</span>
              </div>
            ))}
          </div>
        )}

        <div className="table-card">
          <div className="table-toolbar">
            <span className="section-title">Quick Overview</span>
          </div>
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
            <TrendingUp size={40} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
            <p>Charts and reports coming soon. Navigate to the reports section for detailed analytics.</p>
          </div>
        </div>
      </div>
    </>
  );
}
