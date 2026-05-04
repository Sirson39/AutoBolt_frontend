import React, { useState } from "react";
import { UserCircle } from "lucide-react";
import api from "../../utils/api";
import { getUser, isAuthenticated, setAuth } from "../../utils/auth";
import toast from "react-hot-toast";

export default function UpdateProfilePage({ onNavigate }) {
  const currentUser = getUser();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated()) {
    onNavigate('signin');
    return null;
  }

  const isAdmin = currentUser?.role === 'Admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/api/auth/profile', { fullName, phone: phone || undefined });
      // Update stored user name so sidebar shows the new name
      const token = localStorage.getItem('autobolt_token');
      setAuth({
        token: token || '',
        role: currentUser?.role || '',
        fullName: data.fullName,
        email: data.email,
        expiry: currentUser?.expiry || new Date().toISOString(),
      });
      toast.success('Profile updated successfully.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Profile update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="top-header">
        <div>
          <div className="page-heading">Update Profile</div>
          <div className="page-subtitle">Edit your name and phone number.</div>
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
            <div className="stat-card-icon accent" style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCircle size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{currentUser?.fullName}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>
                {currentUser?.email} &mdash; <span style={{ textTransform: 'capitalize' }}>{currentUser?.role}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input
                className="form-input"
                type="text"
                placeholder="Your full name"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Phone number{' '}
                <span style={{ color: 'var(--ink-soft)', fontWeight: 400, fontSize: '0.8rem' }}>(optional)</span>
              </label>
              <input
                className="form-input"
                type="tel"
                placeholder="98XXXXXXXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Saving…' : 'Save changes'}
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
