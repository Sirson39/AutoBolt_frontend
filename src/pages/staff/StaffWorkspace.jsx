import React, { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, UserPlus, Search, UserCheck, Car,
  Receipt, Mail, History, BarChart3, LogOut, Home, Lock, User,
  Users, FileText, CalendarDays, AlertTriangle, ArrowRight, CheckCircle, Wrench, ShieldAlert,
  Phone, Key, Camera, Save, Clock, Globe, Edit3, Eye, EyeOff, MapPin, RefreshCw, Shield
} from "lucide-react";
import { clearAuth, getUser } from "../../utils/auth";
import api from "../../utils/api";
import toast from "react-hot-toast";

function getHashParam(name) {
  const hash = window.location.hash.replace(/^#[^?]*\??/, "");
  return new URLSearchParams(hash).get(name);
}

const sidebarGroups = [
  { label: 'Overview', section: true },
  { to: 'staff-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Customers & Fleet', section: true },
  { to: 'customer-registration', label: 'New Registration', icon: UserPlus },
  { to: 'customer-search', label: 'Find Records', icon: Search },
  { to: 'customer-details', label: 'Customer Details', icon: UserCheck },
  { to: 'vehicle-details', label: 'Vehicle Fleet', icon: Car },
  { label: 'Sales & Billing', section: true },
  { to: 'sales-invoice', label: 'New Sales Invoice', icon: Receipt },
  { to: 'email-invoice', label: 'Send Invoices', icon: Mail },
  { label: 'Activity & Reports', section: true },
  { to: 'customer-history', label: 'Service History', icon: History },
  { to: 'customer-reports', label: 'Insights & Overdue', icon: BarChart3 }
];

export default function StaffWorkspace({ routeKey, onNavigate }) {
  const isNavActive = (key) => key === routeKey;
  const currentUser = getUser();
  const [headerProfileImage, setHeaderProfileImage] = useState(null);

  useEffect(() => {
    const savedImg = localStorage.getItem(`staff_profile_img_${currentUser?.email}`);
    if (savedImg) setHeaderProfileImage(savedImg);
  }, [currentUser?.email]);

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
          <p>Staff Workspace</p>
        </div>

        <nav className="sidebar-nav">
          {sidebarGroups.map((item, i) =>
            item.section ? (
              <p key={i} className="nav-section-label">{item.label}</p>
            ) : (
              <button
                key={i}
                onClick={() => onNavigate(item.to)}
                className={`nav-item ${isNavActive(item.to) ? 'active' : ''}`}
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
                  color: isNavActive(item.to) ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'
                }}
              >
                <item.icon className="nav-icon" size={18} style={{ marginRight: '12px', color: isNavActive(item.to) ? 'var(--brand)' : 'inherit' }} />
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
            {getGreeting()}, {currentUser?.fullName?.split(' ')[0] || 'Staff'} 👋
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
                STAFF MODE &bull; {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
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
              {headerProfileImage ? (
                <img 
                  src={headerProfileImage} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                currentUser?.fullName?.charAt(0).toUpperCase() || 'S'
              )}
            </div>
          </div>
        </header>

        <div className="dashboard-main" style={{ flex: 1, padding: '1.75rem' }}>
          <div className="header-actions" style={{ marginBottom: 24, display: 'flex', gap: '10px' }}>
            <button 
              className={`btn btn-sm ${routeKey === "staff-dashboard" ? "btn-primary" : "btn-secondary"}`} 
              type="button" 
              onClick={() => onNavigate("staff-dashboard")}
            >
              Workspace Dashboard
            </button>
            <button 
              className={`btn btn-sm ${routeKey === "customer-search" ? "btn-primary" : "btn-secondary"}`} 
              type="button" 
              onClick={() => onNavigate("customer-search")}
            >
              Find Customers
            </button>
            <button 
              className={`btn btn-sm ${routeKey === "sales-invoice" ? "btn-primary" : "btn-secondary"}`} 
              type="button" 
              onClick={() => onNavigate("sales-invoice")}
            >
              + New Sales Invoice
            </button>
          </div>

          {routeKey === "staff-dashboard" && <StaffDashboard onNavigate={onNavigate} />}
          {routeKey === "customer-registration" && <CustomerRegistration onNavigate={onNavigate} />}
          {routeKey === "customer-search" && <CustomerSearch onNavigate={onNavigate} />}
          {routeKey === "customer-details" && <CustomerDetails onNavigate={onNavigate} />}
          {routeKey === "vehicle-details" && <VehicleDetails onNavigate={onNavigate} />}
          {routeKey === "sales-invoice" && <SalesInvoice onNavigate={onNavigate} />}
          {routeKey === "email-invoice" && <EmailInvoice onNavigate={onNavigate} />}
          {routeKey === "customer-history" && <CustomerHistory onNavigate={onNavigate} />}
          {routeKey === "customer-reports" && <CustomerReports />}
          {routeKey === "update-profile" && <StaffProfile onNavigate={onNavigate} />}
        </div>
      </div>
    </div>
  );
}

function StaffDashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    customersCount: 0,
    invoicesCount: 0,
    activeBookingsCount: 0,
    lowStockCount: 0
  });
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [lowStockParts, setLowStockParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [customers, invoices, upcoming, lowStock] = await Promise.all([
          api.get("/api/customers"),
          api.get("/api/invoices"),
          api.get("/api/bookings/upcoming"),
          api.get("/api/parts/low-stock")
        ]);

        setStats({
          customersCount: Array.isArray(customers.data) ? customers.data.length : 0,
          invoicesCount: Array.isArray(invoices.data) ? invoices.data.length : 0,
          activeBookingsCount: Array.isArray(upcoming.data) ? upcoming.data.length : 0,
          lowStockCount: Array.isArray(lowStock.data) ? lowStock.data.length : 0
        });

        setUpcomingBookings(Array.isArray(upcoming.data) ? upcoming.data.slice(0, 5) : []);
        setLowStockParts(Array.isArray(lowStock.data) ? lowStock.data.slice(0, 5) : []);
      } catch (err) {
        console.error("Failed to load staff dashboard metrics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getBookingStatusBadge = (status) => {
    const s = String(status).toLowerCase();
    if (s === "pending" || s === "0") return <span className="status warn">Pending</span>;
    if (s === "confirmed" || s === "1") return <span className="status good">Confirmed</span>;
    if (s === "completed" || s === "2") return <span className="status good">Completed</span>;
    if (s === "cancelled" || s === "3") return <span className="status danger">Cancelled</span>;
    return <span className="status subtle">{status || "Unknown"}</span>;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card skeleton" style={{ height: '110px', borderRadius: 'var(--radius-md)' }}></div>
          ))}
        </div>
        <div className="staff-grid-2">
          <div className="card skeleton" style={{ height: '350px', borderRadius: 'var(--radius-md)' }}></div>
          <div className="card skeleton" style={{ height: '350px', borderRadius: 'var(--radius-md)' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Dynamic KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        <div 
          className="card kpi-card" 
          onClick={() => onNavigate("customer-search")}
          style={{ padding: '1.25rem', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s ease', cursor: 'pointer' }} 
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} 
          onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
        >
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(56, 189, 248, 0.1)', color: '#0284c7' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', fontWeight: 600 }}>Total Customers</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)', marginTop: '0.15rem' }}>{stats.customersCount}</div>
          </div>
        </div>

        <div 
          className="card kpi-card" 
          onClick={() => onNavigate("sales-invoice")}
          style={{ padding: '1.25rem', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s ease', cursor: 'pointer' }} 
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} 
          onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
        >
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(234, 179, 8, 0.1)', color: '#ca8a04' }}>
            <FileText size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', fontWeight: 600 }}>Sales Invoices</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)', marginTop: '0.15rem' }}>{stats.invoicesCount}</div>
          </div>
        </div>

        <div 
          className="card kpi-card" 
          onClick={() => {
            const el = document.getElementById("intake-bookings-queue");
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{ padding: '1.25rem', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s ease', cursor: 'pointer' }} 
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} 
          onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
        >
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
            <CalendarDays size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', fontWeight: 600 }}>Active Bookings</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--ink)', marginTop: '0.15rem' }}>{stats.activeBookingsCount}</div>
          </div>
        </div>

        <div 
          className="card kpi-card" 
          onClick={() => {
            const el = document.getElementById("critical-stock-warnings");
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              toast.success("Inventory Status Excellent: All spare parts fully stocked!");
            }
          }}
          style={{ padding: '1.25rem', border: `1px solid ${stats.lowStockCount > 0 ? 'rgba(239, 68, 68, 0.2)' : 'var(--border)'}`, background: 'var(--surface)', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s ease', cursor: 'pointer' }} 
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} 
          onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
        >
          <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: stats.lowStockCount > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(107, 114, 128, 0.1)', color: stats.lowStockCount > 0 ? '#dc2626' : '#4b5563' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', fontWeight: 600 }}>Low Stock Parts</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: stats.lowStockCount > 0 ? '#ef4444' : 'var(--ink)', marginTop: '0.15rem' }}>{stats.lowStockCount}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem' }}>
        {/* Left Column: Intake Queue + Quick Tools stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Active Booking Intake Queue */}
          <article id="intake-bookings-queue" className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1.5rem', display: 'flex', flexDirection: 'column', minHeight: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <CalendarDays size={20} className="brand-icon" style={{ color: 'var(--brand)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink)', margin: 0 }}>Intake &amp; Bookings Queue</h3>
            </div>
            {upcomingBookings.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
                <CheckCircle size={36} style={{ color: '#10b981', marginBottom: '0.75rem' }} />
                <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>No pending bookings today.</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '0.25rem' }}>Workspace operations are fully clear!</p>
              </div>
            ) : (
              <div className="table-wrap" style={{ flex: 1 }}>
                <table className="table" style={{ fontSize: '0.85rem' }}>
                  <thead>
                    <tr>
                      <th style={{ color: 'var(--ink)', fontWeight: '800', borderBottom: '2px solid var(--border)' }}>Customer</th>
                      <th style={{ color: 'var(--ink)', fontWeight: '800', borderBottom: '2px solid var(--border)' }}>Date &amp; Time</th>
                      <th style={{ color: 'var(--ink)', fontWeight: '800', borderBottom: '2px solid var(--border)' }}>Status</th>
                      <th style={{ color: 'var(--ink)', fontWeight: '800', borderBottom: '2px solid var(--border)' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingBookings.map((b) => (
                      <tr key={b.id}>
                        <td style={{ fontWeight: '600', color: 'var(--ink)' }}>{b.customerName}</td>
                        <td>
                          <div style={{ fontWeight: '700', color: 'var(--ink)' }}>{b.serviceDate ? new Date(b.serviceDate).toLocaleDateString() : "—"}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
                            {b.serviceDate ? new Date(b.serviceDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "—"}
                          </div>
                        </td>
                        <td>{getBookingStatusBadge(b.status)}</td>
                        <td>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => onNavigate(`customer-details?id=${b.customerId}`)}
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            Details <ArrowRight size={12} style={{ marginLeft: 4 }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>

          {/* Workspace Quick Tools (Horizontal Toolbar beneath Queue) */}
          <article className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <Wrench size={18} className="brand-icon" style={{ color: 'var(--brand)', margin: 0 }} />
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--ink)', margin: 0 }}>Workspace Quick Tools</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
              <button 
                className="btn btn-secondary" 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', border: '1px solid var(--border)', background: 'var(--surface-2)', transition: 'all 0.2s', height: '80px', width: '100%' }}
                onClick={() => onNavigate("customer-registration")}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--brand)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <UserPlus size={18} style={{ color: 'var(--brand)' }} />
                <span style={{ fontWeight: '700', color: 'var(--ink)', fontSize: '0.72rem', textAlign: 'center' }}>Register Customer</span>
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', border: '1px solid var(--border)', background: 'var(--surface-2)', transition: 'all 0.2s', height: '80px', width: '100%' }}
                onClick={() => onNavigate("customer-search")}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--brand)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <Search size={18} style={{ color: 'var(--brand)' }} />
                <span style={{ fontWeight: '700', color: 'var(--ink)', fontSize: '0.72rem', textAlign: 'center' }}>Search Records</span>
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', border: '1px solid var(--border)', background: 'var(--surface-2)', transition: 'all 0.2s', height: '80px', width: '100%' }}
                onClick={() => onNavigate("sales-invoice")}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--brand)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <Receipt size={18} style={{ color: 'var(--brand)' }} />
                <span style={{ fontWeight: '700', color: 'var(--ink)', fontSize: '0.72rem', textAlign: 'center' }}>Create Invoice</span>
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', border: '1px solid var(--border)', background: 'var(--surface-2)', transition: 'all 0.2s', height: '80px', width: '100%' }}
                onClick={() => onNavigate("email-invoice")}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--brand)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <Mail size={18} style={{ color: 'var(--brand)' }} />
                <span style={{ fontWeight: '700', color: 'var(--ink)', fontSize: '0.72rem', textAlign: 'center' }}>Send Invoice</span>
              </button>
            </div>
          </article>
        </div>

        {/* Right Column: Full-Height Operational Capacity Graph */}
        <article className="card" style={{ padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', minHeight: '445px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--brand-light)', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={16} style={{ color: 'var(--brand)' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--ink)', margin: 0 }}>Operational Capacity Graph</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', margin: 0 }}>Active metrics benchmark and shop status</p>
            </div>
          </div>

          {/* Grid & Chart Frame Container */}
          <div style={{ flex: 1, display: 'flex', marginTop: '2rem', gap: '10px' }}>
            {/* Y-Axis scale markers */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '240px', fontSize: '0.7rem', color: 'var(--ink-soft)', textAlign: 'right', width: '25px', paddingRight: '4px', fontWeight: '700' }}>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>

            {/* Grid & Chart Frame */}
            <div style={{ flex: 1, display: 'flex', position: 'relative', height: '240px', borderLeft: '2px solid var(--border)', borderBottom: '2px solid var(--border)', paddingLeft: '8px' }}>
              {/* Y-Axis Grid Lines */}
              <div style={{ position: 'absolute', left: 0, right: 0, top: '0%', borderBottom: '1px dashed rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: '33%', borderBottom: '1px dashed rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: '66%', borderBottom: '1px dashed rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

              {/* Bars Row */}
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', width: '100%', height: '100%', zIndex: 1 }}>
                {[
                  { label: "Regs", count: stats.customersCount, max: 100, color: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)', shadow: 'rgba(56, 189, 248, 0.4)' },
                  { label: "Sales", count: stats.invoicesCount, max: 150, color: 'linear-gradient(180deg, #fbbf24 0%, #ca8a04 100%)', shadow: 'rgba(251, 191, 36, 0.4)' },
                  { label: "Bookings", count: stats.activeBookingsCount, max: 50, color: 'linear-gradient(180deg, #34d399 0%, #059669 100%)', shadow: 'rgba(52, 211, 153, 0.4)' },
                  { label: "Alerts", count: stats.lowStockCount, max: 20, color: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)', shadow: 'rgba(248, 113, 113, 0.4)' }
                ].map((item, idx) => {
                  const percentage = Math.min((item.count / (item.max || 1)) * 100, 100);
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '18%', height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
                        {/* Permanent Number Value badge standing right on top of the bar */}
                        <div 
                          style={{ 
                            position: 'absolute', 
                            bottom: `calc(${Math.max(percentage, 6)}% + 6px)`, 
                            left: '50%', 
                            transform: 'translateX(-50%)', 
                            fontWeight: '800', 
                            fontSize: '0.85rem', 
                            color: 'var(--ink)',
                            background: 'var(--surface-2)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            border: '1px solid var(--border)',
                            boxShadow: 'var(--shadow-sm)',
                            zIndex: 2,
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.count}
                        </div>

                        {/* Interactive Bar with Dynamic Transition Events */}
                        <div 
                          style={{ 
                            width: '100%', 
                            height: `${Math.max(percentage, 6)}%`, 
                            background: item.color, 
                            borderRadius: '6px 6px 0 0',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            boxShadow: `0 4px 14px ${item.shadow}`
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-6px) scaleX(1.05)';
                            e.currentTarget.style.filter = 'brightness(1.1)';
                            e.currentTarget.style.boxShadow = `0 8px 24px ${item.shadow}`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.filter = 'none';
                            e.currentTarget.style.boxShadow = `0 4px 14px ${item.shadow}`;
                          }}
                        />
                      </div>
                      
                      {/* Label underneath */}
                      <span style={{ fontSize: '0.75rem', color: 'var(--ink)', marginTop: '8px', fontWeight: '700', whiteSpace: 'nowrap' }}>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Chart Legend Footer */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', fontSize: '0.68rem', color: 'var(--ink-soft)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }} />
              <span>Regs: Customers Flow</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ca8a04' }} />
              <span>Sales: Invoices Settled</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} />
              <span>Bookings: Service Intake</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }} />
              <span>Alerts: Critical Shortages</span>
            </div>
          </div>
        </article>
      </div>

      {/* Critical Stock Level Warnings */}
      {lowStockParts.length > 0 && (
        <article id="critical-stock-warnings" className="card" style={{ padding: '1.25rem', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'linear-gradient(to right, rgba(239, 68, 68, 0.04), rgba(251, 146, 60, 0.02))', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <ShieldAlert size={20} style={{ color: '#ef4444' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--ink)' }}>Critical Low Stock Parts Warning</h4>
          </div>
          <div className="table-wrap">
            <table className="table" style={{ fontSize: '0.82rem' }}>
              <thead>
                <tr>
                  <th style={{ color: 'var(--ink)', fontWeight: '800', borderBottom: '2px solid var(--border)', background: 'var(--surface-2)', padding: '10px 12px' }}>Part Identifier</th>
                  <th style={{ color: 'var(--ink)', fontWeight: '800', borderBottom: '2px solid var(--border)', background: 'var(--surface-2)', padding: '10px 12px' }}>Category</th>
                  <th style={{ color: 'var(--ink)', fontWeight: '800', borderBottom: '2px solid var(--border)', background: 'var(--surface-2)', padding: '10px 12px' }}>Unit Price</th>
                  <th style={{ color: 'var(--ink)', fontWeight: '800', borderBottom: '2px solid var(--border)', background: 'var(--surface-2)', padding: '10px 12px' }}>Available Quantity</th>
                  <th style={{ color: 'var(--ink)', fontWeight: '800', borderBottom: '2px solid var(--border)', background: 'var(--surface-2)', padding: '10px 12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockParts.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: '600', color: 'var(--ink)' }}>{p.name}</td>
                    <td>{p.category}</td>
                    <td>Rs {p.price?.toLocaleString()}</td>
                    <td>
                      <strong style={{ color: '#ef4444' }}>{p.stockQuantity}</strong>
                    </td>
                    <td>
                      <span className="status danger">Low Stock</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      )}
    </div>
  );
}

function CustomerRegistration({ onNavigate }) {
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", address: "",
    vehicleLicensePlate: "", vehicleMake: "", vehicleModel: "",
    vehicleYear: new Date().getFullYear(), vehicleMileage: 0, vehiclePlateType: 0,
  });
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const t = toast.loading("Registering customer...");
    try {
      const hasVehicle = form.vehicleLicensePlate.trim() !== "";
      let res;
      if (hasVehicle) {
        const payload = {
          ...form,
          vehicleYear: parseInt(form.vehicleYear),
          vehicleMileage: parseFloat(form.vehicleMileage) || 0,
          vehiclePlateType: parseInt(form.vehiclePlateType),
        };
        res = await api.post("/api/customers/register", payload);
        toast.success("Customer and vehicle registered successfully!", { id: t });
        onNavigate(`customer-details?id=${res.data.customer.id}`);
      } else {
        const payload = {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
        };
        res = await api.post("/api/customers", payload);
        toast.success("Customer profile registered successfully!", { id: t });
        onNavigate(`customer-details?id=${res.data.id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed", { id: t });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="staff-grid-2">
      <article className="card" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <User size={20} className="brand-icon" style={{ color: 'var(--brand)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink)' }}>New Customer Profile</h3>
        </div>

        <form className="staff-form" onSubmit={handleSubmit}>
          <div className="field-row">
            <label className="field-label" style={{ color: 'var(--ink-soft)' }}>Full Name
              <input className="form-input" style={{ background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', width: '100%', marginTop: '0.4rem', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }} required value={form.fullName} onChange={set("fullName")} placeholder="e.g. Ram Bahadur" />
            </label>
            <label className="field-label" style={{ color: 'var(--ink-soft)' }}>Phone
              <input className="form-input" style={{ background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', width: '100%', marginTop: '0.4rem', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }} required value={form.phone} onChange={set("phone")} placeholder="98XXXXXXXX" />
            </label>
          </div>
          <div className="field-row" style={{ marginTop: '1rem' }}>
            <label className="field-label" style={{ color: 'var(--ink-soft)' }}>Email Address
              <input className="form-input" type="email" style={{ background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', width: '100%', marginTop: '0.4rem', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }} value={form.email} onChange={set("email")} placeholder="name@example.com" />
            </label>
            <label className="field-label" style={{ color: 'var(--ink-soft)' }}>Physical Address
              <input className="form-input" style={{ background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', width: '100%', marginTop: '0.4rem', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }} value={form.address} onChange={set("address")} placeholder="City or street name" />
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '2rem 0 1rem' }}>
            <Car size={20} className="brand-icon" style={{ color: 'var(--brand)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink)' }}>Vehicle Details (Optional)</h3>
          </div>

          <div className="field-row">
            <label className="field-label" style={{ color: 'var(--ink-soft)' }}>License Plate
              <input className="form-input" style={{ background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', width: '100%', marginTop: '0.4rem', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }} value={form.vehicleLicensePlate} onChange={set("vehicleLicensePlate")} placeholder="Ba 1 Cha 1234 (Leave blank if none)" />
            </label>
            <label className="field-label" style={{ color: 'var(--ink-soft)' }}>Plate Classification
              <select className="form-input" style={{ background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', width: '100%', marginTop: '0.4rem', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }} value={form.vehiclePlateType} onChange={set("vehiclePlateType")}>
                <option value={0}>Private (Red)</option>
                <option value={1}>Commercial (Black)</option>
                <option value={2}>Government (White)</option>
                <option value={3}>Diplomatic (Blue)</option>
              </select>
            </label>
          </div>
          <div className="field-row" style={{ marginTop: '1rem' }}>
            <label className="field-label" style={{ color: 'var(--ink-soft)' }}>Vehicle Make
              <input className="form-input" style={{ background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', width: '100%', marginTop: '0.4rem', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }} value={form.vehicleMake} onChange={set("vehicleMake")} placeholder="Toyota" />
            </label>
            <label className="field-label" style={{ color: 'var(--ink-soft)' }}>Vehicle Model
              <input className="form-input" style={{ background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', width: '100%', marginTop: '0.4rem', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }} value={form.vehicleModel} onChange={set("vehicleModel")} placeholder="Corolla" />
            </label>
          </div>
          <div className="field-row" style={{ marginTop: '1rem' }}>
            <label className="field-label" style={{ color: 'var(--ink-soft)' }}>Manufacture Year
              <input className="form-input" type="number" min="1900" max="2100" style={{ background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', width: '100%', marginTop: '0.4rem', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }} value={form.vehicleYear} onChange={set("vehicleYear")} />
            </label>
            <label className="field-label" style={{ color: 'var(--ink-soft)' }}>Current Mileage (KM)
              <input className="form-input" type="number" min="0" style={{ background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', width: '100%', marginTop: '0.4rem', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }} value={form.vehicleMileage} onChange={set("vehicleMileage")} />
            </label>
          </div>

          <div className="staff-form-actions" style={{ marginTop: '2rem', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '10px 20px' }}>Save &amp; Active Profile</button>
            <button type="button" className="btn btn-secondary" onClick={() => onNavigate("customer-search")} style={{ padding: '10px 20px' }}>Cancel</button>
          </div>
        </form>
      </article>

      <article className="card" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <CheckCircle size={20} className="brand-icon" style={{ color: '#10b981' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink)' }}>Intake Procedure Checklist</h3>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          Ensure that the following intake checks are completed physically at the service bay desk before finalize submission.
        </p>
        <ul className="checklist" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingLeft: 0, listStyle: 'none' }}>
          {[
            { t: "Verify Customer Identity", desc: "Confirm full name spelling against citizenship or driving license." },
            { t: "Validate Contact Number", desc: "Ensure mobile phone number is verified active to send invoice copies." },
            { t: "Inspect & Record License Plate", desc: "Physically verify the vehicle license plate matches input characters." },
            { t: "Conduct Walk-around Inspection", desc: "Note and document pre-existing vehicle dents or scratches." },
            { t: "Perform Credit Check", desc: "Verify if the customer has outstanding invoices or negative credit." }
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span className="check-dot" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: '700', fontSize: '0.78rem', flexShrink: 0 }}>{i + 1}</span>
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--ink)', display: 'block' }}>{item.t}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '0.15rem', display: 'block' }}>{item.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

function highlightText(text, searchStr) {
  if (!text) return "";
  if (!searchStr || !searchStr.trim()) return text;
  
  const term = searchStr.trim();
  const regex = new RegExp(`(${term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  const parts = text.toString().split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark 
        key={index} 
        style={{ 
          background: 'rgba(234, 179, 8, 0.22)', 
          color: 'var(--brand-text)', 
          fontWeight: '700', 
          borderRadius: '4px',
          padding: '2px 4px',
          border: '1px solid rgba(234, 179, 8, 0.15)'
        }}
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function CustomerSearch({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/customers");
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load customer list");
    } finally {
      setLoading(false);
    }
  }, []);

  // Real-time filtering as you type with a 200ms debounce
  useEffect(() => {
    const term = query.trim();
    if (!term) {
      loadAll();
      setSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setSearched(true);
      try {
        const res = await api.get(`/api/customers/search?query=${encodeURIComponent(term)}`);
        setResults(Array.isArray(res.data) ? res.data : []);
      } catch {
        // Silent catch for real-time keystrokes to ensure smooth UX
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, loadAll]);

  const search = async (e) => {
    e.preventDefault();
    const term = query.trim();
    if (!term) {
      loadAll();
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/api/customers/search?query=${encodeURIComponent(term)}`);
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-grid-2">
      <article className="card" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <Search size={20} className="brand-icon" style={{ color: 'var(--brand)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink)' }}>Search Accounts</h3>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', marginBottom: '1.5rem' }}>
          Find existing customer profiles or vehicle fleet information by searching names, numbers, or emails.
        </p>
        
        <form className="staff-searchbar" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={search}>
          <input 
            type="search" 
            placeholder="Search by Ram, 98XXXXXXXX, ram@example.com..." 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--ink)', padding: '12px 14px', borderRadius: 'var(--radius-sm)' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '12px' }} disabled={loading}>
            {loading ? "Filtering active profiles..." : "Search Profiles"}
          </button>
        </form>
        
        <div style={{ borderTop: '1px solid var(--border)', marginTop: '2rem', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--ink-soft)' }}>Can't find the customer profile?</span>
          <button className="btn btn-secondary" onClick={() => onNavigate("customer-registration")} style={{ alignSelf: 'flex-start' }}>
            + Create New Customer Intake
          </button>
        </div>
      </article>

      <article className="card" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink)', marginBottom: '1.25rem' }}>Search Results</h3>
        {loading && <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>Searching active directories...</p>}
        {!loading && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--ink-soft)' }}>
            <AlertTriangle size={32} style={{ color: '#eab308', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>
              {searched ? "No matches found" : "No customer profiles registered yet"}
            </p>
            <p style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
              {searched ? "Please verify the search query or register them as new." : "Get started by taking your first customer intake profile!"}
            </p>
          </div>
        )}
        {!loading && results.length > 0 && (
          <div className="table-wrap" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
            <table className="table" style={{ fontSize: '0.85rem', width: '100%', minWidth: '800px' }}>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Contact Phone</th>
                  <th>Email</th>
                  <th>Physical Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: '600' }}>{highlightText(c.fullName, query)}</td>
                    <td>{highlightText(c.phone, query)}</td>
                    <td style={{ color: 'var(--ink-soft)' }}>{highlightText(c.email || "N/A", query)}</td>
                    <td style={{ color: 'var(--ink-soft)' }}>{highlightText(c.address || "N/A", query)}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => onNavigate(`customer-details?id=${c.id}`)}>
                        Open Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </div>
  );
}

function CustomerDetails({ onNavigate }) {
  const [customerId, setCustomerId] = useState(() => {
    const hashId = getHashParam("id");
    if (hashId) {
      localStorage.setItem("autobolt_active_customer_id", hashId);
      return hashId;
    }
    return localStorage.getItem("autobolt_active_customer_id");
  });
  const [customer, setCustomer] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", address: "" });
  const [saving, setSaving] = useState(false);

  const [allCustomers, setAllCustomers] = useState([]);
  const [listQuery, setListQuery] = useState("");

  const loadAllCustomers = () => {
    api.get("/api/customers").then((res) => {
      setAllCustomers(Array.isArray(res.data) ? res.data : []);
    }).catch(() => {});
  };

  useEffect(() => {
    loadAllCustomers();
  }, []);

  useEffect(() => {
    const onHash = () => {
      const hashId = getHashParam("id");
      if (hashId) {
        setCustomerId(hashId);
        localStorage.setItem("autobolt_active_customer_id", hashId);
      } else {
        const saved = localStorage.getItem("autobolt_active_customer_id");
        if (saved) {
          setCustomerId(saved);
        } else {
          setCustomerId(null);
        }
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!customerId) return;
    api.get(`/api/customers/${customerId}`).then((res) => {
      setCustomer(res.data);
      setForm({ fullName: res.data.fullName, email: res.data.email || "", phone: res.data.phone, address: res.data.address || "" });
      localStorage.setItem("autobolt_active_customer_id", customerId);
    }).catch(() => toast.error("Failed to load customer"));
  }, [customerId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const t = toast.loading("Saving...");
    try {
      await api.put(`/api/customers/${customerId}`, form);
      setCustomer((p) => ({ ...p, ...form }));
      setEditing(false);
      toast.success("Updated", { id: t });
      loadAllCustomers();
    } catch {
      toast.error("Save failed", { id: t });
    } finally {
      setSaving(false);
    }
  };

  const filteredList = allCustomers.filter((c) => {
    const q = listQuery.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      (c.phone && c.phone.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
      {/* Left Selection Directory Drawer */}
      <article className="card" style={{ padding: '1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <Users size={18} style={{ color: 'var(--brand)' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--ink)', margin: 0 }}>Selection Directory</h3>
        </div>
        <input 
          className="form-input" 
          placeholder="Filter selection directory..." 
          value={listQuery} 
          onChange={(e) => setListQuery(e.target.value)} 
          style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '1rem' }} 
        />
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filteredList.map((c) => {
            const isSelected = parseInt(customerId) === c.id;
            return (
              <div 
                key={c.id} 
                onClick={() => {
                  setCustomerId(c.id);
                  localStorage.setItem("autobolt_active_customer_id", c.id);
                  window.history.replaceState(null, "", `#customer-details?id=${c.id}`);
                }}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1px solid var(--brand)' : '1px solid var(--border)',
                  background: isSelected ? 'var(--brand-light)' : 'var(--surface)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="customer-select-item"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: isSelected ? 'var(--brand)' : 'var(--ink)' }}>
                    {c.fullName}
                  </span>
                  {isSelected && (
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand)' }}></span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '4px' }}>
                  📞 {c.phone}
                </div>
              </div>
            );
          })}
          {filteredList.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: '0.8rem', padding: '2rem 0' }}>No matches found</p>
          )}
        </div>
      </article>

      {/* Right Details Folder */}
      <div>
        {!customerId ? (
          <div style={{ textAlign: 'center', padding: '6rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--ink-soft)' }}>
            <Users size={48} style={{ color: 'var(--brand)', opacity: 0.5, marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink)' }}>No Customer Selected</h3>
            <p style={{ fontSize: '0.85rem', maxWidth: '380px', margin: '0.5rem auto 1.5rem', color: 'var(--ink-soft)' }}>
              Choose a customer profile from the left Selection Directory or register a new one to unlock folders.
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => onNavigate("customer-registration")}>
              Register New Customer
            </button>
          </div>
        ) : !customer ? (
          <div className="card skeleton" style={{ height: '300px', borderRadius: 'var(--radius-md)' }}></div>
        ) : (
          <div className="staff-grid-2">
            <article className="card" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <User size={20} className="brand-icon" style={{ color: 'var(--brand)' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink)' }}>Customer Folder</h3>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditing((p) => !p)}>
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {editing ? (
                <form className="staff-form" onSubmit={handleSave}>
                  <label className="field-label" style={{ color: 'var(--ink-soft)' }}>Full Name
                    <input className="form-input" style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginTop: '0.4rem' }} required value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
                  </label>
                  <label className="field-label" style={{ color: 'var(--ink-soft)', marginTop: '1rem', display: 'block' }}>Contact Phone
                    <input className="form-input" style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginTop: '0.4rem' }} required value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                  </label>
                  <label className="field-label" style={{ color: 'var(--ink-soft)', marginTop: '1rem', display: 'block' }}>Email Address
                    <input className="form-input" type="email" style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginTop: '0.4rem' }} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                  </label>
                  <label className="field-label" style={{ color: 'var(--ink-soft)', marginTop: '1rem', display: 'block' }}>Address
                    <input className="form-input" style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginTop: '0.4rem' }} value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
                  </label>
                  <div className="staff-form-actions" style={{ marginTop: '1.5rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={saving}>Save Changes</button>
                  </div>
                </form>
              ) : (
                <div className="staff-summary-list">
                  {[
                    ["FullName / Name", customer.fullName],
                    ["Contact Phone", customer.phone],
                    ["Email Address", customer.email || "—"],
                    ["Physical Address", customer.address || "—"],
                    ["Credit Balance", `Rs ${customer.creditBalance?.toLocaleString()}`]
                  ].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>{label}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink)' }}>{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="card" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <Wrench size={20} className="brand-icon" style={{ color: 'var(--brand)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink)' }}>Intake Folders Actions</h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', marginBottom: '1.5rem' }}>
                Direct execution shortcuts configured for this customer profile.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button className="btn btn-secondary" style={{ width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => onNavigate(`vehicle-details?customerId=${customerId}`)}>
                  <Car size={16} /> View &amp; Register Vehicles
                </button>
                <button className="btn className btn-secondary" style={{ width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => onNavigate(`sales-invoice?customerId=${customerId}`)}>
                  <Receipt size={16} /> Build Sales Invoice
                </button>
                <button className="btn className btn-secondary" style={{ width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => onNavigate(`customer-history?id=${customerId}`)}>
                  <History size={16} /> Service &amp; Invoice History
                </button>
                <button className="btn className btn-secondary" style={{ width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '10px', border: '1px dashed var(--border)' }} onClick={() => onNavigate("customer-search")}>
                  <Search size={16} /> Back to Search Directory
                </button>
              </div>
            </article>
          </div>
        )}
      </div>
    </div>
  );
}

