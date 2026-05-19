import React, { useState, useEffect } from "react";
import RoleDashboardView from "../shared/RoleDashboardView";
import { dashboardData } from "../../data/siteContent";
import { clearAuth, getUser } from "../../utils/auth";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { CalendarDays, Wrench, Star, Car, FileText, ChevronRight, TrendingUp } from "lucide-react";

const QUICK_ACTIONS = [
  { label: 'My Bookings',    route: 'customer-bookings',      icon: CalendarDays, color: '#2563eb' },
  { label: 'Part Requests',  route: 'customer-part-requests', icon: Wrench,       color: '#7c3aed' },
  { label: 'My Reviews',     route: 'customer-reviews',       icon: Star,         color: '#d97706' },
  { label: 'My Vehicles',    route: 'customer-vehicles',      icon: Car,          color: '#059669' },
  { label: 'Service History',route: 'customer-history',       icon: FileText,     color: '#dc2626' },
];

const RISK_COLORS = { Low: '#16a34a', Moderate: '#d97706', High: '#ea580c', Critical: '#dc2626' };
const RISK_BG = { Low: '#f0fdf4', Moderate: '#fffbeb', High: '#fff7ed', Critical: '#fef2f2' };

export default function CustomerDashboard({ onNavigate }) {
  const currentUser = getUser();
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [myInvoices, setMyInvoices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fallback to empty array if customerId is missing (e.g. admin viewing as customer)
        const custId = currentUser?.customerId || currentUser?.id;
        
        const [invoicesRes, vehiclesRes, predictionsRes] = await Promise.all([
          api.get('/api/invoices'),
          custId ? api.get(`/api/vehicles/customer/${custId}`) : { data: [] },
          custId ? api.get(`/api/vehicles/customer/${custId}/predictions`).catch(() => ({ data: [] })) : { data: [] }
        ]);
        setPredictions(Array.isArray(predictionsRes.data) ? predictionsRes.data : []);

        // Filter invoices to just this customer
        const myInvoices = custId ? invoicesRes.data.filter(i => String(i.customerId) === String(custId)) : [];
        setMyInvoices(myInvoices);
        const myVehicles = vehiclesRes.data || [];

        // Build dynamic dashboard data
        const baseData = dashboardData.customer;
        
        // Calculate items purchased safely
        let itemsPurchased = 0;
        myInvoices.forEach(inv => {
          if (inv.items && Array.isArray(inv.items)) {
            itemsPurchased += inv.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
          } else {
            itemsPurchased += 1; // Fallback if items array isn't populated
          }
        });

        // Create rows for recent activity
        const recentRows = myInvoices.slice(0, 4).map(inv => [
          `Invoice ${inv.invoiceNumber || '#' + inv.id}`, 
          'Completed', 
          new Date(inv.invoiceDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }), 
          'good'
        ]);

        if (recentRows.length === 0 && myVehicles.length > 0) {
          recentRows.push([
            myVehicles[0].model || myVehicles[0].registrationNumber,
            'Registered',
            'Active',
            'good'
          ]);
        }

        const predData = Array.isArray(predictionsRes.data) ? predictionsRes.data : [];
        const alertCount = predData.filter(p => p.riskLevel !== 'Low').length;

        setLiveData({
          ...baseData,
          kpis: [
            { label: "Vehicles Registered", value: myVehicles.length.toString(), delta: "Active fleet" },
            { label: "Service Invoices", value: myInvoices.length.toString(), delta: "Total visits" },
            { label: "Items Purchased", value: itemsPurchased.toString(), delta: "Parts & services" },
            { label: "AI Alerts", value: alertCount.toString(), delta: alertCount > 0 ? "Vehicles need attention" : "All vehicles healthy" }
          ],
          rows: recentRows.length > 0 ? recentRows : [["No recent activity", "-", "-", "warn"]]
        });

      } catch (err) {
        console.error(err);
        toast.error("Failed to load customer dashboard data");
        setLiveData(dashboardData.customer); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleLogout = () => {
    clearAuth();
    onNavigate('signin');
  };

  if (loading) {
    return <div className="loading"><div className="spinner" /> Loading your dashboard...</div>;
  }

  const data = liveData || dashboardData.customer;

  // Calculate monthly expenses dynamically (last 6 months)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const expensesByMonth = {};
  myInvoices.forEach(inv => {
    const date = new Date(inv.invoiceDate);
    const m = months[date.getMonth()];
    expensesByMonth[m] = (expensesByMonth[m] || 0) + (inv.totalAmount || 0);
  });

  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    last6Months.push(months[d.getMonth()]);
  }

  const chartData = last6Months.map(m => ({
    month: m,
    amount: expensesByMonth[m] || 0
  }));

  const maxAmount = Math.max(...chartData.map(c => c.amount), 0) || 100;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Stat Cards */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {data.kpis.map((kpi) => {
          let route = null;
          if (kpi.label === "Vehicles Registered") route = "customer-vehicles";
          else if (kpi.label === "Service Invoices") route = "customer-history";
          else if (kpi.label === "Items Purchased") route = "customer-part-requests";
          else if (kpi.label === "AI Alerts") route = "customer-vehicles";

          return (
            <div 
              key={kpi.label} 
              className="stat-card" 
              onClick={() => route && onNavigate(route)}
              style={{ 
                padding: '1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.25rem',
                cursor: route ? 'pointer' : 'default',
                transition: 'all 0.2s ease'
              }}
            >
              <span className="stat-card-label">{kpi.label}</span>
              <h2 className="stat-card-value" style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>{kpi.value}</h2>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--success)', marginTop: '0.25rem', display: 'block' }}>
                {kpi.delta}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left Column (Tables & Charts) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Dynamic Monthly Expenses Chart */}
          <div className="table-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontWeight: '800', fontSize: '0.95rem', margin: 0 }}>Monthly Service Expenses</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', margin: 0 }}>Track spending on vehicle servicing and custom parts</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--success-light)', color: 'var(--success)', padding: '4px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: '800' }}>
                <TrendingUp size={14} /> Rs. {chartData.reduce((s, c) => s + c.amount, 0).toLocaleString()} Total
              </div>
            </div>

            {/* Bar Chart Graphics */}
            <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', position: 'relative', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              {/* Grid Helper Lines */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
                <div style={{ borderTop: '1px dashed var(--border)', opacity: 0.3, width: '100%', height: 0 }} />
                <div style={{ borderTop: '1px dashed var(--border)', opacity: 0.3, width: '100%', height: 0 }} />
                <div style={{ borderTop: '1px dashed var(--border)', opacity: 0.3, width: '100%', height: 0 }} />
              </div>

              {chartData.map(c => {
                const heightPercent = maxAmount > 0 ? (c.amount / maxAmount) * 100 : 0;
                return (
                  <div key={c.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', width: '50px', height: '100%', zIndex: 1, position: 'relative' }}>
                    {/* Tooltip */}
                    <div className="chart-tooltip" style={{
                      position: 'absolute', bottom: `${c.amount > 0 ? Math.max(heightPercent, 8) + 15 : 20}%`, background: 'var(--ink)', color: '#fff', 
                      padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '800', 
                      whiteSpace: 'nowrap', opacity: 0, transform: 'translateY(10px)', transition: 'all 0.2s ease', 
                      boxShadow: 'var(--shadow-md)', pointerEvents: 'none'
                    }}>
                      Rs. {c.amount.toLocaleString()}
                    </div>

                    {/* Bar */}
                    <div 
                      style={{
                        height: c.amount > 0 ? `${Math.max(heightPercent, 8)}%` : '0%',
                        width: '100%',
                        background: c.amount > 0 ? 'linear-gradient(to top, var(--brand), var(--brand-deep))' : 'transparent',
                        borderRadius: '6px 6px 0 0',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={e => {
                        if (c.amount > 0) {
                          e.currentTarget.style.filter = 'brightness(1.1)';
                          e.currentTarget.style.transform = 'scaleX(1.05)';
                        }
                        const tt = e.currentTarget.parentElement.querySelector('.chart-tooltip');
                        if (tt) { tt.style.opacity = '1'; tt.style.transform = 'translateY(0)'; }
                      }}
                      onMouseLeave={e => {
                        if (c.amount > 0) {
                          e.currentTarget.style.filter = 'none';
                          e.currentTarget.style.transform = 'scaleX(1)';
                        }
                        const tt = e.currentTarget.parentElement.querySelector('.chart-tooltip');
                        if (tt) { tt.style.opacity = '0'; tt.style.transform = 'translateY(10px)'; }
                      }}
                    />
                    <span style={{ position: 'absolute', bottom: '-1.5rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--ink-soft)' }}>{c.month}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
              <span>Monthly Average Spend: <strong>Rs. {Math.round(chartData.reduce((s, c) => s + c.amount, 0) / 6).toLocaleString()}</strong></span>
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>* Live calculations from completed invoices</span>
            </div>
          </div>

          {/* Side-by-Side Table and Activity Mix Container */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '1.5rem' }}>
            
            {/* History and Status Table */}
            <div 
              className="table-card" 
              onClick={() => onNavigate('customer-history')}
              style={{ 
                padding: '1.5rem', 
                height: 'fit-content',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid var(--border)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'var(--brand)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontWeight: '800', fontSize: '0.95rem', margin: 0 }}>History and status</h3>
                <ChevronRight size={16} color="var(--ink-soft)" style={{ opacity: 0.6 }} />
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', marginBottom: '1.25rem' }}>
                Overview of your recent invoices, registered vehicles, and activity updates.
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map(([item, status, time, priority]) => (
                    <tr key={`${item}-${time}`}>
                      <td style={{ fontWeight: '700' }}>{item}</td>
                      <td>{status}</td>
                      <td>{time}</td>
                      <td>
                        <span className={`badge ${priority === 'good' ? 'badge-success' : priority === 'warn' ? 'badge-warning' : 'badge-brand'}`}>
                          {priority.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Activity Mix */}
            <div className="table-card" style={{ padding: '1.5rem', height: 'fit-content' }}>
              <h3 style={{ fontWeight: '800', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Activity mix</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', marginBottom: '1.25rem' }}>
                Service breakdown.
              </p>
              <div className="chart-list">
                {data.chart.map(([label, value]) => (
                  <div className="chart-row" key={label} style={{ marginBottom: '10px' }}>
                    <div className="chart-row-head" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                      <span>{label}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="progress" style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                      <span style={{ display: 'block', height: '100%', width: `${value}%`, background: 'var(--brand)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column (Quick Actions & Diagnostics) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Quick Actions (Vertical Lists matching admin) */}
          <div className="table-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h3 style={{ fontWeight: '800', fontSize: '0.95rem', marginBottom: '0.25rem' }}>Quick Actions</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', marginBottom: '0.5rem' }}>
              Common shortcuts to manage your vehicles, check part requests, or schedule a service.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {QUICK_ACTIONS.map(({ label, route, icon: Icon, color }, index) => (
                <button
                  key={route}
                  onClick={() => onNavigate(route)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.9rem 1.25rem',
                    borderRadius: '12px',
                    border: index === 0 ? `1.5px solid ${color}50` : '1px solid var(--border)',
                    background: index === 0 ? `${color}05` : 'var(--surface)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateX(6px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.borderColor = color;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = index === 0 ? `${color}50` : 'var(--border)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: `${color}12`,
                      color: color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={18} />
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--ink)' }}>{label}</span>
                  </div>
                  <ChevronRight size={16} color="var(--ink-soft)" style={{ opacity: 0.6 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Health Overview */}
          {predictions.length > 0 && (
            <div 
              className="table-card" 
              onClick={() => onNavigate('customer-vehicles')}
              style={{ 
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid var(--border)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'var(--brand)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: '800', fontSize: '0.95rem', margin: 0 }}>Vehicle Diagnostics</h3>
                <ChevronRight size={16} color="var(--ink-soft)" style={{ opacity: 0.6 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {predictions.map(p => (
                  <div key={p.vehicleId} style={{
                    padding: '0.85rem 1rem', borderRadius: '10px',
                    background: RISK_BG[p.riskLevel] || '#f9fafb',
                    borderLeft: `4px solid ${RISK_COLORS[p.riskLevel] || '#6b7280'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: '800', fontSize: '0.85rem', color: 'var(--ink)' }}>
                        {p.licensePlate}
                      </span>
                      <span style={{
                        padding: '1px 8px', borderRadius: '999px', fontSize: '0.68rem', fontWeight: '800',
                        background: RISK_COLORS[p.riskLevel] + '20',
                        color: RISK_COLORS[p.riskLevel],
                        textTransform: 'uppercase'
                      }}>
                        {p.riskLevel}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', fontWeight: 600 }}>{p.make} {p.model}</span>
                    {p.predictions.length === 0 ? (
                      <p style={{ fontSize: '0.78rem', color: '#16a34a', margin: '4px 0 0', fontWeight: 600 }}>Healthy</p>
                    ) : (
                      <ul style={{ margin: '4px 0 0', paddingLeft: '1rem', fontSize: '0.78rem', color: 'var(--ink-soft)' }}>
                        {p.predictions.slice(0, 2).map((msg, i) => <li key={i}>{msg}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
