import React, { useState } from "react";
import { publicNav } from "../../data/siteContent";
import { Metric } from "../../components/shared";
import api from "../../utils/api";
import toast from "react-hot-toast";

function Shell({ onNavigate, children }) {
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
            {publicNav.filter(item => item.kind !== "action").map((item) => (
              <a key={item.target} className="header-link" href={`#${item.target}`}>{item.label}</a>
            ))}
          </nav>
          <div className="header-actions">
            <button className="btn btn-secondary" type="button" onClick={() => onNavigate("signin")}>Sign In</button>
          </div>
        </div>
      </header>
      <main className="page-shell">{children}</main>
      <footer className="page-footer">
        <div>AutoBolt</div>
        <div>Enter your email to receive a password reset token.</div>
      </footer>
    </>
  );
}

export default function ForgotPasswordPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSent(true);
      toast.success('Check your inbox for the reset token.');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell onNavigate={onNavigate}>
      <section className="section auth-section">
        <div className="auth-layout">
          <div className="auth-panel auth-intro">
            <div className="auth-brand-line">
              <div className="brand-mark">A</div>
              <div className="brand-copy">
                <div>AutoBolt</div>
                <span>Vehicle Parts Management</span>
              </div>
            </div>
            <h1 style={{ marginTop: 18 }}>Forgot your password?</h1>
            <p>Enter the email address linked to your AutoBolt account. If it's registered, you'll receive a reset token by email.</p>
            <div className="metrics">
              <Metric title="Secure" text="One-time token sent to your inbox" />
              <Metric title="Fast" text="Use the token on the reset screen" />
            </div>
          </div>

          <div className="auth-panel auth-form-panel">
            <h2 style={{ margin: "0 0 6px" }}>Reset password</h2>
            <p className="panel-copy">We'll send a reset token to your email address.</p>

            {sent ? (
              <div style={{ marginTop: 20 }}>
                <div className="staff-banner" style={{ marginBottom: 16 }}>
                  <div>
                    <strong>Token sent</strong>
                    <div className="subtle">Check your inbox and copy the reset token.</div>
                  </div>
                  <span className="status good">Sent</span>
                </div>
                <button
                  className="btn btn-primary auth-submit"
                  type="button"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', color: '#111827', fontWeight: '800', width: '100%', padding: '14px 24px' }}
                  onClick={() => onNavigate('reset-password')}
                >
                  Go to Reset Password
                </button>
                <p className="mini-note" style={{ marginTop: 10 }}>
                  Didn't receive it?{' '}
                  <button type="button" className="btn btn-ghost" style={{ fontSize: 'inherit', padding: 0, textDecoration: 'underline' }}
                    onClick={() => { setSent(false); setEmail(''); }}>
                    Try again
                  </button>
                </p>
              </div>
            ) : (
              <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: 16 }}>
                <div className="field">
                  <label htmlFor="fp-email">Email address</label>
                  <input
                    id="fp-email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary auth-submit" type="submit" disabled={loading}
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', color: '#111827', fontWeight: '800', width: '100%', padding: '14px 24px', marginTop: '16px' }}>
                  {loading ? 'Sending…' : 'Send reset token'}
                </button>
                <div className="auth-footer-note" style={{ marginTop: 10 }}>
                  <span>Remembered your password?</span>
                  <button type="button" className="text-link" onClick={() => onNavigate('signin')}>
                    Sign in
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </Shell>
  );
}
