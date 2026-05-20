import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { 
  Bell, AlertTriangle, Package, ShoppingCart, 
  ChevronRight, RefreshCw, CheckCircle, Calendar, Wrench, Star, Car 
} from 'lucide-react';
import api from '../utils/api';

export default function NotificationDropdown({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const dropdownRef = useRef(null);

  const playNotificationSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      playTone(880, ctx.currentTime, 0.15); // A5
      playTone(1108.73, ctx.currentTime + 0.15, 0.25); // C#6
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const fetchAlerts = async () => {
    try {
      const [stockRes, bookRes, reqRes, revRes, vehRes] = await Promise.all([
        api.get('/api/parts/low-stock').catch(() => ({ data: [] })),
        api.get('/api/bookings').catch(() => ({ data: [] })),
        api.get('/api/part-requests').catch(() => ({ data: [] })),
        api.get('/api/reviews').catch(() => ({ data: [] })),
        api.get('/api/vehicles').catch(() => ({ data: [] }))
      ]);

      const parts = Array.isArray(stockRes.data) ? stockRes.data : [];
      const bookings = Array.isArray(bookRes.data) ? bookRes.data : [];
      const requests = Array.isArray(reqRes.data) ? reqRes.data : [];
      const reviews = Array.isArray(revRes.data) ? revRes.data : [];
      const vehicles = Array.isArray(vehRes.data) ? vehRes.data : [];

      const mappedAlerts = [];

      parts.forEach(p => {
        mappedAlerts.push({
          id: `stock-${p.id}`,
          type: 'stock',
          title: p.name,
          subtitle: `Only ${p.stockQuantity} remaining — Click to restock`,
          icon: AlertTriangle,
          color: 'var(--danger)',
          action: 'admin-create-purchase',
          data: p,
          date: new Date().getTime() // Keep high priority
        });
      });

      const addRecent = (items, prefix, titleFn, subFn, icon, color, action) => {
        items.forEach(i => {
          if (!i.createdAt) return;
          mappedAlerts.push({
            id: `${prefix}-${i.id}`,
            type: prefix,
            title: titleFn(i),
            subtitle: subFn(i),
            icon,
            color,
            action,
            data: i,
            date: new Date(i.createdAt).getTime()
          });
        });
      };

      addRecent(bookings, 'booking', b => `New Booking`, b => b.customerName || 'Customer booked service', Calendar, 'var(--brand)', 'admin-bookings');
      addRecent(requests, 'request', r => `Part Request`, r => r.partName || 'Customer requested part', Wrench, '#f59e0b', 'admin-part-requests');
      addRecent(reviews, 'review', r => `New Review: ${r.rating}/5`, r => r.customerName || 'Customer left a review', Star, '#10b981', 'admin-reviews');
      addRecent(vehicles, 'vehicle', v => `Vehicle Added`, v => `${v.make} ${v.model} (${v.licensePlate})`, Car, '#3b82f6', 'admin-vehicles');

      // Sort by date desc
      mappedAlerts.sort((a, b) => b.date - a.date);

      const stockAlerts = mappedAlerts.filter(a => a.type === 'stock');
      const actionAlerts = mappedAlerts.filter(a => a.type !== 'stock').slice(0, 15);
      
      const finalAlerts = [...stockAlerts, ...actionAlerts];

      setAlerts(prevAlerts => {
        let seenIds = [];
        try { seenIds = JSON.parse(localStorage.getItem('seenAlertIds') || '[]'); } catch (e) {}

        const newUnseen = finalAlerts.filter(a => !seenIds.includes(a.id));
        
        setUnseenCount(prevCount => {
          if (newUnseen.length > prevCount && newUnseen.length > 0) {
            playNotificationSound();
          }
          return newUnseen.length;
        });
        
        return finalAlerts;
      });

    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = () => {
    if (!isOpen) {
      const currentIds = alerts.map(a => a.id);
      localStorage.setItem('seenAlertIds', JSON.stringify(currentIds));
      setUnseenCount(0);
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const criticalCount = alerts.filter(a => a.type === 'stock').length;

  return (
    <div className="notification-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
      <button 
        className={`header-icon-btn ${isOpen ? 'active' : ''}`}
        onClick={toggleDropdown}
        style={{
          position: 'relative',
          background: isOpen ? 'var(--brand-light)' : 'transparent',
          color: isOpen ? 'var(--brand)' : 'var(--ink-soft)',
          border: 'none',
          padding: '8px',
          borderRadius: '50%',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Bell size={20} />
        {unseenCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            background: 'var(--danger)',
            color: 'white',
            fontSize: '10px',
            fontWeight: '900',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--surface)',
            animation: 'pulse 2s infinite'
          }}>
            {unseenCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown shadow-xl" style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '12px',
          width: '340px',
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
          zIndex: 9999,
          overflow: 'hidden',
          animation: 'fadeDown 0.2s ease'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)' }}>
            <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>System Alerts</span>
            {criticalCount > 0 && <span className="badge badge-danger">{criticalCount} Critical</span>}
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {alerts.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
                <CheckCircle size={32} color="var(--success)" style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.85rem' }}>No alerts found.</p>
              </div>
            ) : (
              alerts.slice(0, 15).map((alert, idx) => (
                <div key={`${alert.id}-${idx}`} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: `${alert.color}15`, color: alert.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <alert.icon size={20} />
                   </div>
                   <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--ink)' }}>{alert.title}</div>
                      <div style={{ fontSize: '0.75rem', color: alert.type === 'stock' ? 'var(--danger)' : 'var(--ink-soft)', fontWeight: alert.type === 'stock' ? '700' : '500' }}>
                        {alert.subtitle}
                      </div>
                   </div>
                   <button
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand)', padding: '4px' }}
                      onClick={() => { 
                        if (alert.type === 'stock') {
                          localStorage.setItem('restockPart', JSON.stringify(alert.data));
                        }
                        setIsOpen(false); 
                        onNavigate(alert.action); 
                      }}
                      title="View Details"
                   >
                      <ChevronRight size={16} />
                   </button>
                </div>
              ))
            )}
          </div>

          <div 
            onClick={() => { setIsOpen(false); onNavigate('admin-notifications'); }}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.75rem', fontSize: '0.8rem', fontWeight: '800', color: 'var(--brand)',
              background: 'var(--surface-2)', cursor: 'pointer'
            }}
          >
            View Full Notification Log <ChevronRight size={14} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(229, 62, 62, 0.4); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 6px rgba(229, 62, 62, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(229, 62, 62, 0); }
        }
      `}</style>
    </div>
  );
}
