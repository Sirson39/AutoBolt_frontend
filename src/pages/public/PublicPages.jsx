import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Boxes,
  BrainCircuit,
  Mail,
  MapPin,
  Package,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  ShoppingCart,
  Phone,
  User,
  AlertCircle,
  BadgeCheck
} from "lucide-react";
import { benefits, features, footerNav, roleCards } from "../../data/siteContent";
import { BenefitCard, FeatureCard, RoleCard } from "../../components/shared";

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
    text: "support@autobolt.io - For platform questions, feature requests, account support, or technical assistance. Our team typically responds within 24 hours on business days.",
    icon: Mail
  },
  {
    label: "Business Hours",
    title: "Support Hours",
    text: "Monday to Friday, 9:00 AM - 6:00 PM (NPT). Our support team is available to assist with onboarding, technical issues, and general platform guidance.",
    icon: Clock3
  },
  {
    label: "Location",
    title: "Kathmandu, Nepal",
    text: "AutoBolt supports vehicle service and parts businesses across Nepal with practical digital tools for managing workshop operations.",
    icon: MapPin
  },
  {
    label: "Request a Demo",
    title: "See It Live",
    text: "Want to see AutoBolt in action before getting started? Book a free walkthrough and see how the platform can support your service centre's workflow.",
    icon: Sparkles
  }
];

const contactHighlights = [
  { label: "Response Time", value: "Within 24 hours" },
  { label: "Support Channel", value: "Email and demo bookings" },
  { label: "Service Area", value: "Kathmandu, Nepal" }
];

function Shell({ route, activeSection, onNavigate, publicNav, children, footerText }) {
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
              const active = item.kind === "section" ? activeSection === item.target : route === item.target;

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
              const variant = item.target === "signin" || item.target === "signup"
                ? "header-link-primary"
                : "header-link-secondary";
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
            <a
              key={item.target}
              href={`#${item.target}`}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(item.target);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </footer>
    </>
  );
}

