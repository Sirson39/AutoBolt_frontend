import React from 'react';
import {
  LayoutDashboard, CalendarDays, Wrench, Star, Car, FileText, LogOut, User, Home
} from 'lucide-react';
import { clearAuth, getUser } from '../utils/auth';

const navItems = [
  { label: 'Overview', section: true },
  { to: 'customer',  label: 'Dashboard', icon: LayoutDashboard },
  { to: 'update-profile', label: 'My Profile', icon: User },
  { label: 'My Services', section: true },
  { to: 'customer-bookings',  label: 'My Bookings', icon: CalendarDays },
  { to: 'customer-part-requests', label: 'Part Requests', icon: Wrench },
  { to: 'customer-reviews',   label: 'Service Reviews', icon: Star },
  { to: 'customer-vehicles',  label: 'My Vehicles', icon: Car },
  { to: 'customer-history',   label: 'Service History', icon: FileText },
];

export default function CustomerLayout({ children, onNavigate }) {
  const currentUser = getUser();
  const currentRoute = window.location.hash.replace(/^#/, "") || 'customer';
  const customerId = currentUser?.customerId || currentUser?.id;
  const savedImg = localStorage.getItem(`customer_profile_img_${customerId}`);

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good morning';
    if (hrs < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar no-print">
        <div className="sidebar-logo">
          <h1>Auto<span>Bolt</span></h1>
          <p>Customer Panel</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, i) =>
            item.section ? (
              <p key={i} className="nav-section-label">{item.label}</p>
            ) : (
              <button
                key={i}
                onClick={() => onNavigate(item.to)}
                className={`nav-item ${currentRoute === item.to ? 'active' : ''}`}
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  textAlign: 'left', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '4px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: currentRoute === item.to ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'
                }}
              >
                <item.icon className="nav-icon" size={18} style={{ marginRight: '12px', color: currentRoute === item.to ? 'var(--brand)' : 'inherit' }} />
                {item.label}
              </button>
            )
          )}
        </nav>

        <div className="sidebar-footer">
          {currentUser && (
            <div 
              onClick={() => onNavigate('update-profile')}
              style={{ 
                padding: '10px 16px', 
                borderTop: '1px solid rgba(255,255,255,0.07)', 
                marginBottom: '4px',
                cursor: 'pointer',
                borderRadius: 'var(--radius-sm)',
                transition: 'background 0.2s ease',
              }}
              className="sidebar-user-card"
            >
              <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 700, marginBottom: 2 }}>
                {currentUser.fullName}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.email}
              </div>
            </div>
          )}
          <button
            className="nav-item"
            style={{ color: '#e53e3e', width: '100%', border: 'none', background: 'none', textAlign: 'left', display: 'flex', alignItems: 'center' }}
            onClick={() => { clearAuth(); onNavigate('signin'); }}
          >
            <LogOut className="nav-icon" size={18} style={{ marginRight: '12px' }} />
            Logout
          </button>
        </div>
      </aside>

      <div className="main-content" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="top-header no-print" style={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.75rem',
          height: '64px',
          background: 'var(--surface)',
        }}>
          <div className="page-title" style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--ink)' }}>
            {getGreeting()}, {currentUser?.fullName?.split(' ')[0] || 'User'} 👋
          </div>
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-green" style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
                display: 'inline-block'
              }} />
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                LIVE SYSTEM &bull; {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => onNavigate('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: '600',
                borderRadius: 'var(--radius-sm)',
                transition: 'all 0.2s ease'
              }}
            >
              <Home size={14} /> Back to Home
            </button>
            <div 
              onClick={() => onNavigate('update-profile')}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--brand)',
                color: '#fff',
                fontWeight: '800',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                border: '2px solid var(--border)',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.borderColor = 'var(--brand)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
              title="My Profile"
            >
              {savedImg ? (
                <img src={savedImg} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                currentUser?.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'C'
              )}
            </div>
          </div>
        </header>

        <div className="page-content" style={{ flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
