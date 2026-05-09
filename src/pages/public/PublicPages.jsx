import React from "react";
import { features, publicPages, roleCards } from "../../data/siteContent";
import { FeatureCard, RoleCard, SigninFields, SignupFields } from "../../components/shared";
import { ArrowRight, CheckCircle2, Gauge, Sparkles } from "lucide-react";

function Shell({ route, onNavigate, publicNav, children, footerText }) {
  const mainNav = publicNav.filter((item) => item.kind !== "action");

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
            {mainNav.map((item) => (
              <a
                key={item.target}
                className={`header-link ${item.kind === "page" && route === item.target ? "active" : ""}`}
                href={`#${item.target}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button className="btn btn-secondary" type="button" onClick={() => onNavigate("signin")}>Sign in</button>
            <button className="btn btn-primary" type="button" onClick={() => onNavigate("signup")}>Get started</button>
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
      footerText="Home, sign in, sign up, and role-based UI for admin, staff, and customer."
    >
      <section className="home-hero" id="home-hero">
        <div className="home-hero-bg" />
        <div className="home-hero-overlay" />
        <div className="home-hero-grid">
          <div className="home-hero-copy">
            <div className="eyebrow home-eyebrow">Built for vehicle service centers</div>
            <h1>
              Run your parts<br />
              business like a{" "}
              <span>precision machine.</span>
            </h1>
            <p>
              From stock alerts to invoicing, vendor management to AI-powered failure prediction -
              one platform that keeps your workshop, sales floor, and customers in perfect sync.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary home-cta" type="button" onClick={() => onNavigate("signup")}>
                Start free <ArrowRight size={16} />
              </button>
              <button className="btn btn-secondary home-secondary" type="button" onClick={() => onNavigate("signin")}>
                Explore features
              </button>
            </div>
            <div className="home-trust">
              <div><CheckCircle2 size={14} /> Role-based access</div>
              <div><CheckCircle2 size={14} /> Smart stock alerts</div>
              <div><CheckCircle2 size={14} /> AI predictions</div>
            </div>
          </div>

          <div className="home-hero-panel">
            <div className="home-glow" />
            <div className="home-snapshot">
              <div className="home-snapshot-head">
                <div>
                  <div className="snapshot-label">Live snapshot</div>
                  <div className="snapshot-title">Today&apos;s overview</div>
                </div>
                <Gauge size={20} />
              </div>
              <div className="snapshot-grid">
                <div className="snapshot-card">
                  <span>Parts in stock</span>
                  <strong>2,847</strong>
                  <small>+12%</small>
                </div>
                <div className="snapshot-card">
                  <span>Sales today</span>
                  <strong>$8,420</strong>
                  <small>+5.2%</small>
                </div>
                <div className="snapshot-card">
                  <span>Pending orders</span>
                  <strong>23</strong>
                  <small>-3</small>
                </div>
                <div className="snapshot-card">
                  <span>Low-stock alerts</span>
                  <strong>7</strong>
                  <small>urgent</small>
                </div>
              </div>
              <div className="snapshot-note">
                <Sparkles size={16} />
                <p>
                  <strong>AI insight:</strong> Brake pad demand expected to rise 18% next week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section home-roles" id="home-roles">
        <div className="roles-layout">
          <div className="section-header roles-intro">
            <div className="eyebrow eyebrow-light">One platform · Three experiences</div>
            <h2 className="roles-title">Tailored for every person on your team.</h2>
            <p className="roles-copy">Admins keep oversight, staff move fast on the floor, and customers self-serve from anywhere, all on the same system.</p>
          </div>
          <div className="grid-3 roles-grid">
            {Object.entries(roleCards).map(([role, data]) => (
              <RoleCard key={role} role={role} data={data} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      <section className="section home-features" id="home-features">
        <div className="section-header section-header-centered">
          <div className="eyebrow eyebrow-light">Everything you need</div>
          <h2 className="feature-section-title" aria-label="The complete operating system for parts retail.">
            <span>The complete operating</span>
            <span>system</span>
            <span>for parts retail.</span>
          </h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
        </div>
      </section>

      <section className="section home-workflow" id="home-workflow">
        <div className="section-header section-header-centered">
          <div className="eyebrow eyebrow-light">How it flows</div>
          <h2 className="section-title">From shelf to satisfied customer.</h2>
        </div>
        <div className="workflow">
          <div className="workflow-item"><span>01</span><h3>Stock arrives</h3><p>Admin logs vendor purchase invoices. Stock updates instantly.</p></div>
          <div className="workflow-item"><span>02</span><h3>Sale happens</h3><p>Staff registers customer, picks parts, generates invoice.</p></div>
          <div className="workflow-item"><span>03</span><h3>Receipt sent</h3><p>Invoice emailed to customer. Loyalty discount applied at &gt;5,000.</p></div>
          <div className="workflow-item"><span>04</span><h3>AI watches</h3><p>System tracks usage, predicts failures, sends reminders.</p></div>
        </div>
      </section>

      <section className="section home-cta-wrap">
        <div className="cta-banner">
          <div>
            <h2>Ready to streamline your workshop?</h2>
            <p>Sign up free in under a minute. Customer accounts are instant; staff and admin roles are assigned by your team lead.</p>
          </div>
          <button className="btn btn-primary" type="button" onClick={() => onNavigate("signup")}>Create your account</button>
        </div>
      </section>
    </Shell>
  );
}

export function AuthPage({ mode, onNavigate, publicNav }) {
  return (
    <Shell
      route={mode}
      onNavigate={onNavigate}
      publicNav={publicNav}
      footerText="Dark theme, role-based layouts, and automotive-focused entry points."
    >
      <section className="section">
        <div className="auth-layout">
          <div className="auth-hero auth-panel">
            <div className="auth-topline">
              <a className="auth-back" href="#home">← Back to home</a>
              <a className="brand auth-brand" href="#home" aria-label="AutoBolt home">
                <div className="brand-mark">A</div>
                <div className="brand-copy">
                  <div>AutoParts Hub</div>
                  <span>Inventory · Sales · Service</span>
                </div>
              </a>
            </div>
            <h1 style={{ marginTop: 18 }}>{mode === "signin" ? "One platform." : "One platform."}</h1>
            <p>
              {mode === "signin"
                ? "From the warehouse floor to the customer's inbox — manage your parts business with precision and ease."
                : "From stock alerts to invoicing, vendor management to AI-powered predictions — one platform that keeps your workshop, sales floor, and customers in sync."}
            </p>
            <ul className="auth-list">
              <li><span className="auth-dot">✓</span><span>Role-based dashboards</span></li>
              <li><span className="auth-dot">⬚</span><span>Smart inventory & alerts</span></li>
              <li><span className="auth-dot">✦</span><span>AI-powered predictions</span></li>
            </ul>
          </div>
          <div className="auth-form auth-card">
            <div className="auth-tabs">
              <button className={`auth-tab ${mode === "signin" ? "active" : ""}`} type="button" onClick={() => onNavigate("signin")}>Sign In</button>
              <button className={`auth-tab ${mode === "signup" ? "active" : ""}`} type="button" onClick={() => onNavigate("signup")}>Sign Up</button>
            </div>
            <div className="auth-header-copy">
              <h2 style={{ margin: "18px 0 6px" }}>Welcome</h2>
              <p className="panel-copy">Sign in to your account, or create a new one to get started.</p>
            </div>
            <form className="form-grid" onSubmit={(e) => {
              e.preventDefault();
              onNavigate(mode === "signin" ? "staff-dashboard" : "customer");
            }}>
              {mode === "signup" ? <SignupFields /> : <SigninFields />}
              <button className="btn btn-primary auth-submit" type="submit">{mode === "signin" ? "Sign in" : "Create account"}</button>
            </form>
            <p className="mini-note">
              This is UI-only for now. The form actions route into the matching dashboard so you can demo the experience immediately.
            </p>
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
