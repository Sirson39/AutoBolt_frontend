import React from 'react';
import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Shield, Key, Camera, 
  Save, LogOut, CheckCircle2, Clock, Globe,
  ArrowLeft, Bell, Settings as SettingsIcon, Edit3, RefreshCw,
  Eye, EyeOff
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import NotificationDropdown from '../../components/NotificationDropdown';

export default function AdminProfile({ onNavigate }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useState(null); 

  // Mocking the current admin data
  const [profileData, setProfileData] = useState({
    fullName: 'System Admin',
    email: 'admin@autobolt.com',
    phone: '9841234567',
    role: 'Super Admin',
    joinedDate: 'Jan 12, 2026',
    lastLogin: new Date().toLocaleString()
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [actualPassword, setActualPassword] = useState('admin123'); 
  const [passwordHistory, setPasswordHistory] = useState(['admin123', 'oldpassword123']); 
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  useEffect(() => {
    const savedImg = localStorage.getItem('admin_profile_img');
    if (savedImg) setProfileImage(savedImg);
  }, []);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    const loadToast = toast.loading("Updating profile...");

    // Simulate API call
    setTimeout(() => {
      if (profileImage) localStorage.setItem('admin_profile_img', profileImage);
      setLoading(false);
      setIsEditing(false);
      toast.success("Profile updated successfully!", { id: loadToast });
    }, 1500);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        toast.success("Profile photo updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (passwordData.current !== actualPassword) {
      return toast.error("Current password is incorrect!");
    }

    if (passwordData.new.length < 8) {
      return toast.error("Password must be at least 8 characters!");
    }
    
    if (passwordData.new !== passwordData.confirm) {
      return toast.error("New passwords do not match!");
    }

    if (passwordData.new === passwordData.current) {
      return toast.error("New password cannot be the same as current password!");
    }

    if (passwordHistory.includes(passwordData.new)) {
      return toast.error("You have used this password recently.");
    }

    const loadToast = toast.loading("Changing password...");
    setTimeout(() => {
      setActualPassword(passwordData.new);
      setPasswordHistory([...passwordHistory, passwordData.new]);
      toast.success("Password changed successfully!", { id: loadToast });
      setPasswordData({ current: '', new: '', confirm: '' });
    }, 1200);
  };

  return (
    <>
      <header className="top-header">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('admin')} style={{ padding: '0.5rem' }}>
              <ArrowLeft size={18} />
            </button>
            <span className="page-title">My Profile</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '4px', marginLeft: '3.1rem' }}>Manage your account settings and security</p>
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
          <div className="avatar" style={{ background: 'var(--brand)', color: '#fff', fontWeight: '800', overflow: 'hidden' }}>
            {profileImage ? <img src={profileImage} alt="Admin" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (profileData?.fullName ? profileData.fullName.charAt(0) : 'A')}
          </div>
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
                  boxShadow: '0 8px 24px rgba(217, 93, 57, 0.3)',
                  overflow: 'hidden'
                }}>
                  {profileImage ? <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (profileData?.fullName ? profileData.fullName.charAt(0) : 'A')}
                </div>
                <input 
                  type="file" 
                  id="profile-upload"
                  hidden 
                  accept="image/*"
                  disabled={!isEditing}
                  onChange={handleImageChange}
                />
                <label 
                  htmlFor={isEditing ? "profile-upload" : ""}
                  style={{
                    position: 'absolute', bottom: '0', right: '0',
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: isEditing ? '#fff' : 'var(--surface-2)', 
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isEditing ? 'var(--brand)' : 'var(--ink-soft)', 
                    cursor: isEditing ? 'pointer' : 'not-allowed', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    opacity: isEditing ? 1 : 0.6
                  }}
                  onMouseEnter={(e) => isEditing && (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Camera size={16} />
                </label>
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
                          background: 'var(--surface-2)',
                          cursor: 'not-allowed',
                          opacity: 0.7
                        }}
                        disabled
                        value={profileData.email}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ maxWidth: '267px' }}>
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

                <div style={{ marginTop: '2rem', padding: '1.25rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#065f46' }}>Verified Account</h4>
                    <p style={{ fontSize: '0.8rem', color: '#047857' }}>Your account is secured with Super Admin level permissions.</p>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordChange}>
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.5rem' }}>Security & Password</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Ensure your account is using a long, random password to stay secure.</p>
                </div>

                <div className="form-group" style={{ maxWidth: '267px', marginBottom: '1.5rem' }}>
                  <label className="form-label">Current Password</label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input 
                      type={showPass.current ? "text" : "password"} 
                      className="form-input" 
                      style={{ paddingRight: '2.5rem', width: '100%' }}
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                      placeholder="Enter current password"
                    />
                    {passwordData.current && (
                      <button 
                        type="button" 
                        onClick={() => setShowPass({...showPass, current: !showPass.current})}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        {showPass.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2rem 0' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', maxWidth: '550px' }}>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input 
                        type={showPass.new ? "text" : "password"} 
                        className="form-input" 
                        style={{ paddingRight: '2.5rem', width: '100%' }}
                        value={passwordData.new}
                        onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                        placeholder="Minimum 8 characters"
                      />
                      {passwordData.new && (
                        <button 
                          type="button" 
                          onClick={() => setShowPass({...showPass, new: !showPass.new})}
                          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          {showPass.new ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input 
                        type={showPass.confirm ? "text" : "password"} 
                        className="form-input" 
                        style={{ paddingRight: '2.5rem', width: '100%' }}
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                        placeholder="Repeat new password"
                      />
                      {passwordData.confirm && (
                        <button 
                          type="button" 
                          onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})}
                          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          {showPass.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      )}
                    </div>
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
      <style>{`
        input::-ms-reveal,
        input::-ms-clear {
          display: none;
        }
        .form-input {
          padding-top: 0.6rem !important;
          padding-bottom: 0.6rem !important;
          height: 38px !important;
        }
      `}</style>
    </>
  );
}
