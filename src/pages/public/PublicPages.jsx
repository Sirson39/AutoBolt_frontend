import React from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Boxes,
  BrainCircuit,
  Mail,
  MapPin,
  Package,
  ShieldCheck,
  Sparkles,
  ShoppingCart
} from "lucide-react";
import { benefits, features, footerNav, roleCards } from "../../data/siteContent";
import { BenefitCard, FeatureCard, RoleCard, SigninFields, SignupFields } from "../../components/shared";

const aboutCards = [
  {
    label: "Our Mission",
    title: "Streamlining Parts Operations",
    text: "AutoBolt brings inventory, invoicing, vendor management, and customer records into one unified platform so service centres can focus on vehicles, not spreadsheets.",
    icon: Boxes
  },
  {
    label: "Role-Based Platform",
    title: "Designed Around Your Team",
    text: "Every role gets exactly what they need. Admins control stock and financials. Staff handle customers and sales. Customers self-serve, book appointments, and track their history.",
    icon: ShieldCheck
  },
  {
    label: "Smart by Design",
    title: "AI-Driven Intelligence",
    text: "AutoBolt's built-in AI analyses vehicle usage patterns to predict part failures before they happen, while automated alerts keep the team ahead of low stock and overdue payments.",
    icon: BrainCircuit
  }
];

const contactCards = [
  {
    label: "General Enquiries",
    title: "Email Us",
    text: "support@autobolt.io - For platform questions, feature requests, or account help. We typically respond within 24 hours on business days.",
    icon: Mail
  },
  {
    label: "Business Hours",
    title: "Support Hours",
    text: "Monday to Friday, 9:00 AM - 6:00 PM (NPT). Our support team is available to assist with onboarding, technical issues, and training.",
    icon: Clock3
  },
  {
    label: "Location",
    title: "Kathmandu, Nepal",
    text: "Illustrative project location for coursework use only. Serving vehicle service and parts businesses across Nepal.",
    icon: MapPin
  },
  {
    label: "Request a Demo",
    title: "See It Live",
    text: "Want to see AutoBolt in action before committing? Book a free walkthrough and we'll show you how it fits your service centre's workflow.",
    icon: Sparkles
  }
];

