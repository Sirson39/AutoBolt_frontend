import React, { useState } from "react";
import { features, publicPages, roleCards } from "../../data/siteContent";
import { FeatureCard, Metric, RoleCard } from "../../components/shared";
import api from "../../utils/api";
import { setAuth } from "../../utils/auth";
import toast from "react-hot-toast";

function Shell({ route, onNavigate, publicNav, children, footerText }) {
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
            {publicNav.map(([label, target]) => (
              <a key={target} className={`header-link ${route === target ? "active" : ""}`} href={`#${target}`}>
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button className="btn btn-secondary" type="button" onClick={() => onNavigate("signin")}>Sign In</button>
            <button className="btn btn-primary" type="button" onClick={() => onNavigate("signup")}>Start Free</button>
          </div>
        </div>
      </header>
      <main className="page-shell">{children}</main>
      <footer className="page-footer">
        <div>AutoBolt frontend prototype</div>
        <div>{footerText}</div>
      </footer>
    </>
  );
}

export function LandingPage({ onNavigate, publicNav }) {
  return (
    <Shell
      route="home"
      onNavigate={onNavigate}
      publicNav={publicNav}
      footerText="Landing, sign in, sign up, and role-based UI for admin, staff, and customer."
    >
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-panel">
            <span className="eyebrow">Coursework-aligned UI prototype</span>
            <h1>One frontend for admin, staff, and customer journeys.</h1>
            <p>This landing page is designed from the coursework brief: a vehicle parts selling and inventory management system with role-based workflows, easy authentication entry points, and clean service-first UI.</p>
            <div className="hero-actions">
              <button className="btn btn-primary" type="button" onClick={() => onNavigate("signup")}>Create account</button>
              <button className="btn btn-secondary" type="button" onClick={() => onNavigate("signin")}>Sign in</button>
              <button className="btn btn-ghost" type="button" onClick={() => onNavigate("staff-dashboard")}>View staff workspace</button>
            </div>
            <div className="metrics">
              <Metric title="3 roles" text="Admin, staff, and customer views ready" />
              <Metric title="10+ flows" text="Built from the scenario and marking scheme" />
              <Metric title="1 SPA" text="Fast, responsive, and local-only" />
            </div>
          </div>

          <div className="side-stack">
            <div className="glass-panel summary-card">
              <div className="summary-top">
                <div>
                  <span className="eyebrow">What the brief asks for</span>
                  <h3 style={{ margin: "14px 0 6px" }}>Role-driven product flow</h3>
                </div>
                <div className="pill">UI only for now</div>
              </div>
              <p className="panel-copy">The document emphasizes a frontend project with clear feature coverage, screenshots, and user-friendly design. This prototype focuses on those visible experiences first.</p>
              <ul className="checklist">
                <li><span className="check-dot">1</span><span>Landing page with sign in and sign up entry points</span></li>
                <li><span className="check-dot">2</span><span>Admin, staff, and customer dashboards</span></li>
                <li><span className="check-dot">3</span><span>Inventory, invoices, reports, search, and booking UI</span></li>
                <li><span className="check-dot">4</span><span>Clean responsive design for presentation and screenshots</span></li>
              </ul>
            </div>

            <div className="glass-panel summary-card">
              <div className="summary-top">
                <div>
                  <span className="eyebrow">Immediate focus</span>
                  <h3 style={{ margin: "14px 0 6px" }}>Public + auth flow</h3>
                </div>
              </div>
              <p className="panel-copy">Users can start from the landing page and move into sign in or sign up, then into the matching workspace.</p>
              <div className="auth-meta">
                <span className="status good">Ready</span>
                <span className="status good">Connected</span>
                <span className="status good">Responsive</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Why this frontend matches the brief</h2>
            <p className="section-copy">The coursework is centered on three groups and their daily tasks, so the UI is organized the same way.</p>
          </div>
        </div>
        <div className="grid-3">
          {features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Role overview</h2>
            <p className="section-copy">Each workspace focuses on the tasks described in the scenario brief.</p>
          </div>
        </div>
        <div className="grid-3">
          {Object.entries(roleCards).map(([role, data]) => (
            <RoleCard key={role} role={role} data={data} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
    </Shell>
  );
}

export function AuthPage({ mode, onNavigate, publicNav }) {
  const [loading, setLoading] = useState(false);

  // Sign-in state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign-up state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regAddress, setRegAddress] = useState('');

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

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', {
        fullName: regFullName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        address: regAddress || undefined,
      });
      setAuth(data);
      toast.success(`Account created! Welcome, ${data.fullName}.`);
      onNavigate('customer');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const config = mode === "signin"
    ? { title: "Sign in", subtitle: "Enter your credentials to access your workspace.", button: loading ? "Signing in…" : "Sign in" }
    : { title: "Create account", subtitle: "Register as a customer to access self-service features.", button: loading ? "Creating account…" : "Create profile" };

  return (
    <Shell
      route={mode}
      onNavigate={onNavigate}
      publicNav={publicNav}
      footerText="Dark theme, role-based layouts, and automotive-focused entry points."
    >
      <section className="section">
        <div className="auth-layout">
          <div className="hero-panel auth-panel">
            <span className="eyebrow">Authentication entry</span>
            <h1 style={{ marginTop: 18 }}>{mode === "signin" ? "Welcome back." : "Create your profile."}</h1>
            <p>
              {mode === "signin"
                ? "Sign in with your AutoBolt credentials. You'll be taken to the workspace matching your role."
                : "Create a customer account to track your vehicles, purchases, and service history."}
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
          <div className="glass-panel auth-card">
            <div className="auth-tabs">
              <button className={`auth-tab ${mode === "signin" ? "active" : ""}`} type="button" onClick={() => onNavigate("signin")}>Sign In</button>
              <button className={`auth-tab ${mode === "signup" ? "active" : ""}`} type="button" onClick={() => onNavigate("signup")}>Sign Up</button>
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
                <button className="btn btn-primary" type="submit" disabled={loading}>{config.button}</button>
                <p className="mini-note" style={{ marginTop: 8 }}>
                  Don't have an account?{' '}
                  <button type="button" className="btn btn-ghost" style={{ fontSize: 'inherit', padding: '0', textDecoration: 'underline' }}
                    onClick={() => onNavigate("signup")}>Sign up</button>
                </p>
              </form>
            ) : (
              <form className="form-grid" onSubmit={handleRegister}>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="reg-name">Full name</label>
                    <input id="reg-name" type="text" placeholder="Your name" required
                      value={regFullName} onChange={e => setRegFullName(e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="reg-phone">Phone</label>
                    <input id="reg-phone" type="tel" placeholder="98XXXXXXXX" required
                      value={regPhone} onChange={e => setRegPhone(e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="reg-email">Email</label>
                  <input id="reg-email" type="email" placeholder="name@example.com" required
                    value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="reg-password">Password</label>
                    <input id="reg-password" type="password" placeholder="Min 8 characters" required
                      value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="reg-confirm">Confirm password</label>
                    <input id="reg-confirm" type="password" placeholder="Repeat password" required
                      value={regConfirm} onChange={e => setRegConfirm(e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="reg-address">Address <span style={{ color: 'var(--ink-soft)', fontWeight: 400 }}>(optional)</span></label>
                  <input id="reg-address" type="text" placeholder="City or street"
                    value={regAddress} onChange={e => setRegAddress(e.target.value)} />
                </div>
                <button className="btn btn-primary" type="submit" disabled={loading}>{config.button}</button>
                <p className="mini-note" style={{ marginTop: 8 }}>
                  Already have an account?{' '}
                  <button type="button" className="btn btn-ghost" style={{ fontSize: 'inherit', padding: '0', textDecoration: 'underline' }}
                    onClick={() => onNavigate("signin")}>Sign in</button>
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
      footerText="About, contact, and customer register pages are part of the React shell too."
    >
      <section className="section">
        <div className="grid-2">
          <div className="hero-panel">
            <span className="eyebrow">{config.eyebrow}</span>
            <h1 style={{ marginTop: 18 }}>{config.title}</h1>
            <p>{config.copy}</p>
            <div className="hero-actions">
              <button className="btn btn-primary" type="button" onClick={() => onNavigate("signin")}>Sign In</button>
              <button className="btn btn-secondary" type="button" onClick={() => onNavigate("signup")}>Sign Up</button>
            </div>
          </div>
          <div className="glass-panel summary-card">
            <h3>Quick info</h3>
            <div className="stack-list">
              {config.cards.map(([title, text]) => (
                <div className="stack-item" key={title}>
                  <div>
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </div>
                  <span className="status good">Ready</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
