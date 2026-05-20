import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Shield, Key, Camera, MapPin,
  Save, LogOut, CheckCircle2, Clock, Globe,
  ArrowLeft, Bell, Settings as SettingsIcon, Edit3, RefreshCw,
  Eye, EyeOff
} from 'lucide-react';
import api from '../../utils/api';
import { getUser, clearAuth } from '../../utils/auth';
import toast from 'react-hot-toast';
import NotificationDropdown from '../../components/NotificationDropdown';

export default function CustomerProfile({ onNavigate }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  const currentUser = getUser();
  const customerId = currentUser?.customerId || currentUser?.id;

  const [profileData, setProfileData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    joinedDate: 'Recently'
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  // Fetch real customer data from API on mount
  useEffect(() => {
    // Load local storage profile image if exists
    const savedImg = localStorage.getItem(`customer_profile_img_${customerId}`);
    if (savedImg) setProfileImage(savedImg);

    if (customerId) {
      setLoading(true);
      api.get(`/api/customers/${customerId}`)
        .then((res) => {
          setProfileData({
            fullName: res.data.fullName || currentUser?.fullName || '',
            email: res.data.email || currentUser?.email || '',
            phone: res.data.phone || '',
            address: res.data.address || '',
            joinedDate: res.data.createdAt ? new Date(res.data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'
          });
        })
        .catch(() => {
          toast.error("Failed to load customer profile details");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [customerId]);

  const handleProfileUpdate = (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    const loadToast = toast.loading("Saving changes...");

    // Update customer in backend
    api.put(`/api/customers/${customerId}`, {
      fullName: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone,
      address: profileData.address
    })
      .then(() => {
        // Save profile image to local storage if uploaded
        if (profileImage) {
          localStorage.setItem(`customer_profile_img_${customerId}`, profileImage);
        }
        
        // Update user state in localStorage
        const savedUser = getUser();
        if (savedUser) {
          savedUser.fullName = profileData.fullName;
          localStorage.setItem('autobolt_user', JSON.stringify(savedUser));
        }

        setIsEditing(false);
        toast.success("Profile updated successfully!", { id: loadToast });
        setTimeout(() => {
          window.location.reload();
        }, 800);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to update profile", { id: loadToast });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        localStorage.setItem(`customer_profile_img_${customerId}`, reader.result);
        toast.success("Profile photo updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    if (passwordData.new.length < 6) {
      return toast.error("Password must be at least 6 characters!");
    }
    
    if (passwordData.new !== passwordData.confirm) {
      return toast.error("New passwords do not match!");
    }

    setLoading(true);
    const loadToast = toast.loading("Changing password...");

    api.post('/api/auth/change-password', {
      currentPassword: passwordData.current,
      newPassword: passwordData.new
    })
      .then(() => {
        toast.success("Password updated successfully!", { id: loadToast });
        setPasswordData({ current: '', new: '', confirm: '' });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to change password. Make sure current password is correct.", { id: loadToast });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header (replaces colliding top-header absolute block) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', paddingLeft: '0.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink)' }}>My Profile</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '4px', marginBottom: 0 }}>Manage your account settings and security</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {activeTab === 'profile' && (
            !isEditing ? (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Edit3 size={18} /> EDIT PROFILE
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>CANCEL</button>
                <button className="btn btn-primary" disabled={loading} onClick={handleProfileUpdate} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {loading ? <RefreshCw className="spinner" size={18} /> : <><Save size={18} /> SAVE CHANGES</>}
                </button>
              </div>
            )
          )}
        </div>
      </div>

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
                  {profileImage ? <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (profileData?.fullName ? profileData.fullName.charAt(0) : 'C')}
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
              <div className="badge badge-brand">Valued Customer</div>
              
              <div style={{ marginTop: '2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                  <Clock size={14} /> Joined {profileData.joinedDate}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                  <Globe size={14} /> System Access: Customer
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
                onClick={() => { clearAuth(); onNavigate('signin'); }}
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
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Update your contact information and mailing address details below.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
                      <input 
                        type="text" className="form-input" 
                        style={{ 
                          width: '100%',
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
                          width: '100%',
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
                      <input 
                        type="text" className="form-input" 
                        style={{ 
                          width: '100%',
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

                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-soft)' }} />
                      <input 
                        type="text" className="form-input" 
                        style={{ 
                          width: '100%',
                          paddingLeft: '2.5rem',
                          opacity: isEditing ? 1 : 0.8,
                          cursor: isEditing ? 'text' : 'not-allowed'
                        }}
                        disabled={!isEditing}
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        placeholder="Enter your street address"
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '2rem', padding: '1.25rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#065f46' }}>Verified Customer Profile</h4>
                    <p style={{ fontSize: '0.8rem', color: '#047857' }}>Your profile is fully verified for secure digital transactions and fleet management.</p>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordChange}>
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.5rem' }}>Security & Password</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Update your current account access credentials to maintain privacy and protection.</p>
                </div>

                <div className="form-group" style={{ maxWidth: '550px', marginBottom: '1.5rem' }}>
                  <label className="form-label">Current Password</label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input 
                      type={showPass.current ? "text" : "password"} 
                      className="form-input" 
                      style={{ paddingRight: '2.5rem', width: '100%' }}
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                      placeholder="Enter current password"
                      required
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
                        placeholder="Minimum 6 characters"
                        required
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
                        required
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
      <style dangerouslySetInnerHTML={{ __html: `
        input::-ms-reveal,
        input::-ms-clear {
          display: none;
        }
        .form-input {
          padding-top: 0.6rem !important;
          padding-bottom: 0.6rem !important;
          height: 38px !important;
        }
      ` }} />
    </div>
  );
}
