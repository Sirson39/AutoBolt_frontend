import { Package, Users, AlertTriangle, Truck, ShoppingCart, DollarSign, BarChart2, ArrowRight, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import NotificationDropdown from '../components/NotificationDropdown';

const COLORS = ['#d95d39', '#1f8a70', '#465361', '#f5a623'];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export default function Dashboard() {
  const [clock, setClock] = useState(new Date());
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalParts: 0, lowStockParts: 0, totalCustomers: 0, totalVendors: 0, todayRevenue: 0 });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [salesChart, setSalesChart] = useState([]);
  const [categoryChart, setCategoryChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [parts, lowStock, customers, vendors, invoices, salesReport] = await Promise.all([
          axios.get('/api/parts'),
          axios.get('/api/parts/low-stock'),
          axios.get('/api/customers'),
          axios.get('/api/vendors'),
          axios.get('/api/invoices'),
          axios.get('/api/reports/sales?period=daily'),
        ]);

        const inv = invoices.data;
        const today = new Date().toDateString();
        const todayRevenue = inv
          .filter(i => new Date(i.invoiceDate).toDateString() === today)
          .reduce((sum, i) => sum + i.totalAmount, 0);

        setStats({
          totalParts:     parts.data.length,
          lowStockParts:  lowStock.data.length,
          totalCustomers: customers.data.length,
          totalVendors:   vendors.data.length,
          todayRevenue,
        });

        // Recent 5 invoices
        setRecentInvoices([...inv].sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate)).slice(0, 5));

        // Revenue chart from reports API — uses revenueTrend[{label, revenue, orderCount}]
        const report = salesReport.data;
        if (report?.revenueTrend?.length > 0) {
          setSalesChart(report.revenueTrend.map(p => ({ name: p.label, Revenue: p.revenue, Orders: p.orderCount })));
        } else {
          // Fallback: group invoices by weekday
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

        // Category distribution of parts
        const catMap = {};
        parts.data.forEach(p => { catMap[p.category] = (catMap[p.category] || 0) + 1; });
        setCategoryChart(Object.entries(catMap).map(([name, value]) => ({ name, value })));

      } catch (err) {
        toast.error('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const statCards = [
    { label: 'Total Parts',      value: stats.totalParts,                            icon: Package,       theme: 'brand',   link: '/admin/parts' },
    { label: 'Low Stock Alerts', value: stats.lowStockParts,                         icon: AlertTriangle, theme: 'danger',  link: '/admin/notifications', danger: stats.lowStockParts > 0 },
    { label: 'Total Customers',  value: stats.totalCustomers,                        icon: Users,         theme: 'accent',  link: '/admin/customers' },
    { label: 'Vendors',          value: stats.totalVendors,                          icon: Truck,         theme: 'warning', link: '/admin/vendors' },
    { label: "Today's Revenue",  value: `Rs ${stats.todayRevenue.toLocaleString()}`, icon: DollarSign,    theme: 'brand',   link: '/admin/sales' },
  ];

  const quickLinks = [
    { label: 'New Sale',       icon: ShoppingCart, link: '/admin/create-invoice',  color: 'var(--brand)' },
    { label: 'Restock Parts',  icon: Package,      link: '/admin/create-purchase', color: 'var(--accent)' },
    { label: 'View Reports',   icon: BarChart2,    link: '/admin/reports',         color: '#f5a623' },
    { label: 'Manage Staff',   icon: Users,        link: '/admin/staff',           color: '#1f8a70' },
  ];

  if (loading) return <div className="loading"><div className="spinner" /> Loading dashboard...</div>;

  return (
    <>
      <header className="top-header">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="page-title">{getGreeting()}, Admin 👋</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '3px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
              {clock.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--border)' }}>•</span>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: '800',
              color: 'var(--brand)',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.04em'
            }}>
              {clock.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <NotificationDropdown />
          <div className="avatar">A</div>
        </div>
      </header>

      <div className="page-content" style={{ animation: 'fadeIn 0.5s ease' }}>

        {/* Stat Cards */}
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {statCards.map((s) => (
            <div
              key={s.label}
              className="stat-card"
              onClick={() => s.link && navigate(s.link)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                borderLeft: s.danger ? '3px solid var(--danger)' : undefined,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="stat-card-label">{s.label}</span>
                  <h2 className="stat-card-value" style={{ fontSize: '1.75rem', marginTop: '0.25rem', color: s.danger ? 'var(--danger)' : undefined }}>{s.value}</h2>
                  <div style={{ fontSize: '0.75rem', color: 'var(--brand)', marginTop: '0.4rem', fontWeight: '700' }}>View →</div>
                </div>
                <div className={`stat-card-icon ${s.theme}`}><s.icon size={22} /></div>
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
              <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }} onClick={() => navigate('/admin/reports')}>
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
              <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }} onClick={() => navigate('/admin/sales')}>
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
                  <tr key={inv.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/sales')}>
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
                  onClick={() => navigate(q.link)}
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
          transform: translateY(-12px) scale(1.02) !important;
          box-shadow: 0 20px 40px rgba(217, 93, 57, 0.15) !important;
          border-color: var(--brand) !important;
          z-index: 10;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}
