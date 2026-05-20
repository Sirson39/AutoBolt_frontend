import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { CheckCircle, XCircle, Loader2, ShieldCheck, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { clearAuth } from '../../utils/auth';

export default function VerifyEmail({ onNavigate }) {
  const [status, setStatus] = useState('loading'); // loading, setup, success, error
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Handle hash-based routing with parameters like #verify-email?userId=...
    const hash = window.location.hash;
    const queryString = hash.includes('?') ? hash.split('?')[1] : '';
    const params = new URLSearchParams(queryString);
    
    const uid = params.get('userId');
    const t = params.get('token');

    if (uid && t) {
      setUserId(uid);
      setToken(t);
      setStatus('setup');
    } else {
      setStatus('error');
    }
  }, []);

  const handleSetup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setStatus('loading');
    try {
      await api.post('/api/staff/confirm-setup', {
        userId: parseInt(userId),
        token: token,
        newPassword: formData.password
      });
      setStatus('success');
      toast.success("Account activated! Welcome to the team.");
    } catch (error) {
      setStatus('error');
      toast.error(error.response?.data || "Verification failed. The link may be expired.");
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'radial-gradient(circle at top right, #1e293b, #0f172a)',
      padding: '2rem',
      fontFamily: 'Outfit, sans-serif'
    }}>
      {/* Decorative background elements */}
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '300px', height: '300px', background: 'rgba(217, 93, 57, 0.05)', filter: 'blur(100px)', borderRadius: '50%' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', background: 'rgba(56, 189, 248, 0.03)', filter: 'blur(100px)', borderRadius: '50%' }}></div>

      <div className="verify-card" style={{ 
        maxWidth: '480px', 
        width: '100%', 
        padding: '3.5rem 3rem', 
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(25px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '32px',
        textAlign: 'center',
        boxShadow: '0 40px 80px -15px rgba(0, 0, 0, 0.6)',
        position: 'relative',
        zIndex: 1,
        animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {status === 'loading' && (
          <div style={{ padding: '2rem 0' }}>
            <div className="loader-container">
              <Loader2 className="spinner" size={56} color="#d95d39" />
            </div>
            <h2 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: '800', marginTop: '2rem' }}>Securing Workspace</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.75rem' }}>Finalizing your credentials...</p>
          </div>
        )}

        {status === 'setup' && (
          <div style={{ textAlign: 'left' }}>
            <div style={{ 
              width: '64px', height: '64px', background: 'linear-gradient(135deg, #d95d39 0%, #f97316 100%)', 
              borderRadius: '20px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', marginBottom: '2rem', boxShadow: '0 10px 20px -5px rgba(217, 93, 57, 0.4)'
            }}>
              <ShieldCheck size={32} color="#fff" />
            </div>
            
            <h2 style={{ color: '#fff', fontSize: '2.25rem', fontWeight: '900', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              Finalize Account
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Set your permanent access password to activate your AutoBolt staff dashboard.
            </p>

            <form onSubmit={handleSetup} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div className="input-group">
                <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem', display: 'block' }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                  <input 
                    type="password" 
                    required 
                    placeholder="Enter secure password"
                    style={{ 
                      width: '100%', padding: '1.1rem 1rem 1.1rem 3.25rem', 
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '16px', color: '#fff', fontSize: '1rem', transition: 'all 0.3s ease',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                    }}
                    className="styled-input"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <div className="input-group">
                <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.75rem', display: 'block' }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                  <input 
                    type="password" 
                    required 
                    placeholder="Repeat password"
                    style={{ 
                      width: '100%', padding: '1.1rem 1rem 1.1rem 3.25rem', 
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                      borderRadius: '16px', color: '#fff', fontSize: '1rem', transition: 'all 0.3s ease',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                    }}
                    className="styled-input"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="setup-btn" style={{ 
                marginTop: '1.5rem', padding: '1.1rem', fontSize: '1.1rem', fontWeight: '800', 
                borderRadius: '16px', background: '#d95d39', color: '#fff', border: 'none',
                cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 15px 30px -8px rgba(217, 93, 57, 0.4)'
              }}>
                Activate My Account
              </button>
            </form>
          </div>
        )}

        {status === 'success' && (
          <div style={{ padding: '1rem 0' }}>
            <div style={{ 
              width: '80px', height: '80px', background: 'rgba(40, 167, 69, 0.15)', 
              borderRadius: '50%', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', margin: '0 auto 2.5rem'
            }}>
              <CheckCircle size={48} color="#28a745" />
            </div>
            <h2 style={{ color: '#fff', fontSize: '2.25rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Success!</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '1rem', lineHeight: '1.8', fontSize: '1.1rem' }}>
              Your AutoBolt account has been successfully configured and activated! You can now log in to access your dashboard portal.
            </p>
            <button 
              className="setup-btn" 
              style={{ marginTop: '3rem', width: '100%', background: '#28a745', padding: '1.1rem', fontSize: '1.1rem', fontWeight: '800', borderRadius: '16px', border: 'none', color: '#fff', cursor: 'pointer' }}
              onClick={() => { clearAuth(); onNavigate('signin'); }}
            >
              Go to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div style={{ padding: '1rem 0' }}>
            <div style={{ 
              width: '80px', height: '80px', background: 'rgba(239, 68, 68, 0.15)', 
              borderRadius: '50%', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', margin: '0 auto 2.5rem'
            }}>
              <XCircle size={48} color="#ef4444" />
            </div>
            <h2 style={{ color: '#fff', fontSize: '2.25rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Invalid Link</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '1rem', lineHeight: '1.8', fontSize: '1.1rem' }}>
              This verification link has expired or is invalid. Please contact support or your administrator to receive a new invitation.
            </p>
            <button 
              className="setup-btn" 
              style={{ marginTop: '3rem', width: '100%', background: 'rgba(255,255,255,0.1)', padding: '1.1rem', fontSize: '1.1rem', fontWeight: '800', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer' }}
              onClick={() => onNavigate('home')}
            >
              Return Home
            </button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&display=swap');
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .spinner { animation: rotate 2s linear infinite; }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .styled-input:focus {
          background: rgba(255,255,255,0.08) !important;
          border-color: #d95d39 !important;
          box-shadow: 0 0 0 4px rgba(217, 93, 57, 0.2), inset 0 2px 4px rgba(0,0,0,0.2) !important;
        }
        
        .setup-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
          box-shadow: 0 20px 40px -10px rgba(217, 93, 57, 0.5);
        }
        
        .setup-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
