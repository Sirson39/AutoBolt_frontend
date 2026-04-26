import React from "react";
import { features, publicPages, roleCards } from "../../data/siteContent";
import { FeatureCard, Metric, RoleCard, SigninFields, SignupFields } from "../../components/shared";

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
                <span className="status warn">Backend pending</span>
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
  const config = mode === "signin"
    ? {
        title: "Sign in",
        subtitle: "Open a role-based workspace and explore the matching dashboard UI.",
        button: "Enter dashboard"
      }
    : {
        title: "Create account",
        subtitle: "Prepare a clean registration flow for customers, staff, or admin onboarding.",
        button: "Create profile"
      };

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
                ? "Use this screen as the gateway into the role dashboard that matches the signed-in user."
                : "The sign-up flow is ready for customer registration now and can be connected to a backend later."}
            </p>
            <div className="metrics">
              <Metric title="Role aware" text="Admin, staff, or customer entry" />
              <Metric title="Fast start" text="Landing page to workspace in one click" />
            </div>
          </div>
          <div className="glass-panel auth-card">
            <div className="auth-tabs">
              <button className={`auth-tab ${mode === "signin" ? "active" : ""}`} type="button" onClick={() => onNavigate("signin")}>Sign In</button>
              <button className={`auth-tab ${mode === "signup" ? "active" : ""}`} type="button" onClick={() => onNavigate("signup")}>Sign Up</button>
            </div>
            <h2 style={{ margin: "18px 0 6px" }}>{config.title}</h2>
            <p className="panel-copy">{config.subtitle}</p>
            <form className="form-grid" onSubmit={(e) => {
              e.preventDefault();
              onNavigate(mode === "signin" ? "staff-dashboard" : "customer");
            }}>
              {mode === "signup" ? <SignupFields /> : <SigninFields />}
              <button className="btn btn-primary" type="submit">{config.button}</button>
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
