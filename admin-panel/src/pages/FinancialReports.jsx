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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function FinancialReports() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('daily'); // daily, monthly, yearly
  const [data, setData] = useState(null);

  const fetchReport = async (selectedPeriod) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/reports/sales?period=${selectedPeriod}`);
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
      onClick={() => link && navigate(link)}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Activity className="nav-icon" style={{ color: 'var(--brand)' }} />
          <span className="page-title">Financial Analytics</span>
        </div>
        <div className="header-actions">
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
            link="/admin/sales"
          />
          <SummaryCard 
            title="Total Orders" 
            value={data?.totalOrders} 
            subValue="Completed sales"
            icon={ShoppingBag}
            trend={8}
            link="/admin/sales"
          />
          <SummaryCard 
            title="Avg Order Value" 
            value={`Rs ${Math.round(data?.averageOrderValue).toLocaleString()}`} 
            subValue="Revenue per customer"
            icon={TrendingUp}
            link="/admin/sales"
          />
          <SummaryCard 
            title="Items Sold" 
            value={data?.totalItemsSold} 
            subValue="Physical parts sold"
            icon={Package}
            link="/admin/parts"
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
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--ink-soft)', fontSize: 11 }}
                    tickFormatter={(val) => `Rs ${val / 1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    formatter={(val) => [`Rs ${val.toLocaleString()}`, "Revenue"]}
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
                    <Tooltip />
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

        {/* Detailed Breakdown */}
        <div className="table-card">
          <div className="table-toolbar">
             <h3 style={{ fontSize: '0.9rem', fontWeight: '800' }}>Full Transaction Breakdown</h3>
             <button className="btn btn-ghost btn-sm">View All Sales <ChevronRight size={14} /></button>
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
      <style>{`
        .stat-card:hover {
          transform: translateY(-12px) scale(1.02) !important;
          box-shadow: 0 20px 40px rgba(217, 93, 57, 0.15) !important;
          border-color: var(--brand) !important;
          z-index: 10;
        }

        @media print {
          .sidebar, .top-header, .header-actions, .no-print, .nav-icon { display: none !important; }
          .admin-layout { display: block !important; }
          .main-content { margin-left: 0 !important; width: 100% !important; padding: 0 !important; display: block !important; }
          .page-content { padding: 0 !important; width: 100% !important; }
          .stat-grid { 
            display: grid !important; 
            grid-template-columns: repeat(4, 1fr) !important; 
            gap: 15px !important; 
            margin-bottom: 30px !important;
          }
          .stat-card { 
            border: 1px solid #eee !important; 
            box-shadow: none !important; 
            transform: none !important;
            break-inside: avoid;
            padding: 15px !important;
          }
          .table-card { 
            border: 1px solid #eee !important; 
            box-shadow: none !important; 
            break-inside: avoid; 
            margin-top: 20px !important;
          }
          body { background: #fff !important; margin: 0 !important; padding: 0 !important; }
          @page { size: A4 landscape; margin: 1cm; }
        }
      `}</style>
    </>
  );
}
