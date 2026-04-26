import React from "react";
import { KpiCard, priorityText } from "../../components/shared";

export default function RoleDashboardView({ role, data, onNavigate }) {
  const title = role === "admin" ? "Admin dashboard" : role === "staff" ? "Staff dashboard" : "Customer dashboard";

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#home" aria-label="AutoBolt home">
            <div className="brand-mark">A</div>
            <div className="brand-copy">
              <div>AutoBolt</div>
              <span>Vehicle Parts Management</span>
            </div>
          </a>
          <nav className="header-nav" aria-label="Primary navigation">
            <a className="header-link" href="#home">Landing</a>
            <a className="header-link" href="#signin">Sign In</a>
            <a className="header-link" href="#signup">Sign Up</a>
            <a className={`header-link ${role === "admin" ? "active" : ""}`} href="#admin">Admin</a>
            <a className={`header-link ${role === "staff" ? "active" : ""}`} href="#staff">Staff</a>
            <a className={`header-link ${role === "customer" ? "active" : ""}`} href="#customer">Customer</a>
          </nav>
          <div className="header-actions">
            <button className="btn btn-secondary" type="button" onClick={() => onNavigate("signin")}>Switch account</button>
            <button className="btn btn-primary" type="button" onClick={() => onNavigate("home")}>Back to landing</button>
          </div>
        </div>
      </header>

      <main className="page-shell">
        <section className="dashboard-shell">
          <aside className="sidebar">
            <div className="brand" style={{ marginBottom: 16 }}>
              <div className="brand-mark">A</div>
              <div className="brand-copy">
                <div>{title}</div>
                <span>Role preview</span>
              </div>
            </div>
            <p className="subtle">{data.subtitle}</p>
            <div className="sidebar-section">
              <a className="sidebar-link active" href={`#${role}`}><span className="dot"></span> Overview</a>
              <a className="sidebar-link" href={`#${role}`}><span className="dot"></span> Activities</a>
              <a className="sidebar-link" href={`#${role}`}><span className="dot"></span> Reports</a>
              <a className="sidebar-link" href={`#${role}`}><span className="dot"></span> Messages</a>
              <a className="sidebar-link" href="#home"><span className="dot"></span> Back to landing</a>
            </div>
          </aside>

          <main className="dashboard-main">
            <div className="dashboard-top">
              <div>
                <span className="eyebrow">{role.charAt(0).toUpperCase() + role.slice(1)} workspace</span>
                <h1 className="dashboard-title">{data.title}</h1>
                <p className="section-copy">{data.subtitle}</p>
              </div>
              <div className="header-actions">
                <button className="btn btn-secondary" type="button" onClick={() => onNavigate("signin")}>Sign In</button>
                <button className="btn btn-primary" type="button" onClick={() => onNavigate("home")}>Back to landing</button>
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
              <span className="status good">UI-ready</span>
            </div>

            <div className="panel-grid">
              <article className="card">
                <h3>{role === "customer" ? "History and status" : "Operational data"}</h3>
                <p>{role === "customer"
                  ? "This table groups orders, bookings, and AI updates the way the coursework scenario describes the customer area."
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
                  <p>Small visual indicators are enough for this prototype and keep the UI light without extra dependencies.</p>
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
          </main>
        </section>
      </main>
    </>
  );
}