function VehicleDetails({ onNavigate }) {
  const [customerId, setCustomerId] = useState(() => {
    const hashId = getHashParam("customerId");
    if (hashId) {
      localStorage.setItem("autobolt_active_customer_id", hashId);
      return hashId;
    }
    return localStorage.getItem("autobolt_active_customer_id");
  });
  const [allVehicles, setAllVehicles] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [filterByActive, setFilterByActive] = useState(!!customerId);
  const [listQuery, setListQuery] = useState("");
  const [form, setForm] = useState({
    licensePlate: "",
    make: "",
    model: "",
    year: 2026,
    mileage: 0,
    plateType: 0,
    customerId: customerId ? parseInt(customerId) : ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onHash = () => {
      const hashId = getHashParam("customerId");
      if (hashId) {
        setCustomerId(hashId);
        localStorage.setItem("autobolt_active_customer_id", hashId);
      } else {
        const saved = localStorage.getItem("autobolt_active_customer_id");
        if (saved) {
          setCustomerId(saved);
        } else {
          setCustomerId(null);
        }
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    api.get("/api/customers").then((res) => {
      const list = Array.isArray(res.data) ? res.data : [];
      setAllCustomers(list);
      if (customerId) {
        const found = list.find((c) => c.id === parseInt(customerId));
        if (found) setActiveCustomer(found);
      }
    }).catch(() => {});
  }, [customerId]);

  const loadVehicles = () => {
    api.get("/api/vehicles").then((res) => {
      const list = Array.isArray(res.data) ? res.data : [];
      setAllVehicles(list);
      if (list.length > 0 && !selected) {
        if (customerId && filterByActive) {
          const matched = list.find((v) => v.customerId === parseInt(customerId));
          if (matched) setSelected(matched);
        } else {
          setSelected(list[0]);
        }
      }
    }).catch(() => toast.error("Failed to load vehicles"));
  };

  useEffect(() => {
    loadVehicles();
  }, [customerId, filterByActive]);

  useEffect(() => {
    if (!form.customerId && allCustomers.length > 0) {
      setForm((p) => ({ ...p, customerId: customerId ? parseInt(customerId) : allCustomers[0].id }));
    }
  }, [allCustomers, customerId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.customerId) {
      toast.error("Please select a customer owner");
      return;
    }
    setSaving(true);
    const t = toast.loading("Adding vehicle...");
    try {
      await api.post("/api/vehicles", {
        ...form,
        customerId: parseInt(form.customerId),
        year: parseInt(form.year),
        mileage: parseFloat(form.mileage) || 0,
        plateType: parseInt(form.plateType)
      });
      toast.success("Vehicle registered successfully", { id: t });
      setShowAdd(false);
      loadVehicles();
      setForm({
        licensePlate: "",
        make: "",
        model: "",
        year: 2026,
        mileage: 0,
        plateType: 0,
        customerId: customerId ? parseInt(customerId) : (allCustomers[0]?.id || "")
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add vehicle", { id: t });
    } finally {
      setSaving(false);
    }
  };

  const filteredVehicles = allVehicles.filter((v) => {
    if (customerId && filterByActive && v.customerId !== parseInt(customerId)) {
      return false;
    }
    const q = listQuery.toLowerCase();
    return (
      v.licensePlate.toLowerCase().includes(q) ||
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      (v.ownerName && v.ownerName.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
      {/* Left Fleet Directory Pane */}
      <article className="card" style={{ padding: '1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <Car size={18} style={{ color: 'var(--brand)' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--ink)', margin: 0 }}>Fleet Directory</h3>
        </div>
        
        {activeCustomer && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--ink)', background: 'var(--surface-2)', padding: '6px 8px', borderRadius: '4px', marginBottom: '0.75rem', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={filterByActive} 
              onChange={(e) => setFilterByActive(e.target.checked)} 
            />
            <span>Filter active customer's fleet</span>
          </label>
        )}

        <input 
          className="form-input" 
          placeholder="Filter plate, model, owner..." 
          value={listQuery} 
          onChange={(e) => setListQuery(e.target.value)} 
          style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '1rem' }} 
        />
        
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filteredVehicles.map((v) => {
            const isSelected = selected?.id === v.id;
            return (
              <div 
                key={v.id} 
                onClick={() => setSelected(v)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1px solid var(--brand)' : '1px solid var(--border)',
                  background: isSelected ? 'var(--brand-light)' : 'var(--surface)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="vehicle-select-item"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: isSelected ? 'var(--brand)' : 'var(--ink)' }}>
                    {v.licensePlate}
                  </span>
                  {isSelected && (
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand)' }}></span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{v.make} {v.model}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>👤 {v.ownerName || "Unknown"}</span>
                </div>
              </div>
            );
          })}
          {filteredVehicles.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: '0.8rem', padding: '2rem 0' }}>No vehicles matched</p>
          )}
        </div>
      </article>

      {/* Right Content View Pane */}
      <div>
        {showAdd ? (
          <article className="card" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Car size={20} className="brand-icon" style={{ color: 'var(--brand)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink)' }}>Register New Vehicle</h3>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowAdd(false)}>
                Back to Fleet
              </button>
            </div>
            
            <form className="staff-form" onSubmit={handleAdd}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <label className="field-label" style={{ color: 'var(--ink-soft)' }}>Owner / Customer *
                  <select 
                    className="form-input" 
                    style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', marginTop: '0.3rem' }} 
                    required
                    value={form.customerId} 
                    onChange={(e) => setForm((p) => ({ ...p, customerId: e.target.value }))}
                  >
                    <option value="" disabled>-- Select Owner --</option>
                    {allCustomers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} (📞 {c.phone})
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field-label" style={{ color: 'var(--ink-soft)' }}>Classification *
                  <select className="form-input" style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', marginTop: '0.3rem' }} value={form.plateType} onChange={(e) => setForm((p) => ({ ...p, plateType: e.target.value }))}>
                    <option value={0}>Private (Red)</option>
                    <option value={1}>Commercial (Black)</option>
                    <option value={2}>Government (White)</option>
                    <option value={3}>Diplomatic (Blue)</option>
                  </select>
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <label className="field-label" style={{ color: 'var(--ink-soft)' }}>License Plate Number *
                  <input className="form-input" style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', marginTop: '0.3rem' }} required value={form.licensePlate} onChange={(e) => setForm((p) => ({ ...p, licensePlate: e.target.value }))} placeholder="Ba 1 Cha 1234" />
                </label>
                <label className="field-label" style={{ color: 'var(--ink-soft)' }}>Manufacture Year *
                  <input className="form-input" type="number" style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', marginTop: '0.3rem' }} value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))} />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <label className="field-label" style={{ color: 'var(--ink-soft)' }}>Vehicle Make / Brand *
                  <input className="form-input" style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', marginTop: '0.3rem' }} required value={form.make} onChange={(e) => setForm((p) => ({ ...p, make: e.target.value }))} placeholder="Toyota" />
                </label>
                <label className="field-label" style={{ color: 'var(--ink-soft)' }}>Vehicle Model *
                  <input className="form-input" style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', marginTop: '0.3rem' }} required value={form.model} onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))} placeholder="Corolla" />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <label className="field-label" style={{ color: 'var(--ink-soft)' }}>Current Odo Mileage (km)
                  <input className="form-input" type="number" style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', marginTop: '0.3rem' }} value={form.mileage} onChange={(e) => setForm((p) => ({ ...p, mileage: e.target.value }))} />
                </label>
              </div>

              <button type="submit" className="btn btn-primary" disabled={saving}>Save &amp; Register Vehicle</button>
            </form>
          </article>
        ) : (
          <div className="staff-grid-2">
            <article className="card" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Car size={20} className="brand-icon" style={{ color: 'var(--brand)' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink)' }}>Vehicle Fleet</h3>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => {
                  setForm({
                    licensePlate: "",
                    make: "",
                    model: "",
                    year: 2026,
                    mileage: 0,
                    plateType: 0,
                    customerId: customerId ? parseInt(customerId) : (allCustomers[0]?.id || "")
                  });
                  setShowAdd(true);
                }}>
                  + Register Vehicle
                </button>
              </div>

              {filteredVehicles.length === 0 ? (
                <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem' }}>No vehicles registered matching selection.</p>
              ) : (
                <div className="table-wrap">
                  <table className="table" style={{ fontSize: '0.85rem' }}>
                    <thead><tr><th>Plate</th><th>Make / Model</th><th>Owner</th><th></th></tr></thead>
                    <tbody>
                      {filteredVehicles.map((v) => (
                        <tr key={v.id} className={selected?.id === v.id ? "row-active" : ""}>
                          <td style={{ fontWeight: '700' }}>{v.licensePlate}</td>
                          <td>{v.make} {v.model}</td>
                          <td style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>{v.ownerName || "Unknown"}</td>
                          <td>
                            <button className="btn btn-secondary btn-sm" onClick={() => setSelected(v)}>
                              Select
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </article>

            <article className="card" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <User size={20} className="brand-icon" style={{ color: 'var(--brand)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink)' }}>Vehicle Specifications</h3>
              </div>
              {selected ? (
                <div className="staff-summary-list">
                  {[
                    ["License Plate", selected.licensePlate],
                    ["Classification Color", selected.plateType === 0 ? "Private (Red)" : selected.plateType === 1 ? "Commercial (Black)" : selected.plateType === 2 ? "Government (White)" : "Diplomatic (Blue)"],
                    ["Make / Brand", selected.make],
                    ["Vehicle Model", selected.model],
                    ["Manufacture Year", selected.year],
                    ["Current Odo (Mileage)", `${selected.mileage?.toLocaleString()} km`],
                    ["Owner Name", selected.ownerName || "Unknown"]
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>{l}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink)' }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '2rem' }}>
                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => onNavigate(`sales-invoice?customerId=${selected.customerId}&vehicleId=${selected.id}`)}>
                      Initialize Billing Invoice
                    </button>
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem' }}>Please select a vehicle from the list to view specifications.</p>
              )}
            </article>
          </div>
        )}
      </div>
    </div>
  );
}

function SalesInvoice({ onNavigate }) {
  const [customerId, setCustomerId] = useState(() => {
    const hashId = getHashParam("customerId");
    if (hashId) {
      localStorage.setItem("autobolt_active_customer_id", hashId);
      return hashId;
    }
    return localStorage.getItem("autobolt_active_customer_id");
  });
  const initVehicleId = getHashParam("vehicleId");

  const [customerQuery, setCustomerQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(initVehicleId || "");
  const [partQuery, setPartQuery] = useState("");
  const [parts, setParts] = useState([]);
  const [cart, setCart] = useState([]);
  const [taxRate] = useState(0.13);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onHash = () => {
      const hashId = getHashParam("customerId");
      if (hashId) {
        setCustomerId(hashId);
        localStorage.setItem("autobolt_active_customer_id", hashId);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (customerId) {
      api.get(`/api/customers/${customerId}`).then((res) => {
        setSelectedCustomer(res.data);
        api.get(`/api/vehicles/customer/${customerId}`).then((r) => setVehicles(Array.isArray(r.data) ? r.data : []));
      }).catch(() => {});
    }
    api.get("/api/parts").then((res) => setParts(Array.isArray(res.data) ? res.data : []));
  }, [customerId]);

  const searchCustomers = async (e) => {
    e.preventDefault();
    if (!customerQuery.trim()) return;
    try {
      const res = await api.get(`/api/customers/search?query=${encodeURIComponent(customerQuery)}`);
      setCustomers(Array.isArray(res.data) ? res.data : []);
    } catch { toast.error("Search failed"); }
  };

  const selectCustomer = async (c) => {
    setSelectedCustomer(c);
    setCustomers([]);
    setCustomerQuery("");
    const res = await api.get(`/api/vehicles/customer/${c.id}`);
    setVehicles(Array.isArray(res.data) ? res.data : []);
  };

  const filteredParts = parts.filter((p) =>
    !partQuery || p.name.toLowerCase().includes(partQuery.toLowerCase()) || p.category?.toLowerCase().includes(partQuery.toLowerCase())
  );

  const addToCart = (part) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.partId === part.id);
      if (existing) return prev.map((i) => i.partId === part.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { partId: part.id, name: part.name, price: part.price, quantity: 1 }];
    });
  };

  const updateQty = (partId, qty) => {
    if (qty < 1) { setCart((p) => p.filter((i) => i.partId !== partId)); return; }
    setCart((p) => p.map((i) => i.partId === partId ? { ...i, quantity: qty } : i));
  };

  const subTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subTotal * taxRate;
  const total = subTotal + tax;

  const handleSubmit = async () => {
    if (!selectedCustomer) { toast.error("Select a customer first"); return; }
    if (cart.length === 0) { toast.error("Add at least one item"); return; }
    setSaving(true);
    const t = toast.loading("Creating invoice...");
    try {
      const res = await api.post("/api/invoices", {
        customerId: selectedCustomer.id,
        vehicleId: selectedVehicleId ? parseInt(selectedVehicleId) : null,
        status: 0,
        taxRate,
        items: cart.map((i) => ({ partId: i.partId, quantity: i.quantity })),
      });
      toast.success(`Invoice ${res.data.invoiceNumber} created`, { id: t });
      onNavigate(`email-invoice?id=${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create invoice", { id: t });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="invoice-layout">
      <article className="card invoice-box" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <Receipt size={20} className="brand-icon" style={{ color: 'var(--brand)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink)' }}>Sales Invoice Builder</h3>
        </div>

        {/* Customer Search & Selection */}
        {!selectedCustomer ? (
          <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>Attach Customer Account</span>
            <form className="staff-searchbar" onSubmit={searchCustomers} style={{ display: 'flex', gap: '8px' }}>
              <input type="search" placeholder="Search by name, contact number..." value={customerQuery} onChange={(e) => setCustomerQuery(e.target.value)} style={{ flex: 1, background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '10px', borderRadius: 'var(--radius-sm)' }} />
              <button type="submit" className="btn btn-secondary">Search</button>
            </form>
            {customers.length > 0 && (
              <div className="table-wrap" style={{ marginTop: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                <table className="table" style={{ fontSize: '0.82rem' }}>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id}>
                        <td><strong>{c.fullName}</strong></td>
                        <td>{c.phone}</td>
                        <td><button className="btn btn-primary btn-sm" style={{ padding: '4px 8px' }} onClick={() => selectCustomer(c)}>Select</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div style={{ marginBottom: '1.5rem', display: "flex", justifyContent: "space-between", alignItems: "center", padding: '1rem', border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 'var(--radius-sm)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand)', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Selected Customer</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--ink)' }}>{selectedCustomer.fullName}</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginLeft: '8px' }}>({selectedCustomer.phone})</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedCustomer(null); setVehicles([]); setSelectedVehicleId(""); }}>Change Account</button>
          </div>
        )}

        {/* Vehicle Selection dropdown */}
        {vehicles.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="field-label" style={{ color: 'var(--ink-soft)' }}>Attach Vehicle Context (Optional)
              <select className="form-input" style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginTop: '0.4rem' }} value={selectedVehicleId} onChange={(e) => setSelectedVehicleId(e.target.value)}>
                <option value="">— No vehicle context —</option>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.licensePlate} — {v.make} {v.model}</option>)}
              </select>
            </label>
          </div>
        )}

        {/* Parts Drawer search & selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>Search Inventory Parts</span>
          <input className="form-input" style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }} placeholder="Filter parts by name, category..." value={partQuery} onChange={(e) => setPartQuery(e.target.value)} />
          <div className="table-wrap" style={{ maxHeight: 200, overflowY: "auto", border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
            <table className="table" style={{ fontSize: '0.82rem' }}>
              <thead><tr><th>Part Name</th><th>Category</th><th>Unit Price</th><th>Available</th><th></th></tr></thead>
              <tbody>
                {filteredParts.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: '600' }}>{p.name}</td>
                    <td>{p.category}</td>
                    <td>Rs {p.price?.toLocaleString()}</td>
                    <td><span className={`status ${p.stockQuantity < 1 ? "danger" : p.isLowStock ? "warn" : "good"}`}>{p.stockQuantity}</span></td>
                    <td><button className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }} disabled={p.stockQuantity < 1} onClick={() => addToCart(p)}>+ Add</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Cart Items list */}
        {cart.length > 0 && (
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>Invoice Items list</span>
            <div className="table-wrap" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
              <table className="table" style={{ fontSize: '0.82rem' }}>
                <thead><tr><th>Item Description</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th><th></th></tr></thead>
                <tbody>
                  {cart.map((i) => (
                    <tr key={i.partId}>
                      <td style={{ fontWeight: '600' }}>{i.name}</td>
                      <td><input type="number" min="1" value={i.quantity} onChange={(e) => updateQty(i.partId, parseInt(e.target.value))} style={{ width: 65, padding: '4px', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }} className="form-input" /></td>
                      <td>Rs {i.price?.toLocaleString()}</td>
                      <td style={{ fontWeight: '600' }}>Rs {(i.price * i.quantity).toLocaleString()}</td>
                      <td><button className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', color: '#ef4444' }} onClick={() => updateQty(i.partId, 0)}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </article>

      {/* Invoice summary pane */}
      <article className="card invoice-total" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink)', marginBottom: '1.5rem' }}>Billing Summary</h3>
        <div className="staff-summary-list">
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>Cart Subtotal</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink)' }}>Rs {subTotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>Tax Levy (13% VAT)</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink)' }}>Rs {tax.toFixed(0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '2px solid var(--border)' }}>
            <strong style={{ fontSize: '1rem', color: 'var(--ink)' }}>Total Amount</strong>
            <strong style={{ fontSize: '1.15rem', color: 'var(--brand)' }}>Rs {total.toFixed(0)}</strong>
          </div>
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }} onClick={handleSubmit} disabled={saving || !selectedCustomer || cart.length === 0}>
            {saving ? "Finalizing Invoice..." : "Create Sales Invoice & Email Customer"}
          </button>
        </div>
      </article>
    </div>
  );
}

function EmailInvoice({ onNavigate }) {
  const initId = getHashParam("id");
  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [query, setQuery] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api.get("/api/invoices").then((res) => {
      const list = Array.isArray(res.data) ? res.data : [];
      setInvoices(list);
      if (initId) {
        const found = list.find((i) => i.id === parseInt(initId));
        if (found) { setSelected(found); setRecipientEmail(found.customerEmail || ""); }
      }
    }).catch(() => toast.error("Failed to load invoices"));
  }, []);

  const handleSend = async () => {
    if (!selected) { toast.error("Select an invoice"); return; }
    setSending(true);
    const t = toast.loading("Sending...");
    try {
      const url = recipientEmail ? `/api/invoices/${selected.id}/email?recipientEmail=${encodeURIComponent(recipientEmail)}` : `/api/invoices/${selected.id}/email`;
      await api.post(url);
      toast.success("Invoice emailed", { id: t });
    } catch (err) {
      toast.error(err.response?.data?.message || "Send failed", { id: t });
    } finally {
      setSending(false);
    }
  };

  const filtered = invoices.filter((i) =>
    !query || i.invoiceNumber?.toLowerCase().includes(query.toLowerCase()) || i.customerName?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="staff-grid-2">
      <article className="card" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <Receipt size={20} className="brand-icon" style={{ color: 'var(--brand)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink)' }}>All Invoices</h3>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', marginBottom: '1.25rem' }}>Select a completed invoice to send as an email copy.</p>
        <input className="form-input" style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }} placeholder="Search by invoice number or customer..." value={query} onChange={(e) => setQuery(e.target.value)} />
        
        <div className="table-wrap" style={{ maxHeight: 260, overflowY: "auto", border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
          <table className="table" style={{ fontSize: '0.82rem' }}>
            <thead><tr><th>Number</th><th>Customer Name</th><th>Total</th><th></th></tr></thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className={selected?.id === inv.id ? "row-active" : ""}>
                  <td style={{ fontWeight: '700' }}>{inv.invoiceNumber}</td>
                  <td>{inv.customerName}</td>
                  <td>Rs {inv.totalAmount?.toLocaleString()}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }} onClick={() => { setSelected(inv); setRecipientEmail(inv.customerEmail || ""); }}>
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="card" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <Mail size={20} className="brand-icon" style={{ color: 'var(--brand)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink)' }}>Composed Email Builder</h3>
        </div>
        {selected ? (
          <>
            <div className="staff-summary-list" style={{ marginBottom: '1.5rem' }}>
              {[
                ["Invoice Reference", selected.invoiceNumber],
                ["Customer Account", selected.customerName],
                ["Invoice Amount", `Rs ${selected.totalAmount?.toLocaleString()}`],
                ["Status", selected.status]
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>{l}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--ink)' }}>{v}</span>
                </div>
              ))}
            </div>
            <label className="field-label" style={{ color: 'var(--ink-soft)' }}>Recipient Email Address
              <input className="form-input" style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginTop: '0.4rem' }} type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="Leave blank to use customer profile email" />
            </label>
            <div className="staff-form-actions" style={{ marginTop: '2rem', display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" onClick={handleSend} disabled={sending}>
                {sending ? "Sending Email..." : "Send E-mail Now"}
              </button>
              <button className="btn btn-secondary" onClick={() => onNavigate("sales-invoice")}>
                + New Billing Invoice
              </button>
            </div>
          </>
        ) : (
          <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem' }}>Please select an invoice from the drawer list to dispatch.</p>
        )}
      </article>
    </div>
  );
}

function CustomerHistory({ onNavigate }) {
  const [customerId, setCustomerId] = useState(() => {
    const hashId = getHashParam("id");
    if (hashId) {
      localStorage.setItem("autobolt_active_customer_id", hashId);
      return hashId;
    }
    return localStorage.getItem("autobolt_active_customer_id");
  });
  const [allCustomers, setAllCustomers] = useState([]);
  const [history, setHistory] = useState(null);
  const [listQuery, setListQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [partPage, setPartPage] = useState(1);
  const PARTS_PER_PAGE = 5;

  useEffect(() => {
    const onHash = () => {
      const hashId = getHashParam("id");
      if (hashId) {
        setCustomerId(hashId);
        localStorage.setItem("autobolt_active_customer_id", hashId);
      } else {
        const saved = localStorage.getItem("autobolt_active_customer_id");
        if (saved) {
          setCustomerId(saved);
        } else {
          setCustomerId(null);
        }
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    api.get("/api/customers").then((res) => {
      setAllCustomers(Array.isArray(res.data) ? res.data : []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!customerId) {
      setHistory(null);
      return;
    }
    setLoading(true);
    setPartPage(1);
    api.get(`/api/customers/${customerId}/history`).then((res) => {
      setHistory(res.data);
    }).catch(() => {
      toast.error("Failed to load history");
    }).finally(() => {
      setLoading(false);
    });
  }, [customerId]);

  const handleSelectCustomer = (id) => {
    setCustomerId(id);
    localStorage.setItem("autobolt_active_customer_id", id);
    window.history.replaceState(null, "", `#customer-history?id=${id}`);
  };

  const filteredCustomers = allCustomers.filter((c) => {
    const q = listQuery.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'start' }}>
      {/* Left Customer Selection Directory */}
      <article className="card" style={{ padding: '1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <History size={18} style={{ color: 'var(--brand)' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--ink)', margin: 0 }}>Timeline Selector</h3>
        </div>
        
        <input 
          className="form-input" 
          placeholder="Filter customers..." 
          value={listQuery} 
          onChange={(e) => setListQuery(e.target.value)} 
          style={{ width: '100%', background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '1rem' }} 
        />
        
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filteredCustomers.map((c) => {
            const isSelected = parseInt(customerId) === c.id;
            return (
              <div 
                key={c.id} 
                onClick={() => handleSelectCustomer(c.id)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1px solid var(--brand)' : '1px solid var(--border)',
                  background: isSelected ? 'var(--brand-light)' : 'var(--surface)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="customer-select-item"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: isSelected ? 'var(--brand)' : 'var(--ink)' }}>
                    {c.fullName}
                  </span>
                  {isSelected && (
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand)' }}></span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '4px' }}>
                  📞 {c.phone}
                </div>
              </div>
            );
          })}
          {filteredCustomers.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: '0.8rem', padding: '2rem 0' }}>No matches found</p>
          )}
        </div>
      </article>

      {/* Right Service Timeline Folder Pane */}
      <div>
        {loading ? (
          <div className="card skeleton" style={{ height: '350px', borderRadius: 'var(--radius-md)' }}></div>
        ) : !history ? (
          <div style={{ padding: '4rem 1.5rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--ink-soft)' }}>
            <History size={48} style={{ color: 'var(--brand)', marginBottom: '1.25rem', opacity: 0.8 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--ink)', marginBottom: '0.5rem' }}>No Active Selection Folder</h3>
            <p style={{ fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto 1.5rem auto' }}>
              Select a customer profile from the Timeline Selector pane on the left to load their global fleet and billing history.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand)', fontWeight: 700 }}>Service Timeline Folder</span>
                <h2 className="page-heading" style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.2rem' }}>{history.fullName}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: '0.2rem' }}>{history.phone} {history.email ? `· ${history.email}` : ""}</p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => onNavigate("customer-search")}>Back to Search</button>
            </div>

            <div className="staff-grid-2">
              <article className="card" style={{ padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                  <Car size={20} className="brand-icon" style={{ color: 'var(--brand)' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--ink)' }}>Registered Fleet Vehicles ({history.vehicles?.length ?? 0})</h3>
                </div>
                {history.vehicles?.length > 0 ? (
                  <div className="table-wrap">
                    <table className="table" style={{ fontSize: '0.82rem' }}>
                      <thead><tr><th>Plate</th><th>Make / Model</th><th>Year</th></tr></thead>
                      <tbody>
                        {history.vehicles.map((v) => (
                          <tr key={v.id}>
                            <td style={{ fontWeight: '700' }}>{v.licensePlate}</td>
                            <td>{v.make} {v.model}</td>
                            <td>{v.year}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>No vehicles registered on file.</p>}
              </article>

              <article className="card" style={{ padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                  <Receipt size={20} className="brand-icon" style={{ color: 'var(--brand)' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--ink)' }}>Billing Invoices ({history.invoices?.length ?? 0})</h3>
                </div>
                {history.invoices?.length > 0 ? (
                  <div className="table-wrap" style={{ maxHeight: 200, overflowY: 'auto', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    <table className="table" style={{ fontSize: '0.82rem', width: '100%', minWidth: '500px' }}>
                      <thead><tr><th>Number</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
                      <tbody>
                        {history.invoices.map((inv) => (
                          <tr key={inv.id}>
                            <td style={{ fontWeight: '700' }}>{inv.invoiceNumber}</td>
                            <td>{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                            <td>Rs {inv.totalAmount?.toLocaleString()}</td>
                            <td>
                              <span className={`status ${inv.status === "Paid" ? "good" : inv.status === "Cancelled" ? "danger" : "warn"}`}>
                                {inv.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>No historical invoices compiled.</p>}
              </article>
            </div>

            {history.purchasedParts?.length > 0 && (
              <article className="card" style={{ padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                  <Wrench size={20} className="brand-icon" style={{ color: 'var(--brand)' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--ink)' }}>Historical Parts Purchased</h3>
                </div>
                <div className="table-wrap">
                  <table className="table" style={{ fontSize: '0.82rem' }}>
                    <thead><tr><th>Part Description</th><th>Quantity</th><th>Date of Purchase</th></tr></thead>
                    <tbody>
                      {history.purchasedParts.slice((partPage - 1) * PARTS_PER_PAGE, partPage * PARTS_PER_PAGE).map((p, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: '600' }}>{p.partName}</td>
                          <td><strong>{p.quantity}</strong></td>
                          <td>{p.invoiceDate ? new Date(p.invoiceDate).toLocaleDateString() : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {history.purchasedParts.length > PARTS_PER_PAGE && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      disabled={partPage === 1}
                      onClick={() => setPartPage(p => p - 1)}
                    >
                      Previous
                    </button>
                    <span style={{ fontSize: '0.85rem', color: 'var(--ink)', fontWeight: '600' }}>
                      Page {partPage} of {Math.ceil(history.purchasedParts.length / PARTS_PER_PAGE)}
                    </span>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      disabled={partPage >= Math.ceil(history.purchasedParts.length / PARTS_PER_PAGE)}
                      onClick={() => setPartPage(p => p + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </article>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CustomerReports() {
  const [activeTab, setActiveTab] = useState("insights"); // "insights" or "sales"
  const [data, setData] = useState(null);
  const [salesReport, setSalesReport] = useState(null);
  const [salesPeriod, setSalesPeriod] = useState("daily");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/api/reports/staff").then((res) => setData(res.data)).catch(() => toast.error("Failed to load reports"));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/reports/sales?period=${salesPeriod}`)
      .then((res) => setSalesReport(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [salesPeriod]);

  if (!data) {
    return (
      <div className="card skeleton" style={{ height: '300px', borderRadius: 'var(--radius-md)' }}></div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <style>{`
        .trend-bar:hover {
          filter: brightness(1.15);
        }
        .trend-bar:hover .tooltip-value {
          opacity: 1 !important;
        }
        .kpi-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .report-tab-btn {
          transition: all 0.2s ease;
        }
        .report-tab-btn:hover {
          color: var(--ink) !important;
        }
      `}</style>

      {/* Tabs Header and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', padding: '10px 1.5rem', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button 
            className="report-tab-btn"
            onClick={() => setActiveTab("insights")}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 4px',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'insights' ? '800' : '600',
              color: activeTab === 'insights' ? 'var(--brand)' : 'var(--ink-soft)',
              borderBottom: activeTab === 'insights' ? '2.5px solid var(--brand)' : '2.5px solid transparent',
              cursor: 'pointer'
            }}
          >
            Insights &amp; Engagement
          </button>
          <button 
            className="report-tab-btn"
            onClick={() => setActiveTab("sales")}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 4px',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'sales' ? '800' : '600',
              color: activeTab === 'sales' ? 'var(--brand)' : 'var(--ink-soft)',
              borderBottom: activeTab === 'sales' ? '2.5px solid var(--brand)' : '2.5px solid transparent',
              cursor: 'pointer'
            }}
          >
            Financials &amp; Revenues
          </button>
        </div>

        {activeTab === "sales" && (
          <div style={{ display: 'flex', background: 'var(--surface-2)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            {["daily", "weekly", "monthly", "yearly"].map((p) => (
              <button 
                key={p} 
                onClick={() => setSalesPeriod(p)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'calc(var(--radius-sm) - 2px)',
                  border: 'none',
                  fontSize: '0.72rem',
                  fontWeight: salesPeriod === p ? '700' : '600',
                  background: salesPeriod === p ? 'var(--surface)' : 'transparent',
                  color: salesPeriod === p ? 'var(--brand)' : 'var(--ink-soft)',
                  boxShadow: salesPeriod === p ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeTab === "insights" ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="staff-grid-2">
            {/* Top Spenders Card */}
            <article className="card" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--brand-light)', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart3 size={18} style={{ color: 'var(--brand)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--ink)', margin: 0 }}>Top Spenders</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', margin: 0 }}>Customers with the highest cumulative invoice bills</p>
                </div>
              </div>
              <div className="table-wrap">
                <table className="table" style={{ fontSize: '0.82rem' }}>
                  <thead><tr><th>Customer Account</th><th style={{ textAlign: 'center' }}>Orders</th><th>Billing Strength</th><th style={{ textAlign: 'right' }}>Total Spent</th></tr></thead>
                  <tbody>
                    {data.topSpenders?.map((s) => {
                      const maxSpent = Math.max(...data.topSpenders.map((x) => x.totalSpent), 1);
                      const barPercent = (s.totalSpent / maxSpent) * 100;
                      return (
                        <tr key={s.customerId}>
                          <td>
                            <div style={{ fontWeight: '700', color: 'var(--ink)' }}>{s.customerName}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', marginTop: '2px' }}>📞 {s.phone}</div>
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: '600' }}>{s.orders}</td>
                          <td style={{ verticalAlign: 'middle', width: '110px' }}>
                            <div style={{ background: 'var(--surface-2)', height: '6px', borderRadius: '3px', width: '100%', overflow: 'hidden' }}>
                              <div style={{ background: 'var(--brand)', height: '100%', width: `${barPercent}%`, borderRadius: '3px' }}></div>
                            </div>
                          </td>
                          <td style={{ fontWeight: '700', color: 'var(--brand)', textAlign: 'right' }}>Rs {s.totalSpent?.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </article>

            {/* Regular Customers Card */}
            <article className="card" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--brand-light)', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={18} style={{ color: 'var(--brand)' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--ink)', margin: 0 }}>Regular Customers</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', margin: 0 }}>Clients categorized by frequency of visits &amp; bookings</p>
                </div>
              </div>
              <div className="table-wrap">
                <table className="table" style={{ fontSize: '0.82rem' }}>
                  <thead><tr><th>Customer Account</th><th>Total Visits</th><th>Completed Invoices</th><th>Loyalty Metric</th></tr></thead>
                  <tbody>
                    {data.regulars?.map((r) => {
                      const maxVisits = Math.max(...data.regulars.map((x) => x.visitCount), 1);
                      const rating = Math.min(Math.round((r.visitCount / maxVisits) * 100), 100);
                      return (
                        <tr key={r.customerId}>
                          <td>
                            <div style={{ fontWeight: '700', color: 'var(--ink)' }}>{r.customerName}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', marginTop: '2px' }}>{r.email || "No email on file"}</div>
                          </td>
                          <td style={{ fontWeight: '600' }}>{r.visitCount} visits</td>
                          <td>{r.invoiceCount} invoices</td>
                          <td>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', background: 'rgba(34, 197, 94, 0.12)', color: '#16a34a', padding: '3px 8px', borderRadius: '12px' }}>
                              ⚡ {rating}% score
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </article>
          </div>

          {/* Pending Overdue Credit Warnings */}
          {data.pendingCredits?.length > 0 && (
            <article className="card" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.12)', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldAlert size={18} style={{ color: '#ef4444' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--ink)', margin: 0 }}>Pending Overdue Credits Warnings</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', margin: 0 }}>Outstanding accounts requiring follow-up billing collection</p>
                </div>
              </div>
              <div className="table-wrap">
                <table className="table" style={{ fontSize: '0.82rem' }}>
                  <thead><tr><th>Customer Account</th><th>Outstanding Amount</th><th>Days Overdue</th><th>Oldest Pending Invoice Date</th><th>Contact Phone</th></tr></thead>
                  <tbody>
                    {data.pendingCredits.map((c) => (
                      <tr key={c.customerId}>
                        <td>
                          <div style={{ fontWeight: '700', color: 'var(--ink)' }}>{c.customerName}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', marginTop: '2px' }}>{c.email || "—"}</div>
                        </td>
                        <td style={{ fontWeight: '800', color: '#ef4444' }}>Rs {c.outstandingAmount?.toLocaleString()}</td>
                        <td>
                          <span className={`status ${c.daysOutstanding > 60 ? "danger" : "warn"}`} style={{ fontWeight: '700' }}>
                            {c.daysOutstanding} days
                          </span>
                        </td>
                        <td>{new Date(c.oldestPendingInvoiceDate).toLocaleDateString()}</td>
                        <td style={{ fontWeight: '600' }}>{c.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {loading ? (
            <div className="card skeleton" style={{ height: '350px', borderRadius: 'var(--radius-md)' }}></div>
          ) : !salesReport ? (
            <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem' }}>No sales data available.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Financial KPI Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                {[
                  {
                    title: "Gross Sales Revenue",
                    value: `Rs ${salesReport.totalRevenue?.toLocaleString()}`,
                    desc: `Total income in ${salesPeriod} scope`,
                    color: 'var(--brand)',
                    bg: 'var(--brand-light)'
                  },
                  {
                    title: "Average Ticket Value",
                    value: `Rs ${salesReport.averageOrderValue?.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
                    desc: "Average spent per invoice bill",
                    color: '#2563eb',
                    bg: 'rgba(37, 99, 235, 0.08)'
                  },
                  {
                    title: "Invoice Jobs Count",
                    value: `${salesReport.totalOrders} Orders`,
                    desc: "Invoices completed & settled",
                    color: '#16a34a',
                    bg: 'rgba(22, 163, 74, 0.08)'
                  },
                  {
                    title: "Distributed Parts Quantity",
                    value: `${salesReport.totalItemsSold} Items`,
                    desc: "Spare parts supplied from store",
                    color: '#ea580c',
                    bg: 'rgba(234, 88, 12, 0.08)'
                  }
                ].map((kpi, index) => (
                  <article key={index} className="card kpi-card" style={{ padding: '1.25rem', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '700' }}>{kpi.title}</span>
                    <span style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--ink)', fontFamily: 'Inter, sans-serif' }}>{kpi.value}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--ink-soft)' }}>{kpi.desc}</span>
                  </article>
                ))}
              </div>

              {/* Trend Chart and Top Parts Sold */}
              <div className="staff-grid-2">
                {/* Custom CSS Bar Chart */}
                <article className="card" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--ink)', margin: '0 0 4px 0' }}>Sales Revenue Trend</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', margin: '0 0 1.5rem 0' }}>Revenue growth and checkout count over {salesPeriod} intervals</p>
                  </div>
                  
                  {salesReport.revenueTrend?.length > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', gap: '12px', paddingBottom: '10px' }}>
                      {salesReport.revenueTrend.map((pt, idx) => {
                        const maxRev = Math.max(...salesReport.revenueTrend.map((p) => p.revenue), 1);
                        const percent = (pt.revenue / maxRev) * 100;
                        return (
                          <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                              <div 
                                className="trend-bar"
                                style={{ 
                                  width: '100%', 
                                  height: `${Math.max(percent, 8)}%`, 
                                  background: 'linear-gradient(180deg, var(--brand) 0%, var(--brand-light) 100%)', 
                                  borderRadius: '4px 4px 0 0',
                                  transition: 'height 0.4s ease',
                                  position: 'relative',
                                  cursor: 'pointer'
                                }}
                              >
                                <span className="tooltip-value" style={{ position: 'absolute', top: '-28px', left: '50%', transform: 'translateX(-50%)', background: 'var(--ink)', color: 'var(--surface)', fontSize: '0.7rem', padding: '3px 6px', borderRadius: '3px', whiteSpace: 'nowrap', opacity: 0, pointerEvents: 'none', transition: 'opacity 0.2s', zIndex: 10, boxShadow: 'var(--shadow-sm)' }}>
                                  Rs {pt.revenue > 1000 ? `${(pt.revenue / 1000).toFixed(1)}k` : pt.revenue} ({pt.orderCount} ord)
                                </span>
                              </div>
                            </div>
                            <span style={{ fontSize: '0.68rem', color: 'var(--ink-soft)', marginTop: '8px', textTransform: 'capitalize', fontWeight: '600' }}>{pt.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: '0.85rem', padding: '3rem 0' }}>No trend data recorded</p>
                  )}
                </article>

                {/* Top Parts Distributed */}
                <article className="card" style={{ padding: '1.75rem', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'rgba(234, 88, 12, 0.08)', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Wrench size={18} style={{ color: '#ea580c' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--ink)', margin: 0 }}>Top Sold Parts</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', margin: 0 }}>Highest performing spare parts and store items</p>
                    </div>
                  </div>
                  
                  {salesReport.topParts?.length > 0 ? (
                    <div className="table-wrap">
                      <table className="table" style={{ fontSize: '0.82rem' }}>
                        <thead><tr><th>Part Name</th><th style={{ textAlign: 'center' }}>Units Sold</th><th style={{ textAlign: 'right' }}>Total Income Generated</th></tr></thead>
                        <tbody>
                          {salesReport.topParts.map((part, index) => (
                            <tr key={index}>
                              <td style={{ fontWeight: '700', color: 'var(--ink)' }}>{part.partName}</td>
                              <td style={{ textAlign: 'center', fontWeight: '600' }}>{part.quantitySold} units</td>
                              <td style={{ fontWeight: '700', color: 'var(--brand)', textAlign: 'right' }}>Rs {part.totalRevenue?.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem' }}>No historical parts sales logged.</p>
                  )}
                </article>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StaffProfile({ onNavigate }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  const currentUser = getUser();

  const [profileData, setProfileData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: '',
    joinedDate: 'Recently'
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  // Load avatar and phone details on mount
  useEffect(() => {
    const savedImg = localStorage.getItem(`staff_profile_img_${currentUser?.email}`);
    if (savedImg) setProfileImage(savedImg);

    // Get phone detail from local storage or set default if already saved
    const savedPhone = localStorage.getItem(`staff_phone_${currentUser?.email}`) || '';
    setProfileData(prev => ({ ...prev, phone: savedPhone }));
  }, [currentUser?.email]);

  const handleProfileUpdate = (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    const loadToast = toast.loading("Saving changes...");

    api.put('/api/auth/profile', {
      fullName: profileData.fullName,
      phone: profileData.phone || undefined
    })
      .then((res) => {
        if (profileImage) {
          localStorage.setItem(`staff_profile_img_${currentUser?.email}`, profileImage);
        }
        localStorage.setItem(`staff_phone_${currentUser?.email}`, profileData.phone);
        
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
        localStorage.setItem(`staff_profile_img_${currentUser?.email}`, reader.result);
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
      {/* Page Header */}
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
                {profileImage ? <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (profileData?.fullName ? profileData.fullName.charAt(0) : 'S')}
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
            <div className="badge badge-brand">Staff Representative</div>
            
            <div style={{ marginTop: '2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                <Clock size={14} /> Joined {profileData.joinedDate}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                <Globe size={14} /> System Access: Counter
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
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Update your contact information and counter staff details below.</p>
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
                      placeholder="98XXXXXXXX"
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', padding: '1.25rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#065f46' }}>Verified Staff Profile</h4>
                  <p style={{ fontSize: '0.8rem', color: '#047857' }}>Your profile has active counter privileges and invoice management capability.</p>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.5rem' }}>Security & Password</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>Update your current account access credentials to maintain privacy and protection.</p>
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