function Shell({ route, onNavigate, publicNav, children, footerText }) {
  const navLinks = publicNav.filter((item) => item.kind !== "action");
  const actionLinks = publicNav.filter((item) => item.kind === "action");

  return (
    <>
      <header className={`site-header ${route === "home" ? "home-header" : ""}`}>
        <div className="header-inner">
          <a className="brand" href="#home" aria-label="AutoBolt home">
            <div className="brand-mark">A</div>
            <div className="brand-copy">
              <div>AutoBolt</div>
              <span>Vehicle Parts Management</span>
            </div>
          </a>

          <nav className="header-nav" aria-label="Primary navigation">
            {navLinks.map((item) => {
              const active = item.kind === "section" ? route === item.target : route === item.target;

              return (
                <a
                  key={item.target}
                  className={`header-link ${active ? "active" : ""}`}
                  href={`#${item.target}`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="header-actions-group">
            {actionLinks.map((item) => {
              const variant = item.target === "signup" ? "header-link-primary" : "header-link-secondary";
              const active = route === item.target;

              return (
                <a
                  key={item.target}
                  className={`header-link-action ${variant} ${active ? "active" : ""}`}
                  href={`#${item.target}`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      </header>

      <main className="page-shell">{children}</main>

      <footer className="page-footer">
        <div className="footer-copy">
          <div className="footer-brand">AutoBolt</div>
          <p>{footerText}</p>
        </div>
        <nav className="footer-nav" aria-label="Footer navigation">
          {footerNav.map((item) => (
            <a key={item.target} href={`#${item.target}`}>
              {item.label}
            </a>
          ))}
        </nav>
      </footer>
    </>
  );
}

function SectionHeading({ eyebrow, title, copy, centered = false }) {
  return (
    <div className={`section-header ${centered ? "section-header-centered" : ""}`}>
      <div className="eyebrow eyebrow-light">{eyebrow}</div>
      <h2 className="section-title">{title}</h2>
      {copy ? <p className="section-copy section-copy-center">{copy}</p> : null}
    </div>
  );
}

function InfoCard({ title, text, icon: Icon }) {
  return (
    <article className="card info-card">
      <div className="feature-icon">
        {Icon ? <Icon size={20} strokeWidth={2.15} /> : <CheckCircle2 size={20} strokeWidth={2.15} />}
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function CompactCard({ label, title, text, icon: Icon }) {
  return (
    <article className="compact-card">
      <div className="compact-card-badge" aria-hidden="true">
        <Icon size={18} strokeWidth={2.2} />
      </div>
      <div className="compact-card-copy">
        <div className="compact-card-label">{label}</div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}

function DashboardPreview() {
  return (
    <div className="home-hero-panel">
      <div className="home-preview">
        <div className="home-preview-head">
          <div>
            <div className="snapshot-label">Platform Preview</div>
            <div className="snapshot-title">Key tools inside AutoBolt</div>
          </div>
        </div>

        <div className="preview-grid">
          <article className="preview-card">
            <div className="preview-card-icon"><Package size={18} strokeWidth={2.2} /></div>
            <h3>Inventory Tracking</h3>
            <p>Monitor parts, stock levels, and restock needs.</p>
          </article>
          <article className="preview-card">
            <div className="preview-card-icon"><ShoppingCart size={18} strokeWidth={2.2} /></div>
            <h3>Invoice Management</h3>
            <p>Create and manage sales and purchase invoices.</p>
          </article>
          <article className="preview-card">
            <div className="preview-card-icon"><CheckCircle2 size={18} strokeWidth={2.2} /></div>
            <h3>Customer Records</h3>
            <p>Store customer profiles, vehicles, and service history.</p>
          </article>
          <article className="preview-card">
            <div className="preview-card-icon"><Sparkles size={18} strokeWidth={2.2} /></div>
            <h3>Smart Alerts</h3>
            <p>Receive low-stock and overdue credit reminders.</p>
          </article>
        </div>

        <div className="preview-note">
          <div className="preview-note-icon"><Sparkles size={16} /></div>
          <div>
            <strong>AI Support</strong>
            <p>AutoBolt helps highlight demand trends, stock risks, and possible vehicle part issues.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const workflowTimeline = [
  {
    step: "01",
    title: "Stock Arrives",
    text: "Admin records vendor purchases and the system updates stock levels automatically.",
    icon: Package
  },
  {
    step: "02",
    title: "Sale Happens",
    text: "Staff selects parts, registers customer details, and generates a sales invoice.",
    icon: ShoppingCart
  },
  {
    step: "03",
    title: "Invoice Sent",
    text: "Invoices can be emailed directly to customers, and purchase history is saved.",
    icon: Mail
  },
  {
    step: "04",
    title: "Alerts & AI",
    text: "AutoBolt monitors low stock, overdue credits, and AI-based vehicle part predictions.",
    icon: Sparkles
  }
];

export function LandingPage({ route = "home", onNavigate, publicNav }) {
  return (
    <Shell
      route={route}
      onNavigate={onNavigate}
      publicNav={publicNav}
      footerText="2026 AutoBolt. Vehicle Parts Selling and Inventory Management System. All rights reserved."
    >
      <section className="home-hero" id="home">
        <div className="home-hero-bg" />
        <div className="home-hero-overlay" />
        <div className="home-hero-grid">
          <div className="home-hero-copy">
            <div className="eyebrow home-eyebrow">Vehicle Parts Management System</div>
            <h1>Where Vehicle Parts Operations Feel Effortless</h1>
            <p>
              AutoBolt helps vehicle service centres manage inventory, sales invoices, vendor records, customer vehicles,
              service bookings, reports, and smart alerts from one role-based platform.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary home-cta" type="button" onClick={() => onNavigate("signup")}>
                Get Started <ArrowRight size={16} />
              </button>
              <button className="btn btn-secondary home-secondary" type="button" onClick={() => onNavigate("home-features")}>
                Explore Features
              </button>
            </div>
            <div className="home-trust">
              <div><CheckCircle2 size={14} /> Inventory Control</div>
              <div><CheckCircle2 size={14} /> Smart stock alerts</div>
              <div><CheckCircle2 size={14} /> AI-driven support</div>
            </div>
          </div>

          <DashboardPreview />
        </div>
      </section>

      <section className="section home-roles" id="home-roles">
        <div className="roles-layout">
          <div className="roles-intro">
            <div className="eyebrow eyebrow-light">Roles</div>
            <h2 className="roles-title">The right tools for every person on your team.</h2>
            <p className="roles-copy">
              Each role gets a focused experience so teams can move faster without exposing unrelated tools or clutter.
            </p>
          </div>
          <div className="grid-3 roles-grid">
            {Object.entries(roleCards).map(([role, data]) => (
              <RoleCard key={role} role={role} data={data} />
            ))}
          </div>
        </div>
      </section>

      <section className="section home-features" id="home-features">
        <SectionHeading
          eyebrow="Features"
          title="Everything required to manage parts, customers, and business operations."
          copy="A single platform for inventory, invoicing, records, alerts, analytics, and predictive support."
          centered
        />
        <div className="feature-grid">
          {features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
        </div>
      </section>

      <section className="section home-workflow" id="home-workflow">
        <SectionHeading
          eyebrow="Workflow"
          title="A clean flow from purchase to service follow-up."
          copy="AutoBolt keeps each step visible so the team can work with less friction and fewer manual updates."
          centered
        />
        <div className="workflow-timeline" role="list" aria-label="Workflow timeline">
          {workflowTimeline.map((item, index) => (
            <article className="workflow-step" key={item.step} role="listitem">
              <div className="workflow-card">
                <div className="workflow-card-top">
                  <div className="workflow-badge">
                    <span>{item.step}</span>
                  </div>
                  <div className="workflow-icon">
                    <item.icon size={20} strokeWidth={2.2} />
                  </div>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              {index < workflowTimeline.length - 1 ? <div className="workflow-connector" aria-hidden="true" /> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="section home-benefits" id="home-benefits">
        <SectionHeading
          eyebrow="Why AutoBolt?"
          title="A better day for teams that sell parts and support vehicles."
          copy="Designed to improve throughput, reduce stock issues, and keep business records easy to trust."
          centered
        />
        <div className="feature-grid benefits-grid">
          {benefits.map((benefit) => <BenefitCard key={benefit.title} {...benefit} />)}
        </div>
      </section>

      <section className="section home-cta-wrap">
        <div className="cta-banner">
          <div>
            <h2>Ready to streamline your parts operation?</h2>
            <p>Set up your AutoBolt account and start managing inventory, invoices, bookings, and customer records in one place.</p>
          </div>
          <button className="btn btn-primary" type="button" onClick={() => onNavigate("signup")}>
            Get Started
          </button>
        </div>
      </section>

      <section className="section home-about" id="about">
        <div className="split-section home-about-layout">
          <div className="split-copy">
            <div className="eyebrow eyebrow-light">ABOUT AUTOBOLT</div>
            <h2 className="split-title">Built for Vehicle Service Centres</h2>
            <p className="split-copy-text">
              AutoBolt was designed to solve the real operational challenges faced by vehicle parts retailers and
              service centres - messy inventory, manual invoicing, and disconnected customer records.
            </p>
            <p className="split-support">
              With role-based access for Admin, Staff, and Customer users, AutoBolt keeps daily operations structured,
              faster, and easier to manage.
            </p>
          </div>

          <div className="compact-card-grid about-card-grid">
            {aboutCards.map((card) => (
              <CompactCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section className="section home-contact" id="contact">
        <div className="split-section home-contact-layout">
          <div className="split-copy">
            <div className="eyebrow eyebrow-light">CONTACT AUTOBOLT</div>
            <h2 className="split-title">Get support for your parts and service workflow</h2>
            <p className="split-copy-text">
              Need help with system access, customer records, inventory, invoices, or service bookings? Contact the
              AutoBolt team using the details below.
            </p>
            <p className="split-support">
              We keep support practical and responsive so your team can stay focused on the workshop.
            </p>
          </div>

          <div className="compact-card-grid contact-card-grid">
            {contactCards.map((card) => (
              <CompactCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

    </Shell>
  );
}

export function AuthPage({ mode, onNavigate, publicNav }) {
  const isSignIn = mode === "signin";

  return (
    <Shell
      route={mode}
      onNavigate={onNavigate}
      publicNav={publicNav}
      footerText="\u00A9 2026 AutoBolt. Vehicle Parts Selling and Inventory Management System. All rights reserved."
    >
      <section className="section auth-section">
        <div className="auth-layout">
          <div className="auth-panel auth-intro">
            <a className="auth-back" href="#home">
              <ChevronRight size={16} />
              Back to home
            </a>
            <div className="auth-brand-line">
              <div className="brand-mark">A</div>
              <div className="brand-copy">
                <div>AutoBolt</div>
                <span>Vehicle Parts Management</span>
              </div>
            </div>
            <h1>{isSignIn ? "Welcome Back" : "Create Your Account"}</h1>
            <p>
              {isSignIn
                ? "Sign in to access your AutoBolt dashboard."
                : "Register to access AutoBolt services and manage your vehicle-related information."}
            </p>
            <div className="auth-note-block">
              <div className="auth-note-row">
                <CheckCircle2 size={16} />
                <span>Role-based dashboards for admin, staff, and customer users</span>
              </div>
              <div className="auth-note-row">
                <CheckCircle2 size={16} />
                <span>Professional workflows for inventory, billing, and customer records</span>
              </div>
              <div className="auth-note-row">
                <CheckCircle2 size={16} />
                <span>Built for vehicle service centres and parts retail businesses</span>
              </div>
            </div>
          </div>

          <div className="auth-panel auth-form-panel">
            <div className="auth-tabs">
              <button className={`auth-tab ${isSignIn ? "active" : ""}`} type="button" onClick={() => onNavigate("signin")}>
                Sign In
              </button>
              <button className={`auth-tab ${!isSignIn ? "active" : ""}`} type="button" onClick={() => onNavigate("signup")}>
                Create Your Account
              </button>
            </div>

            <div className="auth-header-copy">
              <h2>{isSignIn ? "Welcome Back" : "Create Your Account"}</h2>
              <p>
                {isSignIn
                  ? "Sign in to access your AutoBolt dashboard."
                  : "Register to access AutoBolt services and manage your vehicle-related information."}
              </p>
            </div>

            <form
              className="form-grid"
              onSubmit={(e) => {
                e.preventDefault();
                onNavigate(isSignIn ? "staff-dashboard" : "customer");
              }}
            >
              {isSignIn ? <SigninFields /> : <SignupFields />}
              <button className="btn btn-primary auth-submit" type="submit">
                {isSignIn ? "Sign In" : "Create Your Account"}
              </button>
            </form>

            <p className="mini-note">Access is provided based on your assigned role.</p>
          </div>
        </div>
      </section>
    </Shell>
  );
}

export function PublicPage({ route, config, onNavigate, publicNav }) {
  return (
    <Shell
      route={route}
      onNavigate={onNavigate}
      publicNav={publicNav}
      footerText="\u00A9 2026 AutoBolt. Vehicle Parts Selling and Inventory Management System. All rights reserved."
    >
      <section className="section public-page-section">
        <div className="grid-2 public-page-grid">
          <div className="card public-page-copy">
            <span className="eyebrow">{config.eyebrow}</span>
            <h1>{config.title}</h1>
            <p>{config.copy}</p>
            <div className="hero-actions">
              <button className="btn btn-primary" type="button" onClick={() => onNavigate("signup")}>
                Get Started
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => onNavigate("signin")}>
                Sign In
              </button>
            </div>
          </div>

          <div className="grid-3 public-info-grid">
            {config.cards.map(([title, text]) => (
              <InfoCard key={title} title={title} text={text} />
            ))}
          </div>
        </div>

      </section>
    </Shell>
  );
}
