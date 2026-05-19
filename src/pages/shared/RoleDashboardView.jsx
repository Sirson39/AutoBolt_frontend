import React from "react";
import { KpiCard, priorityText } from "../../components/shared";

export default function RoleDashboardView({ role, data, onNavigate, onLogout, currentUser, children }) {
  const title = role === "admin" ? "Admin Panel" : role === "staff" ? "Staff Panel" : "Customer Panel";

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good morning';
    if (hrs < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <main className="page-shell">
        <section className="dashboard-shell">
          <aside className="sidebar no-print">
            <div className="brand" style={{ marginBottom: 24 }}>
              <div className="brand-mark">A</div>
              <div className="brand-copy">
                <div>AutoBolt</div>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{title}</span>
              </div>
            </div>
            
            <div className="sidebar-section">
              <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 800, margin: '0 0 10px 10px', letterSpacing: '0.05em' }}>Overview</p>
              <button className="sidebar-link active" onClick={() => onNavigate('customer')} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <span className="dot"></span> Dashboard
              </button>

              <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 800, margin: '20px 0 10px 10px', letterSpacing: '0.05em' }}>My Services</p>
              <button className="sidebar-link" onClick={() => onNavigate('customer-bookings')} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <span className="dot"></span> My Bookings
              </button>
              <button className="sidebar-link" onClick={() => onNavigate('customer-part-requests')} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <span className="dot"></span> Part Requests
              </button>
              <button className="sidebar-link" onClick={() => onNavigate('customer-reviews')} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <span className="dot"></span> Service Reviews
              </button>
              <button className="sidebar-link" onClick={() => onNavigate('customer-vehicles')} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <span className="dot"></span> My Vehicles
              </button>
              <button className="sidebar-link" onClick={() => onNavigate('customer-history')} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <span className="dot"></span> Service History
              </button>
            </div>

            <div style={{ marginTop: 'auto', padding: '16px 12px 12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              {currentUser && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 700, marginBottom: 2 }}>
                    {currentUser.fullName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.email}
                  </div>
                </div>
              )}
              <button
                className="sidebar-link"
                style={{ color: '#e53e3e', width: '100%', border: 'none', background: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', cursor: 'pointer', paddingLeft: 8 }}
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          </aside>

          <main className="dashboard-main">
            <div className="dashboard-top">
              <div>
                <span className="eyebrow" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{role.toUpperCase()} WORKSPACE</span>
                <h1 className="dashboard-title">{getGreeting()}, {currentUser?.fullName?.split(' ')[0] || 'User'} 👋</h1>
                <p className="section-copy" style={{ marginTop: 4 }}>• LIVE SYSTEM • {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
              </div>
              <div className="header-actions">
                <button className="btn btn-secondary" type="button" onClick={() => onNavigate("home")}>Back to landing</button>
              </div>
            </div>

            <div className="kpi-grid">
              {data.kpis.map((kpi) => <KpiCard key={kpi.label} kpi={kpi} />)}
            </div>

            <div className="banner">
              <div>
                <strong>{data.leftTitle}</strong>
                <div className="subtle">{data.leftBody}</div>
              </div>
              <span className="status good">Ready</span>
            </div>

            <div className="panel-grid">
              <article className="card">
                <h3>{role === "customer" ? "History and status" : "Operational data"}</h3>
                <p>{role === "customer"
                  ? "This table groups orders, bookings, and AI updates to provide a clear overview of customer interactions."
                  : "The table below is a quick mock of the lists that would normally come from the backend."}
                </p>
                <div className="table-wrap">
                  <table className="table">
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
                          <td>{item}</td>
                          <td>{status}</td>
                          <td>{time}</td>
                          <td><span className={`status ${priority}`}>{priorityText(priority)}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <div className="grid-2" style={{ alignContent: "start" }}>
                <article className="card">
                  <h3>{data.rightTitle}</h3>
                  <p>{data.rightBody}</p>
                  <ul className="role-list" style={{ marginTop: 14 }}>
                    {data.tasks.map((task) => <li key={task}>{task}</li>)}
                  </ul>
                </article>
                <article className="card">
                  <h3>Activity mix</h3>
                  <p>Small visual indicators keep the interface light while still making the activity mix easy to scan.</p>
                  <div className="chart-list">
                    {data.chart.map(([label, value]) => (
                      <div className="chart-row" key={label}>
                        <div className="chart-row-head">
                          <span>{label}</span>
                          <span>{value}%</span>
                        </div>
                        <div className="progress"><span style={{ width: `${value}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            </div>
            {children}
          </main>
        </section>
      </main>
    </>
  );
}
