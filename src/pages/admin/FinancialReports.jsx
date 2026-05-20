import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, 
  Package, Calendar, ChevronRight, Download, Filter, 
  PieChart as PieChartIcon, Activity
} from 'lucide-react';

import api from '../../utils/api';
import toast from 'react-hot-toast';
import NotificationDropdown from '../../components/NotificationDropdown';

export default function FinancialReports({ onNavigate }) {
  
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('daily'); // daily, monthly, yearly
  const [data, setData] = useState(null);

  const fetchReport = async (selectedPeriod) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/reports/sales?period=${selectedPeriod}`);
      setData(response.data);
    } catch (error) {
      toast.error("Failed to load financial reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(period);
  }, [period]);

  const COLORS = ['#d95d39', '#1f8a70', '#1f2a36', '#465361', '#f5f1e8'];

  const SummaryCard = ({ title, value, subValue, icon: Icon, trend, link }) => (
    <div 
      className="stat-card" 
      onClick={() => link && onNavigate(link)}
      style={{ 
        cursor: link ? 'pointer' : 'default',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="stat-card-label">{title}</span>
          <h2 className="stat-card-value" style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>{value}</h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {trend && <span style={{ color: trend > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: '700' }}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>}
            {subValue}
          </div>
        </div>
        <div className="stat-card-icon brand" style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );

  if (loading && !data) {
    return <div className="loading"><div className="spinner" /> Generating reports...</div>;
  }

  return (
    <>
      <header className="top-header">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity className="nav-icon" style={{ color: 'var(--brand)' }} />
            <span className="page-title">Financial Analytics</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '4px', marginLeft: '2.4rem' }}>Performance metrics and revenue trends</p>
        </div>
        <div className="header-actions">
          <NotificationDropdown onNavigate={onNavigate} />
          <div style={{ display: 'flex', background: 'var(--surface-2)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            {['daily', 'monthly', 'yearly'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`btn btn-sm ${period === p ? 'btn-primary' : 'btn-ghost'}`}
                style={{ 
                  padding: '0.4rem 0.8rem', 
                  fontSize: '0.75rem', 
                  background: period === p ? 'var(--brand)' : 'transparent',
                  color: period === p ? '#fff' : 'var(--ink-soft)',
                  boxShadow: 'none'
                }}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <button className="btn btn-ghost" onClick={() => window.print()}>
            <Download size={18} /> Export PDF
          </button>
        </div>
      </header>

      <div className="page-content" style={{ animation: 'fadeIn 0.5s ease' }}>
        
        {/* Summary Row */}
        <div className="stat-grid">
          <SummaryCard 
            title="Total Revenue" 
            value={`Rs ${data?.totalRevenue.toLocaleString()}`} 
            subValue="All-time earnings"
            icon={DollarSign}
            trend={12}
            link="admin-sales"
          />
          <SummaryCard 
            title="Total Orders" 
            value={data?.totalOrders} 
            subValue="Completed sales"
            icon={ShoppingBag}
            trend={8}
            link="admin-sales"
          />
          <SummaryCard 
            title="Avg Order Value" 
            value={`Rs ${Math.round(data?.averageOrderValue).toLocaleString()}`} 
            subValue="Revenue per customer"
            icon={TrendingUp}
            link="admin-sales"
          />
          <SummaryCard 
            title="Items Sold" 
            value={data?.totalItemsSold} 
            subValue="Physical parts sold"
            icon={Package}
            link="admin-parts"
          />
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          
          {/* Revenue Trend */}
          <div className="table-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} color="var(--brand)" /> Revenue Trend ({period})
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
                Shows growth over {period === 'daily' ? 'last 30 days' : period === 'monthly' ? 'current year' : 'all time'}
              </div>
            </div>
            <div style={{ height: '350px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.revenueTrend}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand)" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="var(--brand)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis 
                    dataKey="label" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--ink-soft)', fontSize: 11 }}
                    dy={10}
                  />
                  <YAxis 
                    tickFormatter={(val) => `${val / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    formatter={(val) => [val.toLocaleString(), "Revenue"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="var(--brand)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div className="table-card" style={{ padding: '1.5rem' }}>
             <h3 style={{ fontSize: '1rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <PieChartIcon size={18} color="var(--brand)" /> Best Selling Parts
              </h3>
              <div style={{ height: '220px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.topParts}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="quantitySold"
                      nameKey="partName"
                    >
                      {data?.topParts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => val.toLocaleString()} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ marginTop: '1rem' }}>
                {data?.topParts.map((part, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: i < data.topParts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--ink)' }}>{part.partName}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>{part.quantitySold} units</span>
                  </div>
                ))}
              </div>
          </div>
        </div>

        <div className="table-card">
          <div className="table-toolbar" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3 style={{ fontSize: '0.9rem', fontWeight: '800', margin: 0 }}>Full Transaction Breakdown</h3>
             <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('admin-sales')}>View All Sales <ChevronRight size={14} /></button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Period</th>
                <th>Orders</th>
                <th style={{ textAlign: 'right' }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data?.revenueTrend.slice(0).reverse().map((point, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: '700' }}>{point.label}</td>
                  <td>{point.orderCount} sales</td>
                  <td style={{ textAlign: 'right', fontWeight: '800', color: 'var(--brand)' }}>Rs {point.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
      {/* --- FORMAL PRINT-ONLY REPORT TEMPLATE --- */}
      <div className="print-only-report">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '2px solid #000', paddingBottom: '1.5rem' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-1px' }}>AUTOBOLT <span style={{ color: '#d95d39' }}>ERP</span></h1>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', fontWeight: '700' }}>PREMIUM AUTOMOTIVE SOLUTIONS</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>FINANCIAL PERFORMANCE REPORT</h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>Generated: {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ border: '1px solid #000', padding: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.7rem', color: '#666' }}>TOTAL REVENUE</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>Rs {data?.totalRevenue.toLocaleString()}</div>
          </div>
          <div style={{ border: '1px solid #000', padding: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.7rem', color: '#666' }}>TOTAL ORDERS</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>{data?.totalOrders}</div>
          </div>
          <div style={{ border: '1px solid #000', padding: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.7rem', color: '#666' }}>AVG ORDER VALUE</h4>
            <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>Rs {Math.round(data?.averageOrderValue).toLocaleString()}</div>
          </div>
        </div>

        <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>TRANSACTION HISTORY BREAKDOWN</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #000', textAlign: 'left', fontSize: '0.8rem' }}>
              <th style={{ padding: '0.5rem 0' }}>PERIOD / DATE</th>
              <th>SALES COUNT</th>
              <th style={{ textAlign: 'right' }}>REVENUE</th>
            </tr>
          </thead>
          <tbody>
            {data?.revenueTrend.slice(0).reverse().map((point, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee', fontSize: '0.8rem' }}>
                <td style={{ padding: '0.5rem 0', fontWeight: '700' }}>{point.label}</td>
                <td>{point.orderCount} Transactions</td>
                <td style={{ textAlign: 'right', fontWeight: '800' }}>Rs {point.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '1rem', fontSize: '0.7rem', color: '#999', textAlign: 'center' }}>
          This is a computer-generated financial report from AutoBolt ERP. Confidential.
        </div>
      </div>

      <style>{`
        .stat-card:hover { transform: translateY(-8px) !important; box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; border-color: var(--brand-soft) !important; }
        .print-only-report { display: none; }

        @media print {
          .admin-layout > *:not(.main-content), .top-header, .page-content, .sidebar, .sidebar-overlay, .no-print {
            display: none !important;
          }

          .admin-layout, .main-content, .page-wrapper {
            margin: 0 !important; padding: 0 !important; display: block !important; width: 100% !important;
          }

          .print-only-report { 
            display: block !important; width: 100% !important; margin: 0 !important; padding: 0 !important; color: #000 !important;
          }

          body, html { background: #fff !important; height: auto !important; margin: 0 !important; }
          @page { margin: 1.5cm; size: auto; }
        }
      `}</style>
    </>
  );
}

