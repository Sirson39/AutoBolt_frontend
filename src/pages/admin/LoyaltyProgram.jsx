import { useState, useEffect } from 'react';
import { Gift, DollarSign, Users, TrendingUp, Award, ArrowRight, Star, Settings2, Save, Info } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import NotificationDropdown from '../../components/NotificationDropdown';

export default function LoyaltyProgram({ onNavigate }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({
    loyaltyThreshold: 5000,
    loyaltyDiscountPercent: 10
  });
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [tempConfig, setTempConfig] = useState({
    loyaltyThreshold: 5000,
    loyaltyDiscountPercent: 10
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, configRes] = await Promise.all([
          axios.get('/api/invoices'),
          axios.get('/api/config')
        ]);
        setInvoices(invRes.data || []);
        if (configRes.data) {
          setConfig(configRes.data);
          setTempConfig(configRes.data);
        }
      } catch (err) {
        console.error("Loyalty data error:", err);
        toast.error('Failed to load loyalty data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateConfig = async () => {
    try {
      await axios.put('/api/config', tempConfig);
      setConfig(tempConfig);
      setIsEditingConfig(false);
      toast.success('Loyalty rules updated successfully!');
    } catch {
      toast.error('Failed to update rules.');
    }
  };

  // --- Derived stats from invoices ---
  const loyaltyInvoices = (invoices || []).filter(i => (i.discountAmount || 0) > 0);
  const totalDiscountGiven = loyaltyInvoices.reduce((s, i) => s + (i.discountAmount || 0), 0);
  
  // Use CustomerId for grouping
  const customerMap = {};
  (invoices || []).forEach(i => {
    const cid = i.customerId || 'unknown';
    const name = i.customerName || 'Anonymous';
    if (!customerMap[cid]) {
      customerMap[cid] = { name: name, totalDiscount: 0, visits: 0, totalSpend: 0 };
    }
    customerMap[cid].totalDiscount += (i.discountAmount || 0);
    customerMap[cid].totalSpend += (i.subTotal || 0);
    customerMap[cid].visits += 1;
  });
  
  const customerList = Object.values(customerMap).sort((a, b) => b.totalDiscount - a.totalDiscount);
  const uniqueLoyalCustomers = customerList.filter(c => c.totalDiscount > 0).length;

  const chartData = customerList.slice(0, 6).map(c => ({
    name: (c.name || 'User').split(' ')[0], 
    Discount: Math.round(c.totalDiscount || 0),
  }));

  const SummaryCard = ({ title, value, subValue, icon: Icon, theme = 'brand', link }) => (
    <div
      className="stat-card"
      onClick={() => link && onNavigate(link)}
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
      <header className="top-header glass-card" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '42px', height: '42px', borderRadius: '12px', 
            background: 'linear-gradient(135deg, var(--brand) 0%, #b84a2a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            boxShadow: '0 4px 12px rgba(217, 93, 57, 0.3)'
          }}>
            <Gift size={22} />
          </div>
          <div>
            <span className="page-title" style={{ fontSize: '1.25rem', fontWeight: '900' }}>Loyalty Program</span>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', fontWeight: '600' }}>Track rewards, manage thresholds, and monitor top customers</div>
          </div>
        </div>
        <div className="header-actions">
          <NotificationDropdown onNavigate={onNavigate} />
        </div>
      </header>

      <div className="page-content" style={{ animation: 'fadeUp 0.6s ease both' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            borderRadius: 'var(--radius)',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-luxury)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1 }}>
              <Award size={200} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ padding: '6px', background: 'var(--brand)', borderRadius: '8px' }}>
                  <Star size={18} fill="currentColor" />
                </div>
                <span style={{ fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.8rem', opacity: 0.8 }}>Active Rewards Program</span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: '900', margin: '0.5rem 0', lineHeight: 1.1 }}>
                Instant <span style={{ color: 'var(--brand)' }}>{config.loyaltyDiscountPercent}% Savings</span> on Qualifying Purchases.
              </h1>
              <p style={{ fontSize: '0.95rem', opacity: 0.7, maxWidth: '500px', lineHeight: 1.6, marginTop: '1rem' }}>
                Any transaction exceeding <strong style={{ color: '#fff' }}>Rs {(config.loyaltyThreshold || 0).toLocaleString()}</strong> automatically triggers a high-tier discount.
              </p>
            </div>
          </div>

          <div className="table-card" style={{ padding: '1.5rem', border: '1px solid var(--brand-soft)', background: 'var(--brand-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', color: 'var(--brand)' }}>
                <Settings2 size={18} /> PROGRAM SETTINGS
              </div>
              {!isEditingConfig ? (
                <button className="btn btn-ghost btn-sm" onClick={() => setIsEditingConfig(true)} style={{ color: 'var(--brand)' }}>Edit</button>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setIsEditingConfig(false)}>Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={handleUpdateConfig}><Save size={14} /> Save</button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem', color: 'var(--brand)', opacity: 0.8 }}>Spending Threshold (Rs)</label>
                <input 
                  type="number" className="form-input" 
                  disabled={!isEditingConfig}
                  value={tempConfig.loyaltyThreshold || ''}
                  onChange={e => setTempConfig({...tempConfig, loyaltyThreshold: Number(e.target.value)})}
                  style={{ background: isEditingConfig ? '#fff' : 'transparent', border: isEditingConfig ? '1px solid var(--brand)' : '1px solid transparent' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.75rem', color: 'var(--brand)', opacity: 0.8 }}>Discount Percentage (%)</label>
                <input 
                  type="number" className="form-input" 
                  disabled={!isEditingConfig}
                  value={tempConfig.loyaltyDiscountPercent || ''}
                  onChange={e => setTempConfig({...tempConfig, loyaltyDiscountPercent: Number(e.target.value)})}
                  style={{ background: isEditingConfig ? '#fff' : 'transparent', border: isEditingConfig ? '1px solid var(--brand)' : '1px solid transparent' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="stat-grid">
          <SummaryCard title="Total Savings Delivered" value={`Rs ${totalDiscountGiven.toLocaleString()}`} subValue="Direct value returned" icon={DollarSign} theme="brand" />
          <SummaryCard title="Loyalty Sales" value={loyaltyInvoices.length} subValue="Qualified transactions" icon={TrendingUp} theme="accent" link="admin-sales" />
          <SummaryCard title="Reward Members" value={uniqueLoyalCustomers} subValue="Unique customers" icon={Users} theme="warning" link="admin-customers" />
          <SummaryCard title="Avg Value / Reward" value={loyaltyInvoices.length > 0 ? `Rs ${Math.round(totalDiscountGiven / loyaltyInvoices.length).toLocaleString()}` : 'Rs 0'} subValue="Value per checkout" icon={Award} theme="brand" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="table-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontWeight: '900', fontSize: '1.1rem', marginBottom: '2rem' }}>Customer Engagement</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} barSize={42}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: '700', fill: 'var(--ink-soft)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--ink-soft)' }} tickFormatter={v => `Rs ${v}`} />
                  <Tooltip cursor={{ fill: 'rgba(217, 93, 57, 0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)', padding: '12px' }} />
                  <Bar dataKey="Discount" fill="var(--brand)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)' }}>No data yet</div>
            )}
          </div>
          <div className="table-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontWeight: '900', fontSize: '1.1rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Award size={22} color="var(--brand)" /> Elite Members</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {customerList.slice(0, 5).map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '12px', background: i === 0 ? 'var(--brand-light)' : 'transparent' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: i === 0 ? 'var(--brand)' : 'var(--surface-2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '900' }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>{c.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--ink-soft)' }}>{c.visits} visit(s)</div>
                  </div>
                  <div style={{ fontWeight: '900', color: 'var(--brand)' }}>-Rs {Math.round(c.totalDiscount).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="table-card" style={{ boxShadow: 'var(--shadow-luxury)' }}>
          <div className="table-toolbar" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: '900', fontSize: '1.1rem' }}>Transaction History</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '4px' }}>Detailed breakdown of all rewarded sales</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('admin-sales')} style={{ fontSize: '0.8rem', color: 'var(--brand)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              All Sales <ArrowRight size={14} />
            </button>
          </div>
          <table>
            <thead>
              <tr><th style={{ paddingLeft: '2rem' }}>Invoice #</th><th>Customer</th><th>Sub Total</th><th>Reward</th><th>Net Total</th><th style={{ paddingRight: '2rem' }}>Date</th></tr>
            </thead>
            <tbody>
              {loyaltyInvoices.map(inv => (
                <tr key={inv.id} style={{ cursor: 'pointer' }} onClick={() => onNavigate('admin-sales')}>
                  <td style={{ fontWeight: '800', paddingLeft: '2rem' }}>{inv.invoiceNumber}</td>
                  <td>{inv.customerName}</td>
                  <td>Rs {inv.subTotal.toLocaleString()}</td>
                  <td style={{ color: 'var(--success)', fontWeight: '900' }}>-Rs {inv.discountAmount.toLocaleString()}</td>
                  <td style={{ fontWeight: '900', color: 'var(--brand)' }}>Rs {inv.totalAmount.toLocaleString()}</td>
                  <td style={{ paddingRight: '2rem' }}>{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
