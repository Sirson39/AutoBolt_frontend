import { useState, useEffect } from 'react';
import { Gift, DollarSign, Users, TrendingUp, Award, ArrowRight, Star } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import NotificationDropdown from '../components/NotificationDropdown';
import { useNavigate } from 'react-router-dom';

export default function LoyaltyProgram() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get('/api/invoices');
        setInvoices(res.data);
      } catch {
        toast.error('Failed to load loyalty data.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // --- Derived stats from invoices ---
  const loyaltyInvoices = invoices.filter(i => i.discountAmount > 0);
  const totalDiscountGiven = loyaltyInvoices.reduce((s, i) => s + i.discountAmount, 0);
  const uniqueLoyalCustomers = new Set(loyaltyInvoices.map(i => i.customerName)).size;
  const totalRevenue = invoices.reduce((s, i) => s + i.totalAmount, 0);

  // Per-customer loyalty breakdown
  const customerMap = {};
  loyaltyInvoices.forEach(i => {
    if (!customerMap[i.customerName]) {
      customerMap[i.customerName] = { name: i.customerName, totalDiscount: 0, visits: 0, totalSpend: 0 };
    }
    customerMap[i.customerName].totalDiscount += i.discountAmount;
    customerMap[i.customerName].totalSpend += i.subTotal;
    customerMap[i.customerName].visits += 1;
  });
  const customerList = Object.values(customerMap).sort((a, b) => b.totalDiscount - a.totalDiscount);

  // Chart — top 6 customers by discount received
  const chartData = customerList.slice(0, 6).map(c => ({
    name: c.name.split(' ')[0], // first name for brevity
    Discount: Math.round(c.totalDiscount),
  }));

  const SummaryCard = ({ title, value, subValue, icon: Icon, theme = 'brand', link }) => (
    <div
      className="stat-card"
      onClick={() => link && navigate(link)}
      style={{ cursor: link ? 'pointer' : 'default', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="stat-card-label">{title}</span>
          <h2 className="stat-card-value" style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>{value}</h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginTop: '0.4rem' }}>{subValue}</div>
        </div>
        <div className={`stat-card-icon ${theme}`}><Icon size={22} /></div>
      </div>
    </div>
  );

  if (loading) return <div className="loading"><div className="spinner" /> Loading loyalty data...</div>;

  return (
    <>
      <header className="top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Gift style={{ color: 'var(--brand)' }} size={22} />
          <span className="page-title">Loyalty Program</span>
        </div>
        <div className="header-actions">
          <NotificationDropdown />
        </div>
      </header>

      <div className="page-content" style={{ animation: 'fadeIn 0.5s ease' }}>

        {/* How it works banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--brand) 0%, #b84a2a 100%)',
          borderRadius: 'var(--radius)',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          marginBottom: '0.5rem',
          color: '#fff'
        }}>
          <Star size={36} style={{ flexShrink: 0, opacity: 0.9 }} />
          <div>
            <div style={{ fontWeight: '900', fontSize: '1rem', letterSpacing: '0.02em' }}>How the Loyalty Program Works</div>
            <div style={{ fontSize: '0.82rem', opacity: 0.88, marginTop: '3px' }}>
              Any single purchase exceeding <strong>Rs 5,000</strong> automatically receives a <strong>10% discount</strong> at checkout. 
              No signup needed — every qualifying customer benefits instantly.
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="stat-grid">
          <SummaryCard
            title="Total Discounts Given"
            value={`Rs ${totalDiscountGiven.toLocaleString()}`}
            subValue="Cumulative savings for customers"
            icon={DollarSign}
            theme="brand"
          />
          <SummaryCard
            title="Loyalty Transactions"
            value={loyaltyInvoices.length}
            subValue="Invoices with discount applied"
            icon={TrendingUp}
            theme="accent"
            link="/admin/sales"
          />
          <SummaryCard
            title="Loyal Customers"
            value={uniqueLoyalCustomers}
            subValue="Unique customers who benefited"
            icon={Users}
            theme="warning"
            link="/admin/customers"
          />
          <SummaryCard
            title="Avg Discount / Transaction"
            value={loyaltyInvoices.length > 0 ? `Rs ${Math.round(totalDiscountGiven / loyaltyInvoices.length).toLocaleString()}` : 'Rs 0'}
            subValue="Per qualifying invoice"
            icon={Award}
            theme="brand"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>

          {/* Bar Chart */}
          <div className="table-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: '800', fontSize: '0.95rem', marginBottom: '1.25rem' }}>Top Customers by Discount Received</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--ink-soft)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--ink-soft)' }} tickFormatter={v => `Rs ${v}`} />
                  <Tooltip
                    formatter={v => [`Rs ${v.toLocaleString()}`, 'Discount']}
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.8rem' }}
                  />
                  <Bar dataKey="Discount" fill="#d95d39" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)' }}>
                No loyalty transactions yet
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div className="table-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: '800', fontSize: '0.95rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="var(--brand)" /> Top Loyal Customers
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {customerList.slice(0, 5).length > 0 ? customerList.slice(0, 5).map((c, i) => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    background: i === 0 ? '#f5a623' : i === 1 ? '#aaa' : i === 2 ? '#cd7f32' : 'var(--surface-2)',
                    color: i < 3 ? '#fff' : 'var(--ink-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: '900'
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{c.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--ink-soft)' }}>{c.visits} visit{c.visits > 1 ? 's' : ''} · Rs {c.totalSpend.toLocaleString()} spent</div>
                  </div>
                  <div style={{ fontWeight: '900', color: 'var(--brand)', fontSize: '0.85rem' }}>
                    -Rs {Math.round(c.totalDiscount).toLocaleString()}
                  </div>
                </div>
              )) : (
                <div style={{ color: 'var(--ink-soft)', textAlign: 'center', padding: '2rem 0' }}>No loyalty customers yet</div>
              )}
            </div>
          </div>
        </div>

        {/* All Loyalty Transactions Table */}
        <div className="table-card">
          <div className="table-toolbar">
            <span style={{ fontWeight: '800' }}>All Loyalty Transactions</span>
            <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem' }} onClick={() => navigate('/admin/sales')}>
              View All Sales <ArrowRight size={14} />
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Sub Total</th>
                <th>Discount (10%)</th>
                <th>Final Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loyaltyInvoices.length > 0 ? loyaltyInvoices
                .sort((a, b) => new Date(b.invoiceDate) - new Date(a.invoiceDate))
                .map(inv => (
                  <tr key={inv.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/sales')}>
                    <td style={{ fontWeight: '700' }}>{inv.invoiceNumber || `#${inv.id}`}</td>
                    <td>{inv.customerName}</td>
                    <td>Rs {inv.subTotal.toLocaleString()}</td>
                    <td style={{ color: 'var(--success)', fontWeight: '800' }}>-Rs {inv.discountAmount.toLocaleString()}</td>
                    <td style={{ fontWeight: '900', color: 'var(--brand)' }}>Rs {inv.totalAmount.toLocaleString()}</td>
                    <td style={{ color: 'var(--ink-soft)' }}>{new Date(inv.invoiceDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--ink-soft)', padding: '2rem' }}>No loyalty transactions yet</td></tr>
                )}
            </tbody>
          </table>
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
