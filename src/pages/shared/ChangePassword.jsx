import React, { useState } from "react";
import { KeyRound } from "lucide-react";
import api from "../../utils/api";
import { getUser, isAuthenticated } from "../../utils/auth";
import toast from "react-hot-toast";

export default function ChangePasswordPage({ onNavigate }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const currentUser = getUser();

  if (!isAuthenticated()) {
    onNavigate('signin');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/auth/change-password', { currentPassword, newPassword });
      toast.success('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed.');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = currentUser?.role === 'Admin';

  return (
    <div className="page-content">
      <div className="top-header">
        <div>
          <div className="page-heading">Change Password</div>
          <div className="page-subtitle">Update your login password.</div>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => onNavigate(isAdmin ? 'admin' : 'staff-dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div className="table-card" style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div className="stat-card-icon brand" style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <KeyRound size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>Change Password</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>{currentUser?.email}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Current password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Enter current password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">New password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Min 8 characters, include uppercase and digit"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm new password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Repeat new password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Saving…' : 'Update password'}
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => onNavigate(isAdmin ? 'admin' : 'staff-dashboard')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
