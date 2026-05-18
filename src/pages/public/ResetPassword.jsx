import React, { useState } from "react";
import { publicNav } from "../../data/siteContent";
import { Metric } from "../../components/shared";
import { ChevronRight } from "lucide-react";
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
        <div>Paste the token from your email to set a new password.</div>
      </footer>
    </>
  );
}

export default function ResetPasswordPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/auth/reset-password', { email, token, newPassword });
      setDone(true);
      toast.success('Password reset successfully. You can now sign in.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Check your token and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell onNavigate={onNavigate}>
      <section className="section auth-section">
        <div className="auth-layout">
          <div className="auth-panel auth-intro">
            <a className="auth-back" href="#home" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--accent)', marginBottom: '24px' }}>
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
            <h1 style={{ marginTop: 18 }}>Set a new password.</h1>
            <p>Paste the reset token from the email you received, enter your new password, and confirm it below.</p>
            <div className="metrics">
              <Metric title="One-time token" text="Tokens expire and can only be used once" />
              <Metric title="8+ characters" text="Use a mix of letters and numbers" />
            </div>
            <div style={{ marginTop: 24 }}>
              <button className="btn btn-ghost" type="button" style={{ fontSize: '0.85rem' }}
                onClick={() => onNavigate('forgot-password')}>
                Need a new token?
              </button>
            </div>
          </div>

          <div className="auth-panel auth-form-panel">
            <h2 style={{ margin: "0 0 6px" }}>New password</h2>
            <p className="panel-copy">Enter your email, the token from the email, and your new password.</p>

            {done ? (
              <div style={{ marginTop: 20 }}>
                <div className="staff-banner" style={{ marginBottom: 16 }}>
                  <div>
                    <strong>Password updated</strong>
                    <div className="subtle">Your password has been reset successfully.</div>
                  </div>
                  <span className="status good">Done</span>
                </div>
                <button
                  className="btn btn-primary auth-submit"
                  type="button"
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', color: '#111827', fontWeight: '800', width: '100%', padding: '14px 24px' }}
                  onClick={() => onNavigate('signin')}
                >
                  Sign in now
                </button>
              </div>
            ) : (
              <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: 16 }}>
                <div className="field">
                  <label htmlFor="rp-email">Email address</label>
                  <input id="rp-email" type="email" placeholder="name@example.com" required
                    value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="field">
                  <label htmlFor="rp-token">Reset token</label>
                  <textarea id="rp-token" rows={3}
                    placeholder="Paste the token from your email here"
                    required style={{ resize: 'vertical', wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.8rem' }}
                    value={token} onChange={e => setToken(e.target.value)} />
                </div>
                <div className="field-row">
                  <div className="field">
                    <label htmlFor="rp-new">New password</label>
                    <input id="rp-new" type="password" placeholder="Min 8 characters" required
                      value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="rp-confirm">Confirm password</label>
                    <input id="rp-confirm" type="password" placeholder="Repeat password" required
                      value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  </div>
                </div>
                <button className="btn btn-primary auth-submit" type="submit" disabled={loading}
                  style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', color: '#111827', fontWeight: '800', width: '100%', padding: '14px 24px', marginTop: '16px' }}>
                  {loading ? 'Resetting…' : 'Reset password'}
                </button>
                <p className="mini-note" style={{ marginTop: 8 }}>
                  <button type="button" className="btn btn-ghost" style={{ fontSize: 'inherit', padding: 0, textDecoration: 'underline' }}
                    onClick={() => onNavigate('signin')}>
                    Back to sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </Shell>
  );
}
