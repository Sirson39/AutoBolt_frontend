import React, { useState } from "react";
import { features, publicPages, roleCards, footerNav, benefits, workflowSteps, aboutCards, contactCards } from "../../data/siteContent";
import { FeatureCard, Metric, RoleCard, BenefitCard, CompactCard } from "../../components/shared";
import { 
  Package, ShoppingCart, Sparkles, 
  ArrowRight, CheckCircle2, 
  ChevronRight, Brain, Boxes, ReceiptText, 
  Truck, Users, BarChart3, Bell, Tag, TrendingUp, ShieldCheck, Gauge
} from "lucide-react";
import api from "../../utils/api";
import { setAuth } from "../../utils/auth";
import toast from "react-hot-toast";

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

function InfoCard({ title, text, icon: Icon }) {
  return (
    <article className="card info-card">
      <div className="card-icon" style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
        {Icon ? <Icon size={24} strokeWidth={2} /> : <Sparkles size={24} strokeWidth={2} />}
      </div>
      <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem' }}>{text}</p>
    </article>
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
          {workflowSteps.map((item, index) => (
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
              <p className="panel-copy">Users can start from the landing page and move into sign in or sign up, then into the matching workspace.</p>
              <div className="auth-meta">
                <span className="status good">Ready</span>
                <span className="status good">Connected</span>
                <span className="status good">Responsive</span>
              </div>
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
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regAddress, setRegAddress] = useState('');

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { email: loginEmail, password: loginPassword });
      setAuth(data);
      toast.success(`Welcome back, ${data.fullName}!`);
      if (data.role === 'Admin') onNavigate('admin');
      else if (data.role === 'Staff') onNavigate('staff-dashboard');
      else onNavigate('customer');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetOtp = async (e) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
      toast.error('Passwords do not match.');
      return;
    }
    if (regPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/auth/send-registration-otp', { email: regEmail });
      setOtpSent(true);
      toast.success('Verification code sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await api.post('/api/auth/send-registration-otp', { email: regEmail });
      toast.success('Verification code resent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/register', {
        fullName: regFullName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        address: regAddress || undefined,
        otp: otpCode,
      });
      toast.success(`Verification successful! Welcome, ${regFullName}. Please sign in.`);
      // Reset form and go to sign in
      setOtpSent(false);
      setOtpCode('');
      setRegFullName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setRegConfirm('');
      setRegAddress('');
      onNavigate('signin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please check your verification code.');
    } finally {
      setLoading(false);
    }
  };

  const config = mode === "signin"
    ? { title: "Sign in", subtitle: "Enter your credentials to access your workspace.", button: loading ? "Signing in…" : "Sign in" }
    : { 
        title: otpSent ? "Verify Email" : "Create account", 
        subtitle: otpSent ? "We sent a 6-digit verification code to your email." : "Register as a customer to access self-service features.", 
        button: loading ? (otpSent ? "Registering…" : "Sending code…") : (otpSent ? "Verify & Register" : "Get a verification code") 
      };

  return (
    <Shell
      route={mode}
      onNavigate={onNavigate}
      publicNav={publicNav}
      footerText="© 2026 AutoBolt. Vehicle Parts Selling and Inventory Management System. All rights reserved."
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
            <h1>{mode === "signin" ? "Welcome Back" : (otpSent ? "Verify Your Email" : "Create Your Account")}</h1>
            <p>
              {mode === "signin"
                ? "Sign in with your AutoBolt credentials. You'll be taken to the workspace matching your role."
                : (otpSent ? "A verification code has been sent to your inbox. Enter it below to complete registration." : "Create a customer account to track your vehicles, purchases, and service history.")}
            </p>
            <div className="metrics">
              <Metric title="Role aware" text="Admin, staff, or customer entry" />
              <Metric title="JWT secured" text="Token-based authentication" />
            </div>
            {mode === "signin" && (
              <div style={{ marginTop: 24 }}>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => onNavigate("forgot-password")}
                  style={{ fontSize: '0.85rem' }}
                >
                  Forgot your password?
                </button>
              </div>
            )}
          </div>

          <div className="auth-panel auth-form-panel">
            <div className="auth-tabs">
              <button className={`auth-tab ${mode === "signin" ? "active" : ""}`} type="button" onClick={() => { setOtpSent(false); onNavigate("signin"); }}>
                Sign In
              </button>
              <button className={`auth-tab ${mode !== "signin" ? "active" : ""}`} type="button" onClick={() => onNavigate("signup")}>
                Create Your Account
              </button>
            </div>

            <div className="auth-header-copy">
              <h2>{mode === "signin" ? "Welcome Back" : (otpSent ? "Enter Verification Code" : "Create Your Account")}</h2>
              <p>
                {mode === "signin"
                  ? "Sign in to access your AutoBolt dashboard."
                  : (otpSent ? "We just sent a code. Verify to activate." : "Register to access AutoBolt services and manage your vehicle-related information.")}
              </p>
            </div>
            <h2 style={{ margin: "18px 0 6px" }}>{config.title}</h2>
            <p className="panel-copy">{config.subtitle}</p>

            {mode === "signin" ? (
              <form className="form-grid" onSubmit={handleLogin}>
                <div className="field">
                  <label htmlFor="login-email">Email</label>
                  <input id="login-email" type="email" placeholder="name@example.com" required
                    value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                </div>
                <div className="field">
                  <label htmlFor="login-password">Password</label>
                  <input id="login-password" type="password" placeholder="Enter password" required
                    value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                </div>
                <button className="btn btn-primary auth-submit" type="submit" disabled={loading}
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', color: '#111827', fontWeight: '800', width: '100%', padding: '14px 24px' }}>
                  {config.button}
                </button>
                <p className="mini-note" style={{ marginTop: 8 }}>
                  Don't have an account?{' '}
                  <button type="button" className="btn btn-ghost" style={{ fontSize: 'inherit', padding: '0', textDecoration: 'underline' }}
                    onClick={() => onNavigate("signup")}>Sign up</button>
                </p>
              </form>
            ) : (
              <form className="form-grid" onSubmit={otpSent ? handleRegister : handleGetOtp}>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="reg-name">Full name</label>
                    <input id="reg-name" type="text" placeholder="Your name" required disabled={otpSent}
                      value={regFullName} onChange={e => setRegFullName(e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="reg-phone">Phone</label>
                    <input id="reg-phone" type="tel" placeholder="98XXXXXXXX" required disabled={otpSent}
                      value={regPhone} onChange={e => setRegPhone(e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="reg-email">Email</label>
                  <input id="reg-email" type="email" placeholder="name@example.com" required disabled={otpSent}
                    value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="reg-password">Password</label>
                    <input id="reg-password" type="password" placeholder="Min 8 characters" required disabled={otpSent}
                      value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="reg-confirm">Confirm password</label>
                    <input id="reg-confirm" type="password" placeholder="Repeat password" required disabled={otpSent}
                      value={regConfirm} onChange={e => setRegConfirm(e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="reg-address">Address <span style={{ color: 'var(--ink-soft)', fontWeight: 400 }}>(optional)</span></label>
                  <input id="reg-address" type="text" placeholder="City or street" disabled={otpSent}
                    value={regAddress} onChange={e => setRegAddress(e.target.value)} />
                </div>
                
                {otpSent && (
                  <div className="field" style={{ animation: 'slideUp 0.3s ease' }}>
                    <label htmlFor="reg-otp" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>6-Digit Verification Code</label>
                    <input id="reg-otp" type="text" placeholder="------" required maxLength={6}
                      value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))} 
                      style={{ fontSize: '1.5rem', letterSpacing: '8px', textAlign: 'center', fontWeight: 'bold', border: '2px solid var(--primary)' }} />
                    <p className="mini-note" style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                      <span>Didn't get the code or made a mistake?</span>
                      <span style={{ display: 'flex', gap: '12px' }}>
                        <button type="button" className="btn btn-ghost" style={{ fontSize: 'inherit', padding: '0', textDecoration: 'underline', color: 'var(--accent)', fontWeight: 'bold' }}
                          onClick={handleResendOtp} disabled={loading}>Resend code</button>
                        <span style={{ color: 'var(--line)' }}>|</span>
                        <button type="button" className="btn btn-ghost" style={{ fontSize: 'inherit', padding: '0', textDecoration: 'underline', color: 'var(--muted)' }}
                          onClick={() => setOtpSent(false)}>Edit details</button>
                      </span>
                    </p>
                  </div>
                )}

                <button className="btn btn-primary auth-submit" type="submit" disabled={loading}
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', color: '#111827', fontWeight: '800', width: '100%', padding: '14px 24px' }}>
                  {config.button}
                </button>
                <p className="mini-note" style={{ marginTop: 8 }}>
                  Already have an account?{' '}
                  <button type="button" className="btn btn-ghost" style={{ fontSize: 'inherit', padding: '0', textDecoration: 'underline' }}
                    onClick={() => { setOtpSent(false); onNavigate("signin"); }}>Sign in</button>
                </p>
              </form>
            )}
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
      footerText="© 2026 AutoBolt. Vehicle Parts Selling and Inventory Management System. All rights reserved."
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
            {config.cards.map((card, idx) => (
              <InfoCard key={idx} title={card[0]} text={card[1]} />
            ))}
          </div>
        </div>
      </section>
    </Shell>
  );
}
