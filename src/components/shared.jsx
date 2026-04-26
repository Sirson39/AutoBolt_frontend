import React, { useId } from "react";

export function FeatureCard({ title, text }) {
  return (
    <article className="card role-card">
      <span className="role-badge">{title}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export function RoleCard({ role, data, onNavigate }) {
  return (
    <article className="card role-card">
      <span className="role-badge">{data.badge}</span>
      <h3>{data.title}</h3>
      <p>{data.description}</p>
      <ul className="role-list">
        {data.items.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <div style={{ marginTop: 18 }}>
        <button className="btn btn-secondary" type="button" onClick={() => onNavigate(role)}>
          Open {capitalize(role)}
        </button>
      </div>
    </article>
  );
}

export function Metric({ title, text }) {
  return (
    <div className="metric">
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

export function KpiCard({ kpi }) {
  return (
    <article className="card kpi">
      <span>{kpi.label}</span>
      <strong>{kpi.value}</strong>
      <small>{kpi.delta}</small>
    </article>
  );
}

export function SigninFields() {
  return (
    <>
      <Field label="Email" type="email" placeholder="name@example.com" />
      <Field label="Password" type="password" placeholder="Enter password" />
      <div className="field-row">
        <Field label="Workspace" as="select" options={["Admin", "Staff", "Customer"]} />
        <Field label="Demo code" placeholder="Optional" />
      </div>
    </>
  );
}

export function SignupFields() {
  return (
    <>
      <div className="field-row">
        <Field label="Full name" placeholder="Your name" />
        <Field label="Register as" as="select" options={["Customer", "Staff", "Admin"]} />
      </div>
      <div className="field-row">
        <Field label="Email" type="email" placeholder="name@example.com" />
        <Field label="Phone" type="tel" placeholder="98XXXXXXXX" />
      </div>
      <div className="field-row">
        <Field label="Password" type="password" placeholder="Create password" />
        <Field label="Confirm password" type="password" placeholder="Repeat password" />
      </div>
      <Field label="Notes" as="textarea" rows={3} placeholder="Optional vehicle or business note" />
    </>
  );
}

export function Field({ label, as = "input", options = [], ...props }) {
  const autoId = useId();
  const id = props.id || `${label.toLowerCase().replace(/\s+/g, "-")}-${autoId.replace(/:/g, "")}`;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {as === "select" ? (
        <select id={id} {...props}>
          {options.map((option) => <option key={option}>{option}</option>)}
        </select>
      ) : as === "textarea" ? (
        <textarea id={id} {...props} />
      ) : (
        <input id={id} {...props} />
      )}
    </div>
  );
}

export function SummaryItem({ title, subtitle, status, tone }) {
  return (
    <div className="staff-summary-item">
      <div>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
      <span className={`status ${tone}`}>{status}</span>
    </div>
  );
}

export function InvoiceRow({ label, value }) {
  return (
    <div className="invoice-total-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function TimelineItem({ title, text }) {
  return (
    <div className="timeline-item">
      <div></div>
      <div>
        <h4>{title}</h4>
        <p>{text}</p>
      </div>
    </div>
  );
}

export function priorityText(priority) {
  return {
    good: "Healthy",
    warn: "Watch",
    danger: "Urgent"
  }[priority] || priority;
}

export function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
