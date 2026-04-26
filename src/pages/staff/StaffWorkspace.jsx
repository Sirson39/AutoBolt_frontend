import React from "react";
import { staffNav, staffPages } from "../../data/siteContent";
import { Field, InvoiceRow, KpiCard, SummaryItem, TimelineItem } from "../../components/shared";

export default function StaffWorkspace({ routeKey, onNavigate }) {
  const config = staffPages[routeKey];
  const isNavActive = (key) => key === routeKey;

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
          <div className="header-actions">
            <button className="btn btn-secondary" type="button" onClick={() => onNavigate("signin")}>Sign In</button>
            <button className="btn btn-primary" type="button" onClick={() => onNavigate("home")}>Landing Page</button>
          </div>
        </div>
      </header>

      <main className="page-shell staff-page">
        <section className="staff-shell">
          <aside className="staff-sidebar">
            <div className="brand">
              <div className="brand-mark">S</div>
              <div className="brand-copy">
                <div>Staff Workspace</div>
                <span>Daily service flow</span>
              </div>
            </div>
            <p className="staff-brand-note">Fast access to registration, search, customer details, invoices, and reporting.</p>
            <nav className="staff-nav" aria-label="Staff navigation">
              {staffNav.map(([label, target]) => (
                <a key={target} className={`staff-nav-link ${isNavActive(target) ? "active" : ""}`} href={`#${target}`}>
                  {label} <span>{label.split(" ")[0]}</span>
                </a>
              ))}
            </nav>
          </aside>

          <section className="staff-main">
            <div className="staff-hero">
              <div>
                <span className="eyebrow">{config.badge}</span>
                <h1 className="page-heading">{config.title}</h1>
                <p className="page-copy">{config.hero}</p>
              </div>
              <div className="header-actions">
                <button className="btn btn-secondary" type="button" onClick={() => onNavigate("staff-dashboard")}>Dashboard</button>
                <button className="btn btn-primary" type="button" onClick={() => onNavigate("sales-invoice")}>Invoice</button>
              </div>
            </div>

            <div className="staff-banner">
              <div>
                <strong>{config.highlight}</strong>
                <div className="subtle">{config.highlightText}</div>
              </div>
              <span className="status good">Ready</span>
            </div>

            {config.form && (
              <div className="staff-grid-2">
                <article className="card">
                  <h3>Customer details</h3>
                  <form className="staff-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="field-row">
                      <Field label="Full name" placeholder="Customer name" />
                      <Field label="Phone" placeholder="98XXXXXXXX" />
                    </div>
                    <div className="field-row">
                      <Field label="Email" type="email" placeholder="name@example.com" />
                      <Field label="Address" placeholder="City or street" />
                    </div>
                    <div className="field-row">
                      <Field label="Vehicle number" placeholder="Ba 1 Cha 1234" />
                      <Field label="Vehicle type" as="select" options={["Sedan", "SUV", "Pickup", "Bike"]} />
                    </div>
                    <Field label="Notes" as="textarea" rows={4} placeholder="Any service or customer note" />
                    <div className="staff-form-actions">
                      <button type="button" className="btn btn-primary">Save registration</button>
                      <button type="button" className="btn btn-secondary" onClick={() => onNavigate("customer-details")}>View details</button>
                    </div>
                  </form>
                </article>
                <article className="card">
                  <h3>Vehicle intake checklist</h3>
                  <ul className="checklist">
                    {config.checklist.map((item, index) => (
                      <li key={item}><span className="check-dot">{index + 1}</span><span>{item}</span></li>
                    ))}
                  </ul>
                  <div className="staff-banner" style={{ marginTop: 18 }}>
                    <div>
                      <strong>Next step</strong>
                      <div className="subtle">Move straight to search, details, or invoice creation.</div>
                    </div>
                    <span className="status warn">Draft</span>
                  </div>
                </article>
              </div>
            )}

            {config.search && (
              <div className="staff-grid-2">
                <article className="card">
                  <div className="staff-toolbar">
                    <div>
                      <h3>Search records</h3>
                      <p>Use one or more fields to narrow the result quickly.</p>
                    </div>
                    <div className="staff-searchbar">
                      <input type="search" placeholder="Search by name, phone, vehicle..." />
                      <button type="button" className="btn btn-primary">Search</button>
                    </div>
                  </div>
                  <div className="staff-badge-row" style={{ marginTop: 14 }}>
                    {["Name match", "Phone match", "Vehicle number", "Invoice reference", "Service record"].map((item) => (
                      <span className="staff-badge" key={item}>{item}</span>
                    ))}
                  </div>
                </article>
                <article className="card">
                  <h3>Results</h3>
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Vehicle</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Mina Shrestha", "BA 1 CHA 1234", "Active", "good"],
                          ["Prakash Gurung", "BA 2 KHA 4421", "Needs follow-up", "warn"],
                          ["Anita Thapa", "BA 3 JA 1109", "Active", "good"],
                          ["Sujan Rai", "BA 4 PA 7841", "Overdue", "danger"]
                        ].map(([name, vehicle, status, tone]) => (
                          <tr key={name}>
                            <td>{name}</td>
                            <td>{vehicle}</td>
                            <td><span className={`status ${tone}`}>{status}</span></td>
                            <td><button className="btn btn-secondary" type="button" onClick={() => onNavigate("customer-details")}>Open</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              </div>
            )}

            {config.profile && (
              <div className="staff-grid-2">
                <article className="card">
                  <h3>Profile summary</h3>
                  <div className="staff-summary-list">
                    <SummaryItem title="Mina Shrestha" subtitle="Primary customer" status="Verified" tone="good" />
                    <SummaryItem title="9841-555-122" subtitle="Phone number" status="Reachable" tone="good" />
                    <SummaryItem title="mina@example.com" subtitle="Email address" status="Confirmed" tone="good" />
                    <SummaryItem title="Kathmandu" subtitle="Location" status="Needs update" tone="warn" />
                  </div>
                </article>
                <article className="card">
                  <h3>Staff notes</h3>
                  <ul className="checklist">
                    <li><span className="check-dot">1</span><span>Customer prefers call before service work</span></li>
                    <li><span className="check-dot">2</span><span>Invoices usually sent by email after approval</span></li>
                    <li><span className="check-dot">3</span><span>Vehicle history is linked to the same profile</span></li>
                  </ul>
                  <div className="staff-banner" style={{ marginTop: 18 }}>
                    <div>
                      <strong>Ready for handoff</strong>
                      <div className="subtle">Move from profile review to vehicle detail or billing immediately.</div>
                    </div>
                    <span className="status good">Ready</span>
                  </div>
                </article>
              </div>
            )}

            {config.vehicle && (
              <div className="staff-grid-2">
                <article className="card">
                  <h3>Vehicle summary</h3>
                  <div className="staff-summary-list">
                    <SummaryItem title="BA 1 CHA 1234" subtitle="Vehicle number" status="Active" tone="good" />
                    <SummaryItem title="Sedan" subtitle="Body type" status="Known" tone="good" />
                    <SummaryItem title="2019" subtitle="Model year" status="Recorded" tone="good" />
                    <SummaryItem title="28,430 km" subtitle="Odometer" status="Due check" tone="warn" />
                  </div>
                </article>
                <article className="card">
                  <h3>Maintenance checklist</h3>
                  <ul className="checklist">
                    <li><span className="check-dot">1</span><span>Oil service reviewed last visit</span></li>
                    <li><span className="check-dot">2</span><span>Brake pads flagged for follow-up</span></li>
                    <li><span className="check-dot">3</span><span>Battery health estimated at normal range</span></li>
                    <li><span className="check-dot">4</span><span>Next service reminder prepared</span></li>
                  </ul>
                </article>
              </div>
            )}

            {config.invoice && (
              <div className="invoice-layout">
                <article className="card invoice-box">
                  <h3>Invoice draft</h3>
                  <div className="staff-grid-2">
                    <Field label="Customer" defaultValue="Mina Shrestha" />
                    <Field label="Invoice date" defaultValue="26 Apr 2026" />
                  </div>
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td>Brake pads</td><td>2</td><td>NPR 2,000</td><td>NPR 4,000</td></tr>
                        <tr><td>Engine oil</td><td>1</td><td>NPR 1,200</td><td>NPR 1,200</td></tr>
                        <tr><td>Service labour</td><td>1</td><td>NPR 1,800</td><td>NPR 1,800</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="staff-form-actions">
                    <button type="button" className="btn btn-secondary">Add item</button>
                    <button type="button" className="btn btn-primary">Save invoice</button>
                  </div>
                </article>
                <article className="card invoice-total">
                  <h3>Summary</h3>
                  <InvoiceRow label="Subtotal" value="NPR 7,000" />
                  <InvoiceRow label="Tax" value="NPR 840" />
                  <InvoiceRow label="Discount" value="- NPR 0" />
                  <InvoiceRow label="Total" value="NPR 7,840" />
                  <div className="staff-banner" style={{ marginTop: 8 }}>
                    <div>
                      <strong>Billing status</strong>
                      <div className="subtle">Invoice can be saved, printed, or emailed next.</div>
                    </div>
                    <span className="status good">Draft</span>
                  </div>
                  <div className="staff-form-actions">
                    <button className="btn btn-primary" type="button" onClick={() => onNavigate("email-invoice")}>Email now</button>
                    <button className="btn btn-secondary" type="button" onClick={() => onNavigate("customer-history")}>View history</button>
                  </div>
                </article>
              </div>
            )}

            {config.email && (
              <div className="staff-grid-2">
                <article className="card">
                  <h3>Email composer</h3>
                  <form className="staff-form" onSubmit={(e) => e.preventDefault()}>
                    <Field label="To" type="email" defaultValue="mina@example.com" />
                    <Field label="Subject" defaultValue="Your AutoBolt invoice is ready" />
                    <Field label="Message" as="textarea" rows={7} defaultValue="Hello Mina, your service invoice is attached. Please review the breakdown and let us know if you need anything adjusted." />
                    <div className="staff-form-actions">
                      <button type="button" className="btn btn-primary">Send email</button>
                      <button type="button" className="btn btn-secondary">Save draft</button>
                    </div>
                  </form>
                </article>
                <article className="card">
                  <h3>Invoice preview</h3>
                  <div className="staff-summary-list">
                    <SummaryItem title="Invoice #AB-2048" subtitle="Draft attached" status="Ready" tone="good" />
                    <SummaryItem title="NPR 7,840" subtitle="Total amount" status="Pending send" tone="warn" />
                    <SummaryItem title="mina@example.com" subtitle="Customer email" status="Verified" tone="good" />
                  </div>
                  <div className="staff-banner" style={{ marginTop: 18 }}>
                    <div>
                      <strong>Recent sends</strong>
                      <div className="subtle">Track what was emailed and when it was sent.</div>
                    </div>
                    <span className="status good">History linked</span>
                  </div>
                  <ul className="checklist" style={{ marginTop: 14 }}>
                    <li><span className="check-dot">1</span><span>Invoice attached to email</span></li>
                    <li><span className="check-dot">2</span><span>Customer address verified</span></li>
                    <li><span className="check-dot">3</span><span>Send log available in history</span></li>
                  </ul>
                </article>
              </div>
            )}

            {config.history && (
              <>
                <div className="staff-grid-2">
                  <article className="card">
                    <h3>Timeline</h3>
                    <div className="timeline" style={{ marginTop: 12 }}>
                      <TimelineItem title="Today" text="Battery reminder created and added to follow-up queue." />
                      <TimelineItem title="18 Apr 2026" text="Service appointment completed with invoice sent by email." />
                      <TimelineItem title="07 Apr 2026" text="Brake check completed and parts suggested." />
                      <TimelineItem title="10 Mar 2026" text="Oil filter purchased from the parts counter." />
                    </div>
                  </article>
                  <article className="card">
                    <h3>Summary</h3>
                    <div className="staff-summary-list">
                      <SummaryItem title="6 service visits" subtitle="Year to date" status="Stable" tone="good" />
                      <SummaryItem title="18 purchases" subtitle="Parts history" status="Tracked" tone="good" />
                      <SummaryItem title="2 reminders" subtitle="Follow-up queue" status="Open" tone="warn" />
                    </div>
                  </article>
                </div>
                <article className="card">
                  <h3>Record table</h3>
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Reference</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td>Today</td><td>Reminder</td><td>Battery review</td><td><span className="status warn">Pending</span></td></tr>
                        <tr><td>18 Apr 2026</td><td>Service</td><td>Invoice AB-2048</td><td><span className="status good">Closed</span></td></tr>
                        <tr><td>07 Apr 2026</td><td>Repair</td><td>Brake check</td><td><span className="status good">Closed</span></td></tr>
                        <tr><td>10 Mar 2026</td><td>Purchase</td><td>Oil filter</td><td><span className="status good">Closed</span></td></tr>
                      </tbody>
                    </table>
                  </div>
                </article>
              </>
            )}

            {config.reports && (
              <>
                <div className="staff-kpis">
                  <KpiCard kpi={{ label: "Repeat customers", value: "68%", delta: "Strong retention" }} />
                  <KpiCard kpi={{ label: "Open follow-ups", value: "12", delta: "Needs attention" }} />
                  <KpiCard kpi={{ label: "Invoices closed", value: "91%", delta: "Healthy billing flow" }} />
                  <KpiCard kpi={{ label: "Services on time", value: "74%", delta: "Improving trend" }} />
                </div>
                <div className="staff-grid-2">
                  <article className="card">
                    <h3>Report breakdown</h3>
                    <div className="report-list" style={{ marginTop: 12 }}>
                      {[
                        ["Customer registrations", 82],
                        ["Service completion", 74],
                        ["Invoice delivery", 91],
                        ["Follow-up closure", 55]
                      ].map(([label, value]) => (
                        <div className="report-row" key={label}>
                          <div className="report-head"><span>{label}</span><span>{value}%</span></div>
                          <div className="progress"><span style={{ width: `${value}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </article>
                  <article className="card">
                    <h3>Report notes</h3>
                    <ul className="checklist">
                      <li><span className="check-dot">1</span><span>Keep the follow-up queue visible to staff</span></li>
                      <li><span className="check-dot">2</span><span>Track repeat service and repeat purchase trends</span></li>
                      <li><span className="check-dot">3</span><span>Use the report to support billing and reminders</span></li>
                    </ul>
                    <div className="staff-form-actions" style={{ marginTop: 18 }}>
                      <button type="button" className="btn btn-primary">Export report</button>
                      <button type="button" className="btn btn-secondary">Refresh</button>
                    </div>
                  </article>
                </div>
                <article className="card">
                  <h3>Monthly snapshot</h3>
                  <div className="table-wrap">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Metric</th>
                          <th>Current</th>
                          <th>Previous</th>
                          <th>Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td>New customers</td><td>24</td><td>19</td><td><span className="status good">Up</span></td></tr>
                        <tr><td>Completed services</td><td>31</td><td>28</td><td><span className="status good">Up</span></td></tr>
                        <tr><td>Open reminders</td><td>12</td><td>9</td><td><span className="status warn">Watch</span></td></tr>
                        <tr><td>Invoices emailed</td><td>26</td><td>22</td><td><span className="status good">Up</span></td></tr>
                      </tbody>
                    </table>
                  </div>
                </article>
              </>
            )}
          </section>
        </section>
      </main>
    </>
  );
}