function useSectionSpy(route) {
  const [activeSection, setActiveSection] = useState("home");
  const activeSectionRef = useRef("home");

  useEffect(() => {
    const sections = [
      { id: "home", target: "home" },
      { id: "home-roles", target: "home-roles" },
      { id: "home-features", target: "home-features" },
      { id: "home-workflow", target: "home-workflow" },
      { id: "home-benefits", target: "home-workflow" },
      { id: "about", target: "about" },
      { id: "contact", target: "contact" }
    ];

    const availableSections = sections.filter(({ id }) => document.getElementById(id));

    if (!availableSections.length) {
      setActiveSection("home");
      return undefined;
    }

    let frame = 0;

    const updateActiveSection = () => {
      const focusLine = Math.round(window.innerHeight * 0.5);
      const ctaSection = document.querySelector(".home-cta-wrap");

      if (ctaSection) {
        const ctaRect = ctaSection.getBoundingClientRect();
        if (ctaRect.top <= focusLine && ctaRect.bottom >= focusLine) {
          return;
        }
      }

      let nextActive = activeSectionRef.current || availableSections[0]?.target || "home";

      for (const section of availableSections) {
        const element = document.getElementById(section.id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();

        if (rect.top <= focusLine && rect.bottom > focusLine) {
          nextActive = section.target;
          break;
        }
      }

      if (nextActive !== activeSectionRef.current) {
        activeSectionRef.current = nextActive;
        setActiveSection(nextActive);
      }
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateActiveSection();
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [route]);

  return activeSection;
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

function getApiErrorMessage(error, fallback) {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) return data;
  if (data?.message) return data.message;
  if (Array.isArray(data?.errors) && data.errors.length > 0) return data.errors.join(", ");
  if (data?.errors && typeof data.errors === "object") {
    const messages = Object.values(data.errors).flat().filter(Boolean);
    if (messages.length > 0) return messages.join(", ");
  }
  if (data?.title && data?.detail) return `${data.title}: ${data.detail}`;
  if (error?.message) return error.message;
  return fallback;
}

function getRouteForRole(role) {
  const normalized = (role || "").toLowerCase();
  if (normalized === "admin") return "admin";
  if (normalized === "staff") return "staff";
  return "customer";
}

function storeAuthSession(responseData) {
  const session = {
    token: responseData?.token || "",
    role: responseData?.role || "",
    fullName: responseData?.fullName || "",
    email: responseData?.email || "",
    expiry: responseData?.expiry || ""
  };

  if (session.token) {
    localStorage.setItem("autobolt_auth", JSON.stringify(session));
    localStorage.setItem("autobolt_token", session.token);
    localStorage.setItem("autobolt_role", session.role);
    axios.defaults.headers.common.Authorization = `Bearer ${session.token}`;
  }
}

export function LandingPage({ route = "home", onNavigate, publicNav }) {
  const activeSection = useSectionSpy(route);

  useEffect(() => {
    const sectionRouteMap = {
      "home-roles": "home-roles",
      "home-features": "home-features",
      "home-workflow": "home-workflow",
      "home-benefits": "home-workflow",
      about: "about",
      contact: "contact"
    };

    const targetId = sectionRouteMap[route];
    if (!targetId) return undefined;

    const targetElement = document.getElementById(targetId);
    if (!targetElement) return undefined;

    const frame = window.requestAnimationFrame(() => {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [route]);

  return (
    <Shell
      route={route}
      activeSection={activeSection}
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
        <div className="about-split">
          <div className="about-image-wrap">
            <img
              src="/assets/auto3.jpg"
              alt="Vehicle service centre workshop"
              className="about-image"
            />
          </div>

          <div className="about-content">
            <div className="eyebrow eyebrow-light">ABOUT AUTOBOLT</div>
            <h2 className="split-title">Built for Service Centres</h2>
            <p className="split-copy-text">
              AutoBolt was designed to solve the real operational challenges faced by vehicle parts retailers and
              service centres - messy inventory, manual invoicing, and disconnected customer records.
            </p>
            <p className="split-support">
              With role-based access for Admin, Staff, and Customer users, AutoBolt keeps daily operations structured,
              faster, and easier to manage.
            </p>

            <div className="compact-card-grid about-card-grid">
              {aboutCards.map((card) => (
                <CompactCard key={card.title} {...card} />
              ))}
            </div>
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
              We provide practical and responsive support so your team can stay focused on daily workshop operations.
            </p>

            <div className="contact-highlights" aria-label="Support highlights">
              {contactHighlights.map((item) => (
                <div key={item.label} className="contact-highlight">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
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
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    address: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const email = form.email.trim();

    if (isSignIn) {
      if (!email || !form.password) {
        setError("Please enter both email and password.");
        return;
      }
    } else {
      if (!form.fullName.trim() || !email || !form.phone.trim() || !form.password) {
        setError("Please complete the required customer registration fields.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setSubmitting(true);

    try {
      const payload = isSignIn
        ? { email, password: form.password }
        : {
            fullName: form.fullName.trim(),
            email,
            password: form.password,
            phone: form.phone.trim(),
            address: form.address.trim() || null
          };

      const endpoint = isSignIn ? "/api/auth/login" : "/api/auth/register";
      const response = await axios.post(endpoint, payload);

      if (!response?.data?.token) {
        throw new Error("Authentication response did not include a token.");
      }

      storeAuthSession(response.data);
      toast.success(isSignIn ? "Signed in successfully." : "Customer account created successfully.");
      onNavigate(getRouteForRole(response.data.role));
    } catch (authError) {
      const fallback = isSignIn
        ? "Unable to sign in. Please check your credentials."
        : "Unable to create your account. Please review the form and try again.";

      const message = getApiErrorMessage(authError, fallback);
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Shell
      route={mode}
      activeSection={mode}
      onNavigate={onNavigate}
      publicNav={publicNav}
      footerText="2026 AutoBolt. Vehicle Parts Selling and Inventory Management System. All rights reserved."
    >
      <section className="section auth-section">
        <div className="auth-layout">
          <div className={`auth-panel auth-intro ${isSignIn ? "" : "auth-intro-register"}`}>
            <div className="auth-brand-line">
              <div className="brand-mark">A</div>
              <div className="brand-copy">
                <div>AutoBolt</div>
                <span>Vehicle Parts Management</span>
              </div>
            </div>
            <h1>{isSignIn ? "Welcome Back" : "Create Account"}</h1>
            <p>
              {isSignIn
                ? "Securely access your AutoBolt account and manage your vehicle parts workflow with confidence."
                : "Create your AutoBolt customer account to manage vehicle parts, orders, and service details in one place."}
            </p>
            <div className="auth-mini-grid">
              <div className="auth-mini-card">
                <BadgeCheck size={16} />
                <span>{isSignIn ? "Secure email and password access" : "Secure account access"}</span>
              </div>
              <div className="auth-mini-card">
                <ShieldCheck size={16} />
                <span>{isSignIn ? "Quick customer account registration" : "Quick customer registration"}</span>
              </div>
              <div className="auth-mini-card">
                <LockKeyhole size={16} />
                <span>{isSignIn ? "Password protection for your account" : "Protected customer profile"}</span>
              </div>
            </div>

            <div className="auth-stat-card">
              <div className="auth-stat-card-label">
                {isSignIn
                  ? "Built for faster parts, customer, and service management."
                  : "Start managing your vehicle parts workflow with confidence."}
              </div>
              <div className="auth-stat-card-copy">
                {isSignIn
                  ? "Manage parts, orders, and customer records in one secure platform."
                  : "Create one secure account for parts, orders, customers, and service records."}
              </div>
            </div>
          </div>

          <div className="auth-panel auth-form-panel">
            <div className="auth-tabs">
              <button className={`auth-tab ${isSignIn ? "active" : ""}`} type="button" onClick={() => onNavigate("signin")}>
                Sign In
              </button>
              <button className={`auth-tab ${!isSignIn ? "active" : ""}`} type="button" onClick={() => onNavigate("signup")}>
                Create Account
              </button>
            </div>

            <div className="auth-header-copy">
              <h2>{isSignIn ? "Sign In" : "Create Account"}</h2>
              <p>
                {isSignIn
                  ? "Access your AutoBolt account to manage vehicle parts, orders, and service information."
                  : "Create your AutoBolt customer account to manage vehicle parts, orders, and service details in one place."}
              </p>
            </div>

            {error ? (
              <div className="auth-alert" role="alert">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            ) : null}

            <form className="form-grid auth-form-grid" onSubmit={handleSubmit}>
              {!isSignIn ? (
                <>
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="fullName">Full Name</label>
                      <div className="field-icon-wrap">
                        <User size={16} />
                        <input
                          id="fullName"
                          type="text"
                          placeholder="Your full name"
                          value={form.fullName}
                          onChange={(e) => updateField("fullName", e.target.value)}
                          autoComplete="name"
                          required
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="phone">Phone</label>
                      <div className="field-icon-wrap">
                        <Phone size={16} />
                        <input
                          id="phone"
                          type="tel"
                          placeholder="98XXXXXXXX"
                          value={form.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          autoComplete="tel"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="signupEmail">Email</label>
                      <div className="field-icon-wrap">
                        <Mail size={16} />
                        <input
                          id="signupEmail"
                          type="email"
                          placeholder="name@example.com"
                          value={form.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="address">Address</label>
                      <div className="field-icon-wrap">
                        <MapPin size={16} />
                        <input
                          id="address"
                          type="text"
                          placeholder="Optional address"
                          value={form.address}
                          onChange={(e) => updateField("address", e.target.value)}
                          autoComplete="street-address"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="signupPassword">Password</label>
                      <div className="field-icon-wrap">
                        <LockKeyhole size={16} />
                        <input
                          id="signupPassword"
                          type="password"
                          placeholder="Create a secure password"
                          value={form.password}
                          onChange={(e) => updateField("password", e.target.value)}
                          autoComplete="new-password"
                          required
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <div className="field-icon-wrap">
                        <LockKeyhole size={16} />
                        <input
                          id="confirmPassword"
                          type="password"
                          placeholder="Repeat password"
                          value={form.confirmPassword}
                          onChange={(e) => updateField("confirmPassword", e.target.value)}
                          autoComplete="new-password"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="auth-password-hints">
                    <div className="auth-password-hint">
                      <LockKeyhole size={14} />
                      <span>At least 8 characters</span>
                    </div>
                    <div className="auth-password-hint">
                      <LockKeyhole size={14} />
                      <span>Include uppercase, lowercase, and a digit</span>
                    </div>
                    <div className="auth-password-hint">
                      <LockKeyhole size={14} />
                      <span>No non-alphanumeric character is required</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="field">
                    <label htmlFor="signinEmail">Email</label>
                    <div className="field-icon-wrap">
                      <Mail size={16} />
                      <input
                        id="signinEmail"
                        type="email"
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="signinPassword">Password</label>
                    <div className="field-icon-wrap">
                      <LockKeyhole size={16} />
                      <input
                        id="signinPassword"
                        type="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        autoComplete="current-password"
                        required
                      />
                    </div>
                  </div>

                  <div className="auth-forgot-row">
                    <button
                      type="button"
                      className="auth-forgot-link"
                      onClick={() => onNavigate("forgot-password")}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="auth-inline-note">
                    <ShieldCheck size={16} />
                    <span>New to AutoBolt? Create a customer account from the register tab.</span>
                  </div>
                </>
              )}

              <button className="btn btn-primary auth-submit" type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <LoaderCircle size={18} className="spinner" />
                    {isSignIn ? "Signing In..." : "Creating Account..."}
                  </>
                ) : (
                  <>
                    {isSignIn ? "Sign In" : "Create Account"}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer-note">
              {isSignIn ? (
                <>
                  <span>Need a customer account?</span>
                  <button type="button" className="text-link" onClick={() => onNavigate("signup")}>
                    Create Account
                  </button>
                </>
              ) : (
                <>
                  <span>Already have an account?</span>
                  <button type="button" className="text-link" onClick={() => onNavigate("signin")}>
                    Sign in
                  </button>
                </>
              )}
            </div>
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
      footerText="2026 AutoBolt. Vehicle Parts Selling and Inventory Management System. All rights reserved."
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
