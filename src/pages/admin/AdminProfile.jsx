import AdminLayout from '../../components/AdminLayout';
import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Shield, Key, Camera, 
  Save, LogOut, CheckCircle2, Clock, Globe,
  ArrowLeft, Bell, Settings as SettingsIcon, Edit3, RefreshCw
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import NotificationDropdown from '../../components/NotificationDropdown';

export default function AdminProfile({ onNavigate }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Mocking the current admin data (in a real app, this would come from a /me endpoint)
  const [profileData, setProfileData] = useState({
    fullName: 'System Administrator',
    email: 'admin@autobolt.com',
    phone: '9841234567',
    role: 'Super Admin',
    joinedDate: '2026-01-15',
    lastLogin: new Date().toLocaleString()
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    const loadToast = toast.loading("Updating profile...");
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsEditing(false);
      toast.success("Profile updated successfully!", { id: loadToast });
    }, 1500);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      return toast.error("Passwords do not match!");
    }
    
    const loadToast = toast.loading("Changing password...");
    setTimeout(() => {
      toast.success("Password changed successfully!", { id: loadToast });
      setPasswordData({ current: '', new: '', confirm: '' });
    }, 1200);
  };

  return (
    <>
      <header className="top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('admin')}>
            <ArrowLeft size={18} />
          </button>
          <span className="page-title">My Profile</span>
        </div>
        <div className="header-actions">
          <NotificationDropdown onNavigate={onNavigate} />
          {activeTab === 'profile' && (
            !isEditing ? (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                <Edit3 size={18} /> EDIT PROFILE
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>CANCEL</button>
                <button className="btn btn-primary" disabled={loading} onClick={handleProfileUpdate}>
                  {loading ? <RefreshCw className="spinner" size={18} /> : <><Save size={18} /> SAVE CHANGES</>}
                </button>
              </div>
            )
          )}
          <div className="avatar">A</div>
        </div>
      </header>

      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
          
          {/* Left Column: Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="stat-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1.5rem' }}>
                <div style={{ 
                  width: '100%', height: '100%', borderRadius: '50%', 
                  background: 'var(--brand)', color: '#fff', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: '2.5rem', fontWeight: '800',
                  boxShadow: '0 8px 24px rgba(217, 93, 57, 0.3)'
                }}>
                  {profileData.fullName.charAt(0)}
                </div>
                <button style={{
                  position: 'absolute', bottom: '0', right: '0',
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: '#fff', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--ink)', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <Camera size={16} />
                </button>
              </div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--ink)', marginBottom: '0.5rem' }}>{profileData.fullName}</h2>
              <div className="badge badge-brand">{profileData.role}</div>
              
              <div style={{ marginTop: '2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                  <Clock size={14} /> Joined {profileData.joinedDate}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                  <Globe size={14} /> System Access: Full
                </div>
              </div>
            </div>

            <div className="table-card" style={{ padding: '0.5rem' }}>
              <button 
                className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-ghost'}`} 
                style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: activeTab === 'profile' ? 'var(--brand)' : 'transparent' }}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} /> Profile Information
              </button>
              <button 
                className={`btn ${activeTab === 'security' ? 'btn-primary' : 'btn-ghost'}`} 
                style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: activeTab === 'security' ? 'var(--brand)' : 'transparent', marginTop: '4px' }}
                onClick={() => setActiveTab('security')}
              >
                <Key size={18} /> Security & Password
              </button>
              <button 
                className="btn btn-ghost" 
                style={{ width: '100%', justifyContent: 'flex-start', border: 'none', marginTop: '4px', color: 'var(--danger)' }}
                onClick={() => onNavigate('home')}
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>

          {/* Right Column: Forms */}
          <div className="table-card" style={{ padding: '2rem' }}>
            {activeTab === 'profile' ? (
              <form onSubmit={handleProfileUpdate}>
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.5rem' }}>Profile Information</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Update your personal details and how others see you on the platform.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
                      <input 
                        type="text" className="form-input" 
                        style={{ 
                          paddingLeft: '2.5rem',
                          opacity: isEditing ? 1 : 0.8,
                          cursor: isEditing ? 'text' : 'not-allowed'
                        }}
                        disabled={!isEditing}
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
                      <input 
                        type="email" className="form-input" 
                        style={{ 
                          paddingLeft: '2.5rem',
                          opacity: isEditing ? 1 : 0.8,
                          cursor: isEditing ? 'text' : 'not-allowed'
                        }}
                        disabled={!isEditing}
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ maxWidth: '50%', marginBottom: '2rem' }}>
                  <label className="form-label">Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
                    <input 
                      type="text" className="form-input" 
                      style={{ 
                        paddingLeft: '2.5rem',
                        opacity: isEditing ? 1 : 0.8,
                        cursor: isEditing ? 'text' : 'not-allowed'
                      }}
                      disabled={!isEditing}
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div style={{ padding: '1.25rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--ink)' }}>Verified Account</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>Your account is secured with Super Admin level permissions.</div>
                  </div>
                </div>

                {isEditing && (
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                    <Save size={18} /> Save Changes
                  </button>
                )}
              </form>
            ) : (
              <form onSubmit={handlePasswordChange}>
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.5rem' }}>Security & Password</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Ensure your account is using a long, random password to stay secure.</p>
                </div>

                <div className="form-group" style={{ maxWidth: '60%', marginBottom: '1.5rem' }}>
                  <label className="form-label">Current Password</label>
                  <input 
                    type="password" className="form-input" 
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                    placeholder="Enter current password"
                  />
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2rem 0' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input 
                      type="password" className="form-input" 
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                      placeholder="Minimum 8 characters"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input 
                      type="password" className="form-input" 
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                  <Key size={18} /> Update Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
