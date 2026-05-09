import AdminLayout from '../../components/AdminLayout';
import { 
  Package, Users, AlertTriangle, Truck, ShoppingCart, 
  DollarSign, BarChart2, ArrowRight, CheckCircle,
  User, Settings as SettingsIcon, LogOut, RefreshCw,
  TrendingUp, TrendingDown, Activity
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

import axios from 'axios';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import NotificationDropdown from '../../components/NotificationDropdown';

const COLORS = ['#d95d39', '#1f8a70', '#465361', '#f5a623'];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export default function Dashboard({ onNavigate }) {
  const [clock, setClock] = useState(new Date());
  
  const [stats, setStats] = useState({ totalParts: 0, lowStockParts: 0, totalCustomers: 0, totalVendors: 0, todayRevenue: 0 });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [salesChart, setSalesChart] = useState([]);
  const [categoryChart, setCategoryChart] = useState([]);
  const [trends, setTrends] = useState({ revenue: 0, customers: 0, parts: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Get admin name from profile data (mocked for now, but dynamic in behavior)
  const adminName = "System"; 
  const avatarLetter = adminName.charAt(0);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAll = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const [parts, lowStock, customers, vendors, invoices, salesReport] = await Promise.all([
        axios.get('/api/parts'),
        axios.get('/api/parts/low-stock'),
        axios.get('/api/customers'),
        axios.get('/api/vendors'),
        axios.get('/api/invoices'),
        axios.get('/api/reports/sales?period=daily'),
      ]);

      const inv = Array.isArray(invoices.data) ? invoices.data : [];
      const today = new Date().toDateString();
      const todayRevenue = inv
        .filter(i => i && i.invoiceDate && new Date(i.invoiceDate).toDateString() === today)
        .reduce((sum, i) => sum + (i.totalAmount || 0), 0);

      const partsData = Array.isArray(parts.data) ? parts.data : [];
      const lowStockData = Array.isArray(lowStock.data) ? lowStock.data : [];
      const customersData = Array.isArray(customers.data) ? customers.data : [];

      // Filter out "seen" notifications for the dashboard count
      const seenIds = JSON.parse(localStorage.getItem('seenNotificationIds') || '[]');
      const actualLowStockCount = lowStockData.filter(p => !seenIds.includes(p.id)).length;

      setStats({
        totalParts:     partsData.length,
        lowStockParts:  lowStockData.length,
        totalCustomers: customersData.length,
        totalVendors:   Array.isArray(vendors.data) ? vendors.data.length : 0,
        todayRevenue,
      });

      // Calculate Trends (Today vs Yesterday)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      const yesterdayRevenue = inv
        .filter(i => i && i.invoiceDate && new Date(i.invoiceDate).toDateString() === yesterdayStr)
        .reduce((sum, i) => sum + (i.totalAmount || 0), 0);

      const newCustomersToday = customersData.filter(c => c && c.createdAt && new Date(c.createdAt).toDateString() === today).length;
      const newCustomersYesterday = customersData.filter(c => c && c.createdAt && new Date(c.createdAt).toDateString() === yesterdayStr).length;

      const newPartsToday = partsData.filter(p => p && p.createdAt && new Date(p.createdAt).toDateString() === today).length;
      const newPartsYesterday = partsData.filter(p => p && p.createdAt && new Date(p.createdAt).toDateString() === yesterdayStr).length;

      const calculateTrend = (now, prev) => {
        if (prev === 0) return now > 0 ? 100 : 0;
        return ((now - prev) / prev) * 100;
      };

      setTrends({
        revenue: calculateTrend(todayRevenue, yesterdayRevenue),
        customers: calculateTrend(newCustomersToday, newCustomersYesterday),
        parts: calculateTrend(newPartsToday, newPartsYesterday)
      });

      setRecentInvoices([...inv].sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)).slice(0, 5));

      const report = salesReport.data;
      if (report?.revenueTrend?.length > 0) {
        setSalesChart(report.revenueTrend.map(p => ({ name: p.label, Revenue: p.revenue, Orders: p.orderCount })));
      } else {
        const days = {};
        inv.forEach(i => {
          const d = new Date(i.invoiceDate);
          if (!isNaN(d)) {
            const label = d.toLocaleDateString('en-US', { weekday: 'short' });
            days[label] = (days[label] || 0) + i.totalAmount;
          }
        });
        setSalesChart(Object.entries(days).slice(-7).map(([name, Revenue]) => ({ name, Revenue })));
      }

      const catMap = {};
      partsData.forEach(p => { if(p && p.category) catMap[p.category] = (catMap[p.category] || 0) + 1; });
      setCategoryChart(Object.entries(catMap).map(([name, value]) => ({ name, value })));

      setLastUpdated(new Date());
      if (isRefresh) toast.success("Dashboard data synchronized!");
    } catch (err) {
      toast.error('Failed to load dashboard data.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const formatTrend = (val) => {
    if (val === 0) return "Stable";
    return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`;
  };

  const statCards = [
    { label: 'Total Parts',      value: stats.totalParts,                            icon: Package,       theme: 'brand',   link: 'admin-parts',   trend: formatTrend(trends.parts), isUp: trends.parts > 0 },
    { label: 'Low Stock Alerts', value: stats.lowStockParts,                         icon: AlertTriangle, theme: 'danger',  link: 'admin-notifications', danger: stats.lowStockParts > 0, trend: stats.lowStockParts > 0 ? 'Action Required' : 'Healthy' },
    { label: 'Total Customers',  value: stats.totalCustomers,                        icon: Users,         theme: 'accent',  link: 'admin-customers', trend: formatTrend(trends.customers), isUp: trends.customers > 0 },
    { label: 'Vendors',          value: stats.totalVendors,                          icon: Truck,         theme: 'warning', link: 'admin-vendors', trend: 'Verified' },
    { label: "Today's Revenue",  value: `Rs ${stats.todayRevenue.toLocaleString()}`, icon: DollarSign,    theme: 'brand',   link: 'admin-sales',   trend: formatTrend(trends.revenue), isUp: trends.revenue > 0 },
  ];

  const quickLinks = [
    { label: 'New Sale',       icon: ShoppingCart, link: 'admin-create-invoice',  color: 'var(--brand)' },
    { label: 'Restock Parts',  icon: Package,      link: 'admin-create-purchase', color: 'var(--accent)' },
    { label: 'View Reports',   icon: BarChart2,    link: 'admin-reports',         color: '#f5a623' },
    { label: 'Manage Staff',   icon: Users,        link: 'admin-staff',           color: '#1f8a70' },
  ];

  if (loading) return <div className="loading"><div className="spinner" /> Loading dashboard...</div>;

  return (
    <>
      <header className="top-header glass-card" style={{ zIndex: 1010, position: 'sticky', top: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="page-title">{getGreeting()}, {adminName} 👋</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '3px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live System</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--border)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: '600' }}>
              {clock.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {clock.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '0.5rem', paddingRight: '0.5rem', borderRight: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', fontWeight: '600' }}>Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <button 
              className={`btn btn-ghost btn-sm ${refreshing ? 'refreshing' : ''}`} 
              onClick={() => fetchAll(true)}
              style={{ padding: '0.4rem', borderRadius: '8px' }}
            >
              <RefreshCw size={14} className={refreshing ? 'spinner' : ''} />
            </button>
          </div>
          <NotificationDropdown onNavigate={onNavigate} />
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <div className="avatar" onClick={() => setShowUserDropdown(!showUserDropdown)}>{avatarLetter}</div>
            
            {showUserDropdown && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <span className="dropdown-user-name">System Admin</span>
                  <span className="dropdown-user-role">Super Administrator</span>
                </div>
                <div className="dropdown-item" onClick={() => { onNavigate('admin-profile'); setShowUserDropdown(false); }}>
                  <User size={16} /> My Profile
                </div>
                <div className="dropdown-item" onClick={() => { onNavigate('admin-settings'); setShowUserDropdown(false); }}>
                  <SettingsIcon size={16} /> Shop Settings
                </div>
                <div style={{ borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />
                <div className="dropdown-item danger" onClick={() => { onNavigate('home'); setShowUserDropdown(false); }}>
                  <LogOut size={16} /> Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="page-content" style={{ animation: 'fadeIn 0.5s ease' }}>

        {/* Stat Cards */}
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {statCards.map((s) => (
            <div
              key={s.label}
              className={`stat-card ${refreshing ? 'shimmer' : ''}`}
              onClick={() => s.link && onNavigate(s.link)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                borderLeft: s.danger ? '3px solid var(--danger)' : undefined,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background Glow */}
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: `var(--${s.theme}-light)`, filter: 'blur(30px)', opacity: 0.5, zIndex: 0 }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <div>
                  <span className="stat-card-label">{s.label}</span>
                  <h2 className="stat-card-value" style={{ fontSize: '1.75rem', marginTop: '0.25rem', color: s.danger ? 'var(--danger)' : undefined }}>{s.value}</h2>
                  
                  {s.trend && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.5rem' }}>
                      {s.isUp ? (
                        <TrendingUp size={12} color="#10b981" />
                      ) : s.trend.includes('%') ? (
                        <TrendingDown size={12} color="var(--danger)" />
                      ) : (
                        <Activity size={12} color="var(--ink-soft)" />
                      )}
                      <span style={{ fontSize: '0.72rem', fontWeight: '800', color: s.isUp ? '#10b981' : 'var(--ink-soft)' }}>
                        {s.trend}
                      </span>
                    </div>
                  )}
                </div>
                <div className={`stat-card-icon ${s.theme}`} style={{ width: '44px', height: '44px' }}><s.icon size={22} /></div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '0.5rem' }}>

          {/* Revenue Area Chart */}
          <div className="table-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontWeight: '800', fontSize: '0.95rem' }}>Revenue Overview</h3>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }} onClick={() => onNavigate('admin-reports')}>
                Full Report <ArrowRight size={14} />
              </button>
            </div>
            {salesChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={salesChart}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d95d39" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#d95d39" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--ink-soft)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--ink-soft)' }} tickFormatter={v => `Rs ${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => [`Rs ${v.toLocaleString()}`, 'Revenue']} contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.8rem' }} />
                  <Area type="monotone" dataKey="Revenue" stroke="#d95d39" strokeWidth={2.5} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)' }}>
                No sales data yet
              </div>
            )}
          </div>

          {/* Parts by Category Pie */}
          <div className="table-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: '800', fontSize: '0.95rem', marginBottom: '1.25rem' }}>Parts by Category</h3>
            {categoryChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categoryChart} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                    {categoryChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.8rem' }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)' }}>
                No parts data yet
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>

          {/* Recent Sales */}
          <div className="table-card">
            <div className="table-toolbar">
              <span style={{ fontWeight: '800' }}>Recent Sales</span>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }} onClick={() => onNavigate('admin-sales')}>
                View All <ArrowRight size={14} />
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.length > 0 ? recentInvoices.map(inv => (
                  <tr key={inv.id} style={{ cursor: 'pointer' }} onClick={() => onNavigate('admin-sales')}>
                    <td style={{ fontWeight: '700' }}>{inv.invoiceNumber || `#${inv.id}`}</td>
                    <td>{inv.customerName || '—'}</td>
                    <td style={{ fontWeight: '900', color: 'var(--brand)' }}>Rs {inv.totalAmount?.toLocaleString()}</td>
                    <td><span className="badge badge-success"><CheckCircle size={10} style={{ marginRight: '4px' }} />Paid</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--ink-soft)', padding: '2rem' }}>No sales yet</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Quick Links */}
          <div className="table-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: '800', fontSize: '0.95rem', marginBottom: '1.25rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {quickLinks.map(q => (
                <button
                  key={q.label}
                  className="btn btn-ghost"
                  style={{ justifyContent: 'flex-start', gap: '0.75rem', padding: '0.85rem 1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', transition: 'all 0.2s ease' }}
                  onClick={() => onNavigate(q.link)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = q.color; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <q.icon size={18} style={{ color: q.color }} />
                  <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{q.label}</span>
                  <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--ink-soft)' }} />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .stat-card:hover {
          transform: translateY(-8px) scale(1.01) !important;
          box-shadow: var(--shadow-luxury) !important;
          border-color: var(--brand) !important;
          z-index: 10;
        }
        .stat-card:hover .stat-card-icon {
          transform: translateY(-2px) scale(1.05);
        }
        .stat-card-icon {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}

