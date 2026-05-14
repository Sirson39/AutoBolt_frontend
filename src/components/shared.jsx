import React, { useId } from "react";
import { Car, ShieldCheck, Users } from "lucide-react";

export function FeatureCard({ title, text, icon: Icon }) {
  return (
    <article className="card feature-card">
      <div className="feature-icon">
        {Icon ? <Icon size={22} strokeWidth={2.1} /> : <span aria-hidden="true">*</span>}
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export function BenefitCard({ title, text, icon: Icon }) {
  return (
    <article className="card benefit-card">
      <div className="feature-icon benefit-icon">
        {Icon ? <Icon size={22} strokeWidth={2.1} /> : <span aria-hidden="true">*</span>}
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export function RoleCard({ role, data }) {
  const Icon = {
    admin: ShieldCheck,
    staff: Users,
    customer: Car
  }[role] || ShieldCheck;

  return (
    <article className={`card role-card role-card-${role}`}>
      <div className="role-icon">
        <Icon size={24} strokeWidth={2.15} />
      </div>
      <div className="role-content">
        <span className="role-label">{data.badge}</span>
        <h3>{capitalize(role)}</h3>
        <p className="role-summary">{data.description}</p>
        <ul className="role-list">
          {data.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
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

export function CompactCard({ title, text, icon: Icon }) {
  return (
    <article className="card compact-card" style={{ padding: '1.5rem' }}>
      <div className="card-icon" style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
        {Icon ? <Icon size={20} strokeWidth={2} /> : <span aria-hidden="true">*</span>}
      </div>
      <h4 style={{ marginBottom: '0.5rem' }}>{title}</h4>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem' }}>{text}</p>
    </article>
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
        <Field label="Role / Workspace" as="select" options={["Admin", "Staff", "Customer"]} />
        <Field label="Workspace note" placeholder="Optional" />
      </div>
    </>
  );
}

export function SignupFields() {
  return (
    <>
      <div className="field-row">
        <Field label="Full Name" placeholder="Your name" />
        <Field label="Register As" as="select" options={["Customer", "Staff", "Admin"]} />
      </div>
      <div className="field-row">
        <Field label="Email" type="email" placeholder="name@example.com" />
        <Field label="Phone" type="tel" placeholder="98XXXXXXXX" />
      </div>
      <div className="field-row">
        <Field label="Password" type="password" placeholder="Create password" />
        <Field label="Confirm Password" type="password" placeholder="Repeat password" />
      </div>
      <Field label="Vehicle or Business Notes" as="textarea" rows={3} placeholder="Optional vehicle or business note" />
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
